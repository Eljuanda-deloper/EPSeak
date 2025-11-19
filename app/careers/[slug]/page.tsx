import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CareerDetail from '../../components/careers/CareerDetail';

interface Career {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetRole: string;
  image: string;
  slug: string;
  duration: string;
  level: string;
  modules: number;
  price: string;
  features: string[];
  curriculum: Array<{
    title: string;
    description: string;
    duration: string;
  }>;
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

const careers: Career[] = [
  {
    id: '1',
    title: 'English with an emphasis on automation',
    description: 'Master English in automation contexts with sequential modules designed for professionals in manufacturing, robotics, and industrial automation.',
    icon: '🤖',
    targetRole: 'Automation Professional',
    image: '/imagenes/Carreras/English%20with%20an%20emphasis%20on%20automation.png',
    slug: 'automation',
    duration: '40 hours',
    level: 'Intermediate to Advanced',
    modules: 8,
    price: '$299',
    features: [
      'Industry-specific vocabulary',
      'Technical documentation reading',
      'Safety protocol communication',
      'Equipment operation instructions',
      'Team collaboration in English',
      'Quality control terminology',
      'Maintenance and repair language',
      'International standards comprehension'
    ],
    curriculum: [
      {
        title: 'Basic Automation Concepts',
        description: 'Learn fundamental automation terminology and basic operational language',
        duration: '5 hours'
      },
      {
        title: 'Manufacturing Processes',
        description: 'Master vocabulary for production lines, assembly, and quality control',
        duration: '6 hours'
      },
      {
        title: 'Equipment and Machinery',
        description: 'Technical specifications, maintenance, and troubleshooting communication',
        duration: '7 hours'
      },
      {
        title: 'Safety and Compliance',
        description: 'Safety protocols, regulations, and emergency communication',
        duration: '5 hours'
      },
      {
        title: 'Team Communication',
        description: 'Effective collaboration with international teams and supervisors',
        duration: '4 hours'
      },
      {
        title: 'Documentation and Reports',
        description: 'Reading technical manuals, writing reports, and documentation',
        duration: '6 hours'
      },
      {
        title: 'Industry Standards',
        description: 'International standards, certifications, and compliance language',
        duration: '4 hours'
      },
      {
        title: 'Professional Development',
        description: 'Career advancement, interviews, and professional networking',
        duration: '3 hours'
      }
    ],
    testimonials: [
      {
        name: 'Carlos Rodríguez',
        role: 'Automation Engineer',
        company: 'TechManufacturing Inc.',
        content: 'Este programa transformó mi capacidad para trabajar con equipos internacionales. Ahora puedo leer documentación técnica en inglés sin problemas.',
        rating: 5
      },
      {
        name: 'María González',
        role: 'Production Manager',
        company: 'AutoTech Solutions',
        content: 'Los módulos especializados en automatización me dieron exactamente el vocabulario que necesitaba para mi trabajo diario.',
        rating: 5
      }
    ],
    faq: [
      {
        question: '¿Necesito experiencia previa en automatización?',
        answer: 'No es necesario tener experiencia previa en automatización. El programa está diseñado para profesionales que quieren aprender inglés técnico en este campo.'
      },
      {
        question: '¿Qué nivel de inglés necesito?',
        answer: 'Se recomienda un nivel intermedio (B1) de inglés general. Si tienes menos experiencia, podemos evaluar tu nivel inicial.'
      },
      {
        question: '¿Incluye práctica con equipos reales?',
        answer: 'El programa se enfoca en el lenguaje técnico. Para práctica con equipos reales, recomendamos combinarlo con capacitación técnica específica.'
      }
    ]
  },
  {
    id: '2',
    title: 'Business English Professional',
    description: 'Master English for international business communication, negotiations, and corporate environments with specialized modules for executives and professionals.',
    icon: '💼',
    targetRole: 'Business Professional',
    image: '/imagenes/Carreras/Business%20English%20Professional.png',
    slug: 'business',
    duration: '45 hours',
    level: 'Intermediate to Advanced',
    modules: 9,
    price: '$349',
    features: [
      'Executive communication skills',
      'Negotiation and persuasion',
      'International business etiquette',
      'Financial terminology',
      'Marketing and sales language',
      'Corporate presentations',
      'Email and report writing',
      'Cross-cultural communication'
    ],
    curriculum: [
      {
        title: 'Business Communication Fundamentals',
        description: 'Professional email writing, meetings, and basic corporate language',
        duration: '5 hours'
      },
      {
        title: 'Financial English',
        description: 'Accounting, finance, and investment terminology',
        duration: '6 hours'
      },
      {
        title: 'Marketing and Sales',
        description: 'Advertising, customer relations, and sales techniques',
        duration: '5 hours'
      },
      {
        title: 'Negotiations and Contracts',
        description: 'Negotiation strategies, contract language, and legal terms',
        duration: '7 hours'
      },
      {
        title: 'Presentations and Public Speaking',
        description: 'Creating and delivering effective business presentations',
        duration: '5 hours'
      },
      {
        title: 'International Business Culture',
        description: 'Cross-cultural communication and business etiquette',
        duration: '4 hours'
      },
      {
        title: 'Human Resources',
        description: 'Recruitment, performance reviews, and team management',
        duration: '4 hours'
      },
      {
        title: 'Crisis Management',
        description: 'Handling difficult situations and conflict resolution',
        duration: '5 hours'
      },
      {
        title: 'Career Advancement',
        description: 'Networking, interviews, and professional development',
        duration: '4 hours'
      }
    ],
    testimonials: [
      {
        name: 'Ana Martínez',
        role: 'Business Development Manager',
        company: 'Global Enterprises',
        content: 'Este programa me preparó perfectamente para mi rol internacional. Ahora manejo negociaciones complejas en inglés con confianza.',
        rating: 5
      },
      {
        name: 'Roberto Silva',
        role: 'Export Manager',
        company: 'Trade Solutions Ltd.',
        content: 'Los módulos de negociación y contratos me dieron las herramientas exactas que necesitaba para expandir nuestros mercados.',
        rating: 5
      }
    ],
    faq: [
      {
        question: '¿Es adecuado para emprendedores?',
        answer: 'Sí, el programa incluye módulos específicos para emprendedores que quieren expandir sus negocios internacionalmente.'
      },
      {
        question: '¿Incluye práctica de negociación?',
        answer: 'Sí, hay ejercicios prácticos de role-playing y simulaciones de negociaciones reales.'
      },
      {
        question: '¿Qué industrias cubre?',
        answer: 'El programa es versátil y se adapta a diferentes industrias: tecnología, manufactura, servicios, comercio, etc.'
      }
    ]
  },
  {
    id: '3',
    title: 'Medical English Professional',
    description: 'Develop English proficiency for healthcare professionals, medical terminology, and patient communication in international medical environments.',
    icon: '🏥',
    targetRole: 'Healthcare Professional',
    image: '/imagenes/Carreras/Medical%20English%20Professional.png',
    slug: 'medical',
    duration: '50 hours',
    level: 'Intermediate to Advanced',
    modules: 10,
    price: '$399',
    features: [
      'Medical terminology and anatomy',
      'Patient communication',
      'Clinical documentation',
      'Pharmaceutical vocabulary',
      'Emergency and trauma language',
      'Ethical and legal considerations',
      'Research and publications',
      'International healthcare standards'
    ],
    curriculum: [
      {
        title: 'Basic Medical Terminology',
        description: 'Anatomy, physiology, and fundamental medical vocabulary',
        duration: '6 hours'
      },
      {
        title: 'Patient Communication',
        description: 'Taking history, explaining conditions, and patient education',
        duration: '5 hours'
      },
      {
        title: 'Clinical Procedures',
        description: 'Describing examinations, treatments, and surgical procedures',
        duration: '6 hours'
      },
      {
        title: 'Emergency Medicine',
        description: 'Trauma, critical care, and emergency response communication',
        duration: '5 hours'
      },
      {
        title: 'Pharmaceutical English',
        description: 'Medications, prescriptions, and pharmacological terminology',
        duration: '4 hours'
      },
      {
        title: 'Mental Health',
        description: 'Psychiatric terminology and therapeutic communication',
        duration: '4 hours'
      },
      {
        title: 'Medical Documentation',
        description: 'Writing reports, discharge summaries, and medical records',
        duration: '5 hours'
      },
      {
        title: 'Research and Ethics',
        description: 'Clinical research, publications, and ethical considerations',
        duration: '5 hours'
      },
      {
        title: 'Healthcare Systems',
        description: 'International healthcare systems and administrative language',
        duration: '4 hours'
      },
      {
        title: 'Professional Development',
        description: 'Conferences, certifications, and career advancement',
        duration: '6 hours'
      }
    ],
    testimonials: [
      {
        name: 'Dr. Laura Jiménez',
        role: 'Emergency Physician',
        company: 'International Hospital',
        content: 'Este programa me permitió comunicarme efectivamente con pacientes internacionales y colegas de diferentes países.',
        rating: 5
      },
      {
        name: 'María Paz Torres',
        role: 'Clinical Researcher',
        company: 'Medical Research Institute',
        content: 'Los módulos de investigación médica me prepararon para publicar en revistas internacionales y colaborar en proyectos globales.',
        rating: 5
      }
    ],
    faq: [
      {
        question: '¿Necesito ser médico para tomar este curso?',
        answer: 'No, el programa está diseñado para todos los profesionales de la salud: médicos, enfermeras, técnicos, administrativos, etc.'
      },
      {
        question: '¿Incluye terminología especializada?',
        answer: 'Sí, cubrimos terminología de múltiples especialidades médicas y adaptamos el contenido según tus necesidades específicas.'
      },
      {
        question: '¿Cómo se maneja la confidencialidad?',
        answer: 'Todos los ejercicios y role-playing respetan estrictamente la confidencialidad médica y ética profesional.'
      }
    ]
  },
  {
    id: '4',
    title: 'Legal English Professional',
    description: 'Acquire specialized English for legal professionals, contracts, and international law practice with comprehensive legal terminology and communication skills.',
    icon: '⚖️',
    targetRole: 'Legal Professional',
    image: '/imagenes/Carreras/Legal%20English%20Professional.png',
    slug: 'legal',
    duration: '55 hours',
    level: 'Intermediate to Advanced',
    modules: 11,
    price: '$449',
    features: [
      'Legal terminology and concepts',
      'Contract drafting and review',
      'Courtroom communication',
      'International law principles',
      'Legal research and writing',
      'Client communication',
      'Mediation and arbitration',
      'Compliance and regulations'
    ],
    curriculum: [
      {
        title: 'Legal English Fundamentals',
        description: 'Basic legal concepts, terminology, and professional communication',
        duration: '6 hours'
      },
      {
        title: 'Contract Law',
        description: 'Drafting, reviewing, and negotiating contracts',
        duration: '7 hours'
      },
      {
        title: 'Corporate Law',
        description: 'Company law, mergers, acquisitions, and corporate governance',
        duration: '6 hours'
      },
      {
        title: 'Litigation and Court Proceedings',
        description: 'Courtroom language, evidence, and trial procedures',
        duration: '5 hours'
      },
      {
        title: 'Intellectual Property',
        description: 'Patents, trademarks, copyrights, and IP protection',
        duration: '4 hours'
      },
      {
        title: 'International Law',
        description: 'International treaties, arbitration, and cross-border issues',
        duration: '6 hours'
      },
      {
        title: 'Legal Research and Writing',
        description: 'Legal research methods, brief writing, and documentation',
        duration: '5 hours'
      },
      {
        title: 'Client Communication',
        description: 'Client interviews, advice giving, and professional ethics',
        duration: '4 hours'
      },
      {
        title: 'Compliance and Regulation',
        description: 'Regulatory compliance, anti-money laundering, and risk management',
        duration: '5 hours'
      },
      {
        title: 'Alternative Dispute Resolution',
        description: 'Mediation, arbitration, and negotiation techniques',
        duration: '4 hours'
      },
      {
        title: 'Professional Development',
        description: 'Bar exams, certifications, and international legal practice',
        duration: '3 hours'
      }
    ],
    testimonials: [
      {
        name: 'Abogado Juan Carlos Mendoza',
        role: 'International Law Specialist',
        company: 'Global Law Firm',
        content: 'Este programa me dio las herramientas necesarias para trabajar con clientes internacionales y manejar casos transfronterizos.',
        rating: 5
      },
      {
        name: 'Ana Belén Castro',
        role: 'Corporate Counsel',
        company: 'Multinational Corporation',
        content: 'Los módulos de contratos y cumplimiento normativo fueron cruciales para mi rol en una empresa global.',
        rating: 5
      }
    ],
    faq: [
      {
        question: '¿Es específico para un sistema legal?',
        answer: 'El programa cubre principios legales internacionales y se adapta a diferentes sistemas legales (common law, civil law, etc.).'
      },
      {
        question: '¿Necesito experiencia legal previa?',
        answer: 'Se recomienda tener conocimientos básicos de derecho. Si eres principiante, podemos ajustar el ritmo del programa.'
      },
      {
        question: '¿Prepara para exámenes internacionales?',
        answer: 'Sí, incluye preparación para exámenes como TOEIC Legal English y certificaciones internacionales.'
      }
    ]
  },
  {
    id: '5',
    title: 'Tech English Professional',
    description: 'Build English skills for technology professionals, technical documentation, and global tech teams with specialized vocabulary and communication tools.',
    icon: '💻',
    targetRole: 'Technology Professional',
    image: '/imagenes/Carreras/Tech%20English%20Professional.png',
    slug: 'tech',
    duration: '40 hours',
    level: 'Intermediate to Advanced',
    modules: 8,
    price: '$329',
    features: [
      'Technical documentation',
      'Software development terminology',
      'IT infrastructure language',
      'Project management communication',
      'Cybersecurity vocabulary',
      'Cloud computing concepts',
      'Agile methodology terms',
      'International tech standards'
    ],
    curriculum: [
      {
        title: 'Programming and Development',
        description: 'Software development, coding, and programming terminology',
        duration: '6 hours'
      },
      {
        title: 'IT Infrastructure',
        description: 'Networks, servers, databases, and system administration',
        duration: '5 hours'
      },
      {
        title: 'Cloud Computing',
        description: 'AWS, Azure, GCP terminology and cloud architecture',
        duration: '5 hours'
      },
      {
        title: 'Cybersecurity',
        description: 'Security concepts, threats, and protection strategies',
        duration: '4 hours'
      },
      {
        title: 'Project Management',
        description: 'Agile, Scrum, project planning, and team coordination',
        duration: '5 hours'
      },
      {
        title: 'Technical Writing',
        description: 'Documentation, manuals, API documentation, and user guides',
        duration: '5 hours'
      },
      {
        title: 'Data and Analytics',
        description: 'Big data, machine learning, AI, and analytics terminology',
        duration: '5 hours'
      },
      {
        title: 'Professional Communication',
        description: 'Tech conferences, interviews, and international collaboration',
        duration: '5 hours'
      }
    ],
    testimonials: [
      {
        name: 'Diego Ramírez',
        role: 'Software Architect',
        company: 'Tech Innovations Inc.',
        content: 'Este programa me permitió participar en proyectos internacionales y comunicarme efectivamente con equipos distribuidos.',
        rating: 5
      },
      {
        name: 'Carolina Vega',
        role: 'DevOps Engineer',
        company: 'Cloud Solutions Ltd.',
        content: 'Los módulos de cloud computing y infraestructura me dieron el vocabulario preciso para mi trabajo diario.',
        rating: 5
      }
    ],
    faq: [
      {
        question: '¿Qué tecnologías específicas cubre?',
        answer: 'Cubrimos un amplio espectro: desarrollo web/móvil, cloud, DevOps, ciberseguridad, datos, y más. Podemos adaptar según tus necesidades específicas.'
      },
      {
        question: '¿Es útil para no programadores?',
        answer: 'Sí, incluye módulos para product managers, diseñadores, QA engineers, y otros roles en tecnología.'
      },
      {
        question: '¿Incluye herramientas específicas?',
        answer: 'Enfocamos en conceptos y comunicación, no en herramientas específicas. Puedes aplicar el aprendizaje a cualquier stack tecnológico.'
      }
    ]
  }
];

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const career = careers.find(c => c.slug === params.slug);

  if (!career) {
    return {
      title: 'Career Not Found | EPSeak'
    };
  }

  return {
    title: `${career.title} | EPSeak`,
    description: career.description,
    keywords: `${career.targetRole}, English learning, professional development, ${career.slug}`,
    openGraph: {
      title: career.title,
      description: career.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return careers.map((career) => ({
    slug: career.slug,
  }));
}

export default function CareerPage({ params }: PageProps) {
  const career = careers.find(c => c.slug === params.slug);

  if (!career) {
    notFound();
  }

  return (
    <>
      <Header />
      <CareerDetail career={career} />
      <Footer />
    </>
  );
}