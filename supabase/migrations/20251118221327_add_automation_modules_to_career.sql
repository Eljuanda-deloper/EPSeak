-- Add automation modules to the "English with an emphasis on automation" career
-- These modules are designed for sequential learning with prerequisites

-- Insert first module: Introduction to Automation Concepts
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
    'Introduction to Automation Concepts',
    'Learn the fundamental concepts of automation, including basic terminology, workflow optimization, and introductory automation principles in English.',
    'automation',
    'Básico',
    8,
    6,
    true,
    1,
    '[]'::jsonb,
    '{"type": "completion", "required_modules": []}'::jsonb
);

-- Insert second module: Automation Tools and Technologies
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
    'Automation Tools and Technologies',
    'Explore essential automation tools, software platforms, and technologies used in modern automation workflows, with detailed English terminology.',
    'automation',
    'Intermedio',
    12,
    8,
    true,
    2,
    '["introduction-to-automation-concepts"]'::jsonb,
    '{"type": "completion", "required_modules": ["introduction-to-automation-concepts"]}'::jsonb
);

-- Insert lessons for the first module
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
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'What is Automation?',
    'Understanding the basic definition and scope of automation in modern workflows.',
    'text',
    'Automation refers to the use of technology to perform tasks with minimal human intervention. In business and technology contexts, automation streamlines processes, reduces errors, and increases efficiency. Key concepts include workflow optimization, repetitive task elimination, and system integration.',
    15,
    1,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'Types of Automation',
    'Exploring different categories of automation from simple scripts to complex AI systems.',
    'text',
    'Automation can be categorized into several types: robotic process automation (RPA), business process automation (BPA), IT automation, and artificial intelligence-driven automation. Each type serves different purposes and complexity levels.',
    20,
    2,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'Benefits and Challenges',
    'Analyzing the advantages of automation implementation and potential obstacles.',
    'text',
    'Key benefits include increased productivity, reduced operational costs, improved accuracy, and enhanced scalability. Challenges may involve initial implementation costs, employee training, and system integration complexities.',
    18,
    3,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'Automation in Business',
    'How automation transforms business operations and decision-making processes.',
    'text',
    'Business automation encompasses customer service chatbots, automated invoicing systems, inventory management, and predictive analytics. These tools enable businesses to operate more efficiently and make data-driven decisions.',
    22,
    4,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'Getting Started with Automation',
    'Practical steps for beginning an automation journey in your organization.',
    'text',
    'Start by identifying repetitive tasks, assessing current processes, selecting appropriate tools, and implementing pilot projects. Focus on quick wins while building toward more complex automation solutions.',
    16,
    5,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Introduction to Automation Concepts'),
    'Future of Automation',
    'Emerging trends and technologies shaping the future of automation.',
    'text',
    'The future includes advanced AI integration, machine learning algorithms, hyper-automation combining multiple technologies, and autonomous systems. Understanding these trends is crucial for long-term planning.',
    19,
    6,
    true
);

-- Insert lessons for the second module
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
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Robotic Process Automation (RPA)',
    'Deep dive into RPA tools and their applications in business processes.',
    'text',
    'RPA involves software robots that mimic human actions to perform repetitive tasks. Popular tools include UiPath, Automation Anywhere, and Microsoft Power Automate. These tools excel at data entry, report generation, and system integration.',
    25,
    1,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Workflow Automation Platforms',
    'Exploring comprehensive platforms for complex workflow automation.',
    'text',
    'Platforms like Zapier, Microsoft Power Automate, and Integromat enable users to create automated workflows connecting multiple applications. These tools use APIs and triggers to create sophisticated automation sequences.',
    28,
    2,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'API Integration Tools',
    'Understanding tools for connecting systems and applications through APIs.',
    'text',
    'API integration tools like Postman, Insomnia, and custom scripts enable seamless data flow between different software systems. Understanding REST APIs, webhooks, and authentication methods is crucial for modern automation.',
    24,
    3,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Monitoring and Analytics',
    'Tools for tracking automation performance and generating insights.',
    'text',
    'Monitoring tools help track automation success rates, identify bottlenecks, and optimize performance. Analytics platforms provide insights into process efficiency, cost savings, and ROI measurements.',
    22,
    4,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Security in Automation',
    'Best practices for maintaining security in automated systems.',
    'text',
    'Automation security involves access controls, data encryption, audit trails, and compliance monitoring. Understanding these principles ensures automated systems remain secure and compliant with regulations.',
    26,
    5,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Deployment and Scaling',
    'Strategies for deploying automation solutions at scale.',
    'text',
    'Successful deployment involves pilot testing, gradual rollout, user training, and continuous monitoring. Scaling requires infrastructure planning, resource allocation, and performance optimization.',
    23,
    6,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Maintenance and Updates',
    'Keeping automation systems current and effective over time.',
    'text',
    'Regular maintenance includes software updates, performance monitoring, user feedback incorporation, and process refinement. Understanding version control and change management is essential.',
    20,
    7,
    true
),
(
    (SELECT id FROM public.modules WHERE title = 'Automation Tools and Technologies'),
    'Advanced Automation Concepts',
    'Exploring cutting-edge automation technologies and methodologies.',
    'text',
    'Advanced concepts include AI-driven automation, machine learning integration, intelligent process mining, and autonomous decision-making systems. These technologies represent the future of automation.',
    27,
    8,
    true
);