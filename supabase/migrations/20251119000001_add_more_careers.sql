-- Add more career paths for EPSeak platform

INSERT INTO career_paths (title, description, icon, target_role, total_duration_hours) VALUES
(
  'Business English Professional',
  'Master English for international business communication, negotiations, and corporate environments',
  '💼',
  'Business Professional',
  45
),
(
  'Medical English Professional',
  'Develop English proficiency for healthcare professionals, medical terminology, and patient communication',
  '🏥',
  'Healthcare Professional',
  50
),
(
  'Legal English Professional',
  'Acquire specialized English for legal professionals, contracts, and international law practice',
  '⚖️',
  'Legal Professional',
  55
),
(
  'Tech English Professional',
  'Build English skills for technology professionals, technical documentation, and global tech teams',
  '💻',
  'Technology Professional',
  40
)
ON CONFLICT (title) DO NOTHING;