-- Migration: Add Module Locking System for EPSeak Racing Feature
-- Description: Adds prerequisites, unlock criteria, and tracking for sequential module progression

-- Add new columns to modules table for locking system
ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS unlock_criteria JSONB DEFAULT '{"type": "completion", "required_modules": []}'::jsonb;

-- Add new columns to student_modules table for unlock tracking
ALTER TABLE public.student_modules
ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMP WITH TIME ZONE;

-- Create new table for module unlock events
CREATE TABLE IF NOT EXISTS public.module_unlock_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    unlocked_by_completion BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(student_id, module_id)
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON public.modules(order_index);
CREATE INDEX IF NOT EXISTS idx_modules_area_order ON public.modules(area, order_index);

CREATE INDEX IF NOT EXISTS idx_student_modules_unlocked ON public.student_modules(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_student_modules_unlocked_at ON public.student_modules(unlocked_at);

CREATE INDEX IF NOT EXISTS idx_module_unlock_events_student ON public.module_unlock_events(student_id);
CREATE INDEX IF NOT EXISTS idx_module_unlock_events_module ON public.module_unlock_events(module_id);
CREATE INDEX IF NOT EXISTS idx_module_unlock_events_unlocked_at ON public.module_unlock_events(unlocked_at);

-- Update existing modules to have sequential order_index based on area
-- This ensures existing modules have proper ordering for the locking system
UPDATE public.modules
SET order_index = sub.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY area ORDER BY created_at) as row_num
    FROM public.modules
) sub
WHERE public.modules.id = sub.id;

-- Create view for available modules per student (considering unlock criteria)
CREATE OR REPLACE VIEW public.available_modules AS
SELECT
    m.*,
    CASE
        WHEN m.order_index = 1 THEN true -- First module in area is always available
        WHEN m.prerequisites = '[]'::jsonb THEN
            EXISTS (
                SELECT 1 FROM public.student_modules sm
                WHERE sm.student_id = auth.uid()
                AND sm.module_id IN (
                    SELECT (elem->>'id')::uuid
                    FROM jsonb_array_elements(m.prerequisites) as elem
                )
                AND sm.progress_percentage = 100
            )
        ELSE false
    END as is_available_for_student
FROM public.modules m
WHERE m.is_active = true;

-- Create function to check if module can be unlocked
CREATE OR REPLACE FUNCTION public.can_unlock_module(p_student_id UUID, p_module_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    module_order INTEGER;
    module_prerequisites JSONB;
    prerequisite_count INTEGER := 0;
    completed_count INTEGER := 0;
BEGIN
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

-- Create trigger function for automatic module unlocking
CREATE OR REPLACE FUNCTION public.handle_module_unlock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger on completion updates
    IF NEW.progress_percentage = 100 AND (OLD.progress_percentage IS NULL OR OLD.progress_percentage < 100) THEN
        -- Find modules that can now be unlocked
        INSERT INTO public.module_unlock_events (student_id, module_id, unlocked_by_completion)
        SELECT
            NEW.student_id,
            m.id,
            true
        FROM public.modules m
        WHERE m.is_active = true
        AND public.can_unlock_module(NEW.student_id, m.id) = true
        AND NOT EXISTS (
            SELECT 1 FROM public.student_modules sm
            WHERE sm.student_id = NEW.student_id
            AND sm.module_id = m.id
        )
        ON CONFLICT (student_id, module_id) DO NOTHING;

        -- Update student_modules to mark as unlocked
        UPDATE public.student_modules
        SET is_unlocked = true, unlocked_at = NOW()
        WHERE student_id = NEW.student_id
        AND module_id IN (
            SELECT m.id
            FROM public.modules m
            WHERE public.can_unlock_module(NEW.student_id, m.id) = true
        )
        AND is_unlocked = false;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic unlocking
DROP TRIGGER IF EXISTS trigger_module_unlock ON public.student_modules;
CREATE TRIGGER trigger_module_unlock
    AFTER UPDATE ON public.student_modules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_module_unlock();

-- Update trigger for updated_at on new table
CREATE TRIGGER handle_module_unlock_events_updated_at
    BEFORE UPDATE ON public.module_unlock_events
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();