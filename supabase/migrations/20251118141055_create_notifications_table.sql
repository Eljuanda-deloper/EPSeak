-- Create notifications table for user notifications system
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('unlock', 'achievement', 'milestone', 'info')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Create function to generate notifications for module unlocks
CREATE OR REPLACE FUNCTION generate_module_unlock_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate notification if module was just unlocked
    IF NEW.is_unlocked = TRUE AND (OLD.is_unlocked = FALSE OR OLD.is_unlocked IS NULL) THEN
        INSERT INTO public.notifications (user_id, type, title, message, module_id)
        SELECT
            NEW.student_id,
            'unlock'::TEXT,
            '¡Nuevo módulo desbloqueado!'::TEXT,
            'Has completado todos los requisitos para "' || m.title || '"'::TEXT,
            NEW.module_id
        FROM public.modules m
        WHERE m.id = NEW.module_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for module unlock notifications
CREATE TRIGGER trigger_module_unlock_notification
    AFTER INSERT OR UPDATE ON public.student_modules
    FOR EACH ROW
    EXECUTE FUNCTION generate_module_unlock_notification();

-- Create function to generate achievement notifications
CREATE OR REPLACE FUNCTION generate_achievement_notifications()
RETURNS TRIGGER AS $$
DECLARE
    lesson_count INTEGER;
    module_count INTEGER;
BEGIN
    -- Count total completed lessons for this student
    SELECT COUNT(*) INTO lesson_count
    FROM public.student_progress
    WHERE student_id = NEW.student_id;

    -- Count completed modules for this student
    SELECT COUNT(*) INTO module_count
    FROM public.student_modules
    WHERE student_id = NEW.student_id AND completion_percentage = 100;

    -- Generate achievement notifications based on milestones
    IF lesson_count = 1 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'achievement', '¡Primer paso completado!', 'Has completado tu primera lección. ¡Excelente inicio!');
    ELSIF lesson_count = 5 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'milestone', '¡5 lecciones completadas!', 'Estás avanzando rápidamente en tu aprendizaje.');
    ELSIF lesson_count = 10 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'achievement', '¡Décimo logro!', 'Has completado 10 lecciones. ¡Sigue así!');
    ELSIF lesson_count = 25 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'achievement', '¡25 lecciones completadas!', '¡Eres un estudiante dedicado!');
    END IF;

    -- Module completion achievements
    IF module_count = 1 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'achievement', '¡Primer módulo completado!', '¡Felicitaciones por completar tu primer módulo!');
    ELSIF module_count = 3 THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (NEW.student_id, 'milestone', '¡3 módulos completados!', 'Estás construyendo una base sólida de conocimientos.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement notifications
CREATE TRIGGER trigger_achievement_notifications
    AFTER INSERT ON public.student_progress
    FOR EACH ROW
    EXECUTE FUNCTION generate_achievement_notifications();