-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  content_text TEXT,
  estimated_duration_minutes INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lesson_assets table
CREATE TABLE IF NOT EXISTS lesson_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('audio', 'image', 'video', 'document')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  duration_seconds INTEGER,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create student_lesson_progress table
CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, lesson_id)
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, order_position);
CREATE INDEX IF NOT EXISTS idx_lesson_assets_lesson_id ON lesson_assets(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_lesson_id ON student_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_lesson ON student_lesson_progress(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_completed ON student_lesson_progress(completed_at);

-- Add comments for documentation
COMMENT ON TABLE lessons IS 'Individual lessons within modules with text content and multimedia assets';
COMMENT ON TABLE lesson_assets IS 'Media files (audio, video, images, documents) attached to lessons';
COMMENT ON TABLE student_lesson_progress IS 'Tracks student progress through lessons including completion status and time spent';
