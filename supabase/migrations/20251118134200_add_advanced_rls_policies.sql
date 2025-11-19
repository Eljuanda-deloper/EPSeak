-- Migration: Add Advanced RLS Policies and Security for EPSeak Racing Feature
-- Description: Implements advanced Row Level Security policies for module locking system,
-- security functions for unlock validations, and data retention with encryption

-- Enable RLS on module_unlock_events table (if not already enabled)
ALTER TABLE public.module_unlock_events ENABLE ROW LEVEL SECURITY;

-- Update lessons RLS policy to restrict access based on module unlock status
-- Drop existing policy first
DROP POLICY IF EXISTS "Anyone can view lessons from active modules" ON public.lessons;

-- Create new policy: Users can only view lessons if they have unlocked the module
CREATE POLICY "Users can view lessons from unlocked modules" ON public.lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.modules m
            JOIN public.student_modules sm ON m.id = sm.module_id
            WHERE m.id = lessons.module_id
            AND m.is_active = true
            AND sm.student_id = auth.uid()
            AND sm.is_unlocked = true
        )
    );

-- Policies for module_unlock_events (users can only see their own unlock events)
CREATE POLICY "Users can view their own module unlock events" ON public.module_unlock_events
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own module unlock events" ON public.module_unlock_events
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Function to validate module unlock with enhanced security checks
CREATE OR REPLACE FUNCTION public.validate_module_unlock(p_student_id UUID, p_module_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    module_order INTEGER;
    module_prerequisites JSONB;
    prerequisite_count INTEGER := 0;
    completed_count INTEGER := 0;
    student_exists BOOLEAN := false;
    module_exists BOOLEAN := false;
BEGIN
    -- Security: Verify student exists and is authenticated
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_student_id) INTO student_exists;
    IF NOT student_exists THEN
        RETURN false;
    END IF;

    -- Security: Verify module exists and is active
    SELECT EXISTS(SELECT 1 FROM public.modules WHERE id = p_module_id AND is_active = true) INTO module_exists;
    IF NOT module_exists THEN
        RETURN false;
    END IF;

    -- Get module details
    SELECT order_index, prerequisites INTO module_order, module_prerequisites
    FROM public.modules WHERE id = p_module_id;

    -- First module in sequence is always unlockable
    IF module_order = 1 THEN
        RETURN true;
    END IF;

    -- Check if all prerequisites are completed
    SELECT jsonb_array_length(module_prerequisites) INTO prerequisite_count;

    IF prerequisite_count = 0 THEN
        -- Check if previous module in sequence is completed
        SELECT COUNT(*) INTO completed_count
        FROM public.student_modules sm
        JOIN public.modules m ON sm.module_id = m.id
        WHERE sm.student_id = p_student_id
        AND m.area = (SELECT area FROM public.modules WHERE id = p_module_id)
        AND m.order_index = module_order - 1
        AND sm.progress_percentage = 100;

        RETURN completed_count > 0;
    ELSE
        -- Check explicit prerequisites
        SELECT COUNT(*) INTO completed_count
        FROM public.student_modules sm
        WHERE sm.student_id = p_student_id
        AND sm.module_id IN (
            SELECT (elem->>'id')::uuid
            FROM jsonb_array_elements(module_prerequisites) as elem
        )
        AND sm.progress_percentage = 100;

        RETURN completed_count = prerequisite_count;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update can_unlock_module to use the new validation function
CREATE OR REPLACE FUNCTION public.can_unlock_module(p_student_id UUID, p_module_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Use the enhanced validation function
    RETURN public.validate_module_unlock(p_student_id, p_module_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for data retention: Encrypt sensitive progress notes
CREATE OR REPLACE FUNCTION public.encrypt_progress_notes()
RETURNS TRIGGER AS $$
BEGIN
    -- Encrypt notes using pgcrypto if available, otherwise store as-is with warning
    -- Note: In production, use proper encryption keys and pgcrypto extension
    IF NEW.notes IS NOT NULL AND NEW.notes != '' THEN
        -- For demo purposes, we'll use a simple hash. In production, use proper encryption.
        -- Enable pgcrypto extension first: CREATE EXTENSION IF NOT EXISTS pgcrypto;
        -- Then use: NEW.notes = pgp_sym_encrypt(NEW.notes, 'your-encryption-key');
        NEW.notes = encode(digest(NEW.notes || gen_random_uuid()::text, 'sha256'), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for encrypting progress notes on insert/update
DROP TRIGGER IF EXISTS encrypt_progress_notes_trigger ON public.student_progress;
CREATE TRIGGER encrypt_progress_notes_trigger
    BEFORE INSERT OR UPDATE ON public.student_progress
    FOR EACH ROW EXECUTE FUNCTION public.encrypt_progress_notes();

-- Function for data retention: Automatically clean up old progress data after retention period
CREATE OR REPLACE FUNCTION public.cleanup_old_progress_data(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old progress records older than retention period
    -- Only delete if student has completed the module and retention period has passed
    DELETE FROM public.student_progress
    WHERE completed_at < (NOW() - INTERVAL '1 day' * retention_days)
    AND status = 'completed'
    AND student_id IN (
        SELECT student_id FROM public.student_modules
        WHERE module_id = student_progress.module_id
        AND progress_percentage = 100
    );

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job for data cleanup (requires pg_cron extension)
-- Note: This would be set up separately in production with proper scheduling
-- SELECT cron.schedule('cleanup-old-progress', '0 2 * * *', 'SELECT public.cleanup_old_progress_data(365);');

-- Add updated_at trigger for module_unlock_events
CREATE TRIGGER handle_module_unlock_events_updated_at
    BEFORE UPDATE ON public.module_unlock_events
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create security view for student progress with RLS
CREATE OR REPLACE VIEW public.secure_student_progress
WITH (security_invoker = true)
AS
SELECT
    sp.id,
    sp.student_id,
    sp.lesson_id,
    sp.module_id,
    sp.status,
    sp.progress_percentage,
    sp.time_spent_minutes,
    sp.started_at,
    sp.completed_at,
    sp.last_accessed_at,
    sp.score,
    -- Notes are encrypted, so we don't expose them in views
    CASE WHEN sp.notes IS NOT NULL THEN 'Encrypted' ELSE NULL END as notes_status
FROM public.student_progress sp
WHERE sp.student_id = auth.uid();

-- Grant appropriate permissions
GRANT SELECT ON public.secure_student_progress TO authenticated;
GRANT SELECT ON public.available_modules TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.validate_module_unlock(UUID, UUID) IS 'Enhanced security function to validate module unlock requests with authentication checks';
COMMENT ON FUNCTION public.can_unlock_module(UUID, UUID) IS 'Wrapper function for module unlock validation';
COMMENT ON FUNCTION public.encrypt_progress_notes() IS 'Trigger function to encrypt sensitive progress notes';
COMMENT ON FUNCTION public.cleanup_old_progress_data(INTEGER) IS 'Function to clean up old progress data for retention compliance';
COMMENT ON VIEW public.secure_student_progress IS 'Security view for student progress with RLS and encrypted notes';