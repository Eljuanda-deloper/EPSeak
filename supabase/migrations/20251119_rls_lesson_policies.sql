-- RLS Policies for lessons table
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read lessons from enrolled careers
CREATE POLICY "lessons_read_enrolled_career" ON lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM student_careers sc
      WHERE sc.student_id = auth.uid()
      AND sc.career_id = (
        SELECT career_id FROM modules WHERE id = lessons.module_id
      )
      AND sc.is_enrolled = TRUE
    )
  );

-- Policy: Admins can do everything on lessons
CREATE POLICY "lessons_admin_all" ON lessons
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for lesson_assets table
ALTER TABLE lesson_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read assets from lessons they're enrolled in
CREATE POLICY "lesson_assets_read_enrolled" ON lesson_assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN student_careers sc ON m.career_id = sc.career_id
      WHERE l.id = lesson_assets.lesson_id
      AND sc.student_id = auth.uid()
      AND sc.is_enrolled = TRUE
    )
  );

-- Policy: Admins can do everything on assets
CREATE POLICY "lesson_assets_admin_all" ON lesson_assets
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for student_lesson_progress table
ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Students can only see their own progress
CREATE POLICY "progress_read_own" ON student_lesson_progress
  FOR SELECT
  USING (student_id = auth.uid());

-- Policy: Students can insert their own progress
CREATE POLICY "progress_insert_own" ON student_lesson_progress
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Policy: Students can update their own progress
CREATE POLICY "progress_update_own" ON student_lesson_progress
  FOR UPDATE
  USING (student_id = auth.uid());

-- Policy: Admins can do everything
CREATE POLICY "progress_admin_all" ON student_lesson_progress
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
