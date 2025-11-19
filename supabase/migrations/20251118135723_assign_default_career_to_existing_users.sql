-- Asignar la carrera por defecto "English with an emphasis on automation" a todos los usuarios existentes

-- Insertar la carrera si no existe
INSERT INTO career_paths (title, description, icon, target_role, total_duration_hours)
VALUES (
  'English with an emphasis on automation',
  'Master English in automation contexts with sequential modules',
  '🤖',
  'Automation Professional',
  40
)
ON CONFLICT (title) DO NOTHING;

-- Asignar la carrera a todos los usuarios existentes que no la tengan
INSERT INTO student_careers (student_id, career_path_id, enrolled_at)
SELECT
  u.id as student_id,
  cp.id as career_path_id,
  NOW() as enrolled_at
FROM auth.users u
CROSS JOIN career_paths cp
WHERE cp.title = 'English with an emphasis on automation'
AND NOT EXISTS (
  SELECT 1 FROM student_careers sc
  WHERE sc.student_id = u.id AND sc.career_path_id = cp.id
);

-- Actualizar current_career_id en profiles para usuarios existentes
UPDATE profiles
SET current_career_id = (
  SELECT id FROM career_paths WHERE title = 'English with an emphasis on automation'
)
WHERE current_career_id IS NULL;