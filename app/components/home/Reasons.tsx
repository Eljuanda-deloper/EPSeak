"use client";
import { motion } from 'framer-motion';

interface ReasonCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const ReasonCard = ({ icon, title, description, index }: ReasonCardProps) => {
  const isEven = index % 2 === 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`
        bg-white p-10 rounded-2xl text-center transition-all duration-300
        shadow-lg hover:shadow-2xl
        border-t-4 ${isEven ? 'border-azul-petroleo' : 'border-azul-celeste'}
      `}
    >
      <div className={`text-5xl mb-4 ${isEven ? 'text-azul-petroleo' : 'text-azul-celeste'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-azul-petroleo mb-4">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const Reasons = () => {
  const reasons = [
    {
      icon: "🎯",
      title: "Contenido Laboral Específico",
      description: "Contenidos y ejercicios vinculados directamente a tu área laboral, garantizando relevancia y aplicabilidad inmediata."
    },
    {
      icon: "📚",
      title: "Programa de Autoestudio Único",
      description: "Único programa de autoestudio que combina inglés general con inglés técnico especializado en profesiones específicas."
    },
    {
      icon: "🤖",
      title: "Asistentes Virtuales IA",
      description: "Asistentes virtuales con IA para interacciones directas, corrigiendo pronunciación y estructura de oraciones."
    },
    {
      icon: "👥",
      title: "Comunidad Exclusiva",
      description: "Comunidad exclusiva de estudiantes con perfiles similares, fomentando conexiones valiosas y colaborativas."
    },
    {
      icon: "💼",
      title: "Actividades Profesionales Reales",
      description: "Actividades basadas en situaciones reales del mundo profesional, promoviendo aprendizaje práctico y contextualizado."
    },
    {
      icon: "📺",
      title: "Biblioteca Audiovisual",
      description: "Biblioteca rica en materiales técnicos audiovisuales en inglés para practicar y evaluar habilidades en lectura, comprensión, escritura, escucha y habla."
    }
  ];

  return (
    <section id="razones" className="bg-gris-suave py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          6 razones para elegirnos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <ReasonCard
              key={reason.title}
              {...reason}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reasons;
