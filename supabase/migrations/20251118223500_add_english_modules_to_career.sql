-- Add English General and English Specific modules to the career
-- These modules focus on general and specific English skills

-- Insert English General module
INSERT INTO public.modules (
    title,
    description,
    area,
    level,
    duration_hours,
    total_lessons,
    is_active,
    order_index,
    prerequisites,
    unlock_criteria
) VALUES (
    'Inglés General',
    'Módulo básico de inglés general que cubre gramática, vocabulario y comunicación básica en contextos cotidianos.',
    'english',
    'Básico',
    10,
    8,
    true,
    3,
    '[]'::jsonb,
    '{"type": "completion", "required_modules": []}'::jsonb
);

-- Insert English Specific module
INSERT INTO public.modules (
    title,
    description,
    area,
    level,
    duration_hours,
    total_lessons,
    is_active,
    order_index,
    prerequisites,
    unlock_criteria
) VALUES (
    'Inglés Específico',
    'Módulo avanzado de inglés específico enfocado en terminología técnica, automation y contextos profesionales.',
    'english',
    'Intermedio',
    15,
    10,
    true,
    4,
    '["inglés-general"]'::jsonb,
    '{"type": "completion", "required_modules": ["inglés-general"]}'::jsonb
);

-- Insert lessons for English General module
INSERT INTO public.lessons (
    module_id,
    title,
    description,
    content_type,
    content_text,
    duration_minutes,
    order_index,
    is_active
) VALUES
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Saludos y Presentaciones',
    'Aprender expresiones básicas de saludo y presentación en inglés.',
    'text',
    'Hello, Hi, Good morning, Good afternoon, Good evening. My name is..., Nice to meet you, How are you?, I am fine, thank you.',
    15,
    1,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Números y Fechas',
    'Vocabulario básico para números, días de la semana y meses.',
    'text',
    'One, two, three... Monday, Tuesday... January, February... What is the date today? Today is...',
    20,
    2,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Familia y Relaciones',
    'Palabras relacionadas con la familia y relaciones personales.',
    'text',
    'Mother, father, brother, sister, husband, wife, son, daughter, friend, colleague.',
    18,
    3,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Comida y Bebida',
    'Vocabulario para alimentos y bebidas comunes.',
    'text',
    'Breakfast, lunch, dinner, water, coffee, tea, bread, rice, meat, vegetables, fruit.',
    22,
    4,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Tiempo y Clima',
    'Expresiones para describir el tiempo y el clima.',
    'text',
    'Sunny, cloudy, rainy, windy, hot, cold, warm, What is the weather like today?',
    16,
    5,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Verbos Básicos',
    'Verbos comunes en presente simple.',
    'text',
    'To be, to have, to do, to go, to come, to eat, to drink, to sleep, to work, to study.',
    19,
    6,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Preguntas y Respuestas',
    'Cómo hacer preguntas y dar respuestas en inglés.',
    'text',
    'What, Where, When, Why, How, Who, Yes, No, Please, Thank you, You are welcome.',
    21,
    7,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés General'),
    'Rutinas Diarias',
    'Describir rutinas y actividades diarias.',
    'text',
    'I wake up, I brush my teeth, I have breakfast, I go to work, I come home, I watch TV, I go to bed.',
    17,
    8,
    true
);

-- Insert lessons for English Specific module
INSERT INTO public.lessons (
    module_id,
    title,
    description,
    content_type,
    content_text,
    duration_minutes,
    order_index,
    is_active
) VALUES
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Terminología de Automation',
    'Vocabulario específico relacionado con automation y procesos automatizados.',
    'text',
    'Automation, workflow, process, efficiency, optimization, robotic process automation (RPA), artificial intelligence (AI), machine learning.',
    25,
    1,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Herramientas y Software',
    'Nombres de herramientas y software comunes en automation.',
    'text',
    'UiPath, Automation Anywhere, Microsoft Power Automate, Zapier, API, integration, platform, dashboard.',
    28,
    2,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Procesos Empresariales',
    'Términos relacionados con procesos de negocio y optimización.',
    'text',
    'Business process, workflow optimization, data entry, report generation, customer service, inventory management.',
    24,
    3,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Tecnologías Emergentes',
    'Vocabulario para tecnologías avanzadas en automation.',
    'text',
    'Hyper-automation, intelligent automation, cognitive automation, autonomous systems, predictive analytics.',
    22,
    4,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Seguridad y Cumplimiento',
    'Términos relacionados con seguridad y cumplimiento en sistemas automatizados.',
    'text',
    'Security, compliance, access control, data encryption, audit trail, risk assessment, GDPR, cybersecurity.',
    26,
    5,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Implementación y Escalabilidad',
    'Vocabulario para la implementación y escalado de soluciones de automation.',
    'text',
    'Deployment, scaling, pilot project, rollout, infrastructure, resource allocation, performance monitoring.',
    23,
    6,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Mantenimiento y Actualizaciones',
    'Términos para el mantenimiento continuo de sistemas automatizados.',
    'text',
    'Maintenance, updates, version control, change management, troubleshooting, system monitoring, user feedback.',
    20,
    7,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Análisis y Métricas',
    'Vocabulario para análisis de rendimiento y métricas.',
    'text',
    'Analytics, metrics, key performance indicators (KPIs), return on investment (ROI), efficiency gains, cost savings.',
    27,
    8,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Colaboración y Comunicación',
    'Términos para comunicación en entornos de automation.',
    'text',
    'Stakeholder, team collaboration, project management, requirements gathering, user training, documentation.',
    21,
    9,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Inglés Específico'),
    'Tendencias Futuras',
    'Vocabulario para tendencias emergentes en automation.',
    'text',
    'Digital transformation, Industry 4.0, Internet of Things (IoT), edge computing, quantum computing, ethical AI.',
    29,
    10,
    true
);