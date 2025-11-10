-- Create modules table
CREATE TABLE public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    area VARCHAR(100) NOT NULL, -- e.g., 'Medicina', 'Legal', 'Negocios', etc.
    level VARCHAR(50) NOT NULL, -- 'Básico', 'Intermedio', 'Avanzado'
    duration_hours INTEGER NOT NULL,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lessons table
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'text', 'quiz', 'interactive'
    content_url TEXT, -- URL for video or content
    content_text TEXT, -- For text-based lessons
    duration_minutes INTEGER,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(module_id, order_index)
);

-- Create student_modules table (enrollment and progress tracking)
CREATE TABLE public.student_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_lesson_id UUID REFERENCES public.lessons(id),
    is_active BOOLEAN DEFAULT true,
    last_accessed_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(student_id, module_id)
);

-- Create student_progress table (detailed lesson progress)
CREATE TABLE public.student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100), -- For quizzes

    UNIQUE(student_id, lesson_id)
);

-- Create indexes for performance
CREATE INDEX idx_modules_area ON public.modules(area);
CREATE INDEX idx_modules_level ON public.modules(level);
CREATE INDEX idx_modules_active ON public.modules(is_active);

CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_order ON public.lessons(module_id, order_index);

CREATE INDEX idx_student_modules_student ON public.student_modules(student_id);
CREATE INDEX idx_student_modules_module ON public.student_modules(module_id);
CREATE INDEX idx_student_modules_progress ON public.student_modules(progress_percentage);

CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_student_progress_lesson ON public.student_progress(lesson_id);
CREATE INDEX idx_student_progress_module ON public.student_progress(module_id);
CREATE INDEX idx_student_progress_status ON public.student_progress(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Modules policies (everyone can read active modules)
CREATE POLICY "Anyone can view active modules" ON public.modules
    FOR SELECT USING (is_active = true);

-- Lessons policies (everyone can read lessons from active modules)
CREATE POLICY "Anyone can view lessons from active modules" ON public.lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.modules
            WHERE modules.id = lessons.module_id
            AND modules.is_active = true
        )
    );

-- Student modules policies (users can only see their own enrollments)
CREATE POLICY "Users can view their own module enrollments" ON public.student_modules
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can enroll themselves in modules" ON public.student_modules
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own module progress" ON public.student_modules
    FOR UPDATE USING (auth.uid() = student_id);

-- Student progress policies (users can only see/update their own progress)
CREATE POLICY "Users can view their own lesson progress" ON public.student_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own lesson progress" ON public.student_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own lesson progress" ON public.student_progress
    FOR UPDATE USING (auth.uid() = student_id);

-- Create views for statistics
CREATE VIEW public.module_stats AS
SELECT
    m.id,
    m.title,
    m.area,
    m.level,
    m.total_lessons,
    COUNT(DISTINCT sm.student_id) as enrolled_students,
    AVG(sm.progress_percentage) as avg_progress,
    COUNT(DISTINCT CASE WHEN sm.progress_percentage = 100 THEN sm.student_id END) as completed_students
FROM public.modules m
LEFT JOIN public.student_modules sm ON m.id = sm.module_id
WHERE m.is_active = true
GROUP BY m.id, m.title, m.area, m.level, m.total_lessons;

CREATE VIEW public.student_dashboard_stats AS
SELECT
    u.id as student_id,
    COUNT(DISTINCT sm.module_id) as enrolled_modules,
    COUNT(DISTINCT CASE WHEN sm.progress_percentage = 100 THEN sm.module_id END) as completed_modules,
    AVG(sm.progress_percentage) as overall_progress,
    SUM(EXTRACT(EPOCH FROM (COALESCE(sm.last_accessed_at, sm.enrolled_at) - sm.enrolled_at))/3600) as total_study_hours
FROM auth.users u
LEFT JOIN public.student_modules sm ON u.id = sm.student_id
GROUP BY u.id;