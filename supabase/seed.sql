-- Seed data for EPSeak educational platform

-- Insert sample modules
INSERT INTO public.modules (id, title, description, area, level, duration_hours, total_lessons, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Inglés Médico Básico', 'Aprende terminología médica esencial para comunicarte efectivamente en entornos clínicos.', 'Medicina', 'Básico', 8, 12, true),
('550e8400-e29b-41d4-a716-446655440002', 'Términos Legales', 'Domina el vocabulario jurídico necesario para abogados y profesionales del derecho.', 'Legal', 'Intermedio', 10, 15, true),
('550e8400-e29b-41d4-a716-446655440003', 'Inglés de Negocios', 'Desarrolla habilidades de comunicación empresarial para reuniones, presentaciones y negociaciones.', 'Negocios', 'Intermedio', 12, 18, true),
('550e8400-e29b-41d4-a716-446655440004', 'Inglés Técnico de Ingeniería', 'Aprende terminología técnica especializada para ingenieros y profesionales técnicos.', 'Ingeniería', 'Avanzado', 15, 20, true),
('550e8400-e29b-41d4-a716-446655440005', 'Inglés Financiero', 'Domina el lenguaje financiero para banqueros, contadores y profesionales de finanzas.', 'Finanzas', 'Intermedio', 11, 16, true),
('550e8400-e29b-41d4-a716-446655440006', 'Inglés para Turismo', 'Aprende vocabulario y frases para la industria turística y hotelera.', 'Turismo', 'Básico', 6, 10, true);

-- Insert sample lessons for "Inglés Médico Básico"
INSERT INTO public.lessons (id, module_id, title, description, content_type, content_text, duration_minutes, order_index, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Introducción a la Terminología Médica', 'Conceptos básicos y estructura del lenguaje médico.', 'text', 'La terminología médica se basa en raíces griegas y latinas...', 15, 1, true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Sistema Cardiovascular', 'Términos relacionados con el corazón y sistema circulatorio.', 'text', 'El sistema cardiovascular incluye términos como...', 20, 2, true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Sistema Respiratorio', 'Vocabulario para pulmones y vías respiratorias.', 'text', 'Los términos respiratorios incluyen...', 18, 3, true),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Sistema Digestivo', 'Términos para el aparato digestivo.', 'text', 'El sistema digestivo utiliza términos como...', 16, 4, true),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Sistema Nervioso', 'Vocabulario neurológico básico.', 'text', 'Los términos neurológicos incluyen...', 22, 5, true);

-- Insert sample lessons for "Términos Legales"
INSERT INTO public.lessons (id, module_id, title, description, content_type, content_text, duration_minutes, order_index, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Contratos y Acuerdos', 'Términos legales para contratos y acuerdos.', 'text', 'Los contratos legales incluyen términos como...', 25, 1, true),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Derecho Penal', 'Vocabulario para procedimientos penales.', 'text', 'El derecho penal utiliza términos como...', 30, 2, true),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Derecho Civil', 'Términos para derecho civil y familiar.', 'text', 'El derecho civil incluye conceptos como...', 28, 3, true);

-- Insert sample lessons for "Inglés de Negocios"
INSERT INTO public.lessons (id, module_id, title, description, content_type, content_text, duration_minutes, order_index, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Reuniones de Negocios', 'Vocabulario para meetings y conferencias.', 'text', 'Las reuniones de negocios requieren términos como...', 20, 1, true),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Presentaciones Corporativas', 'Lenguaje para presentaciones ejecutivas.', 'text', 'Las presentaciones incluyen frases como...', 25, 2, true),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Negociaciones', 'Términos para bargaining y acuerdos.', 'text', 'Las negociaciones utilizan expresiones como...', 22, 3, true);

-- Update total_lessons count in modules
UPDATE public.modules SET total_lessons = (
    SELECT COUNT(*) FROM public.lessons WHERE lessons.module_id = modules.id
) WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003'
);