-- Insertar la carrera por defecto para el sistema EPSeak

INSERT INTO career_paths (title, description, icon, target_role, total_duration_hours) VALUES
(
  'English with an emphasis on automation',
  'Master English in automation contexts with sequential modules',
  '🤖',
  'Automation Professional',
  40
)
ON CONFLICT (title) DO NOTHING;