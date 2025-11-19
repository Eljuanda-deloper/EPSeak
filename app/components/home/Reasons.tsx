"use client";
import { motion } from 'framer-motion';
import { Target, BookOpen, Brain, Users, Briefcase, BarChart3 } from 'lucide-react';

interface ReasonCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ReasonCard = ({ icon, title, description, index }: ReasonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group h-full"
    >
      <div className={`
        bg-white h-full p-8 rounded-xl transition-all duration-300
        shadow-md hover:shadow-xl
        border border-gray-100 hover:border-azul-petroleo/30
        flex flex-col
      `}
      >
        {/* Icon Container */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="
            inline-flex items-center justify-center
            w-16 h-16 mb-6
            bg-gradient-to-br from-azul-petroleo/10 to-azul-celeste/10
            rounded-lg
            text-azul-petroleo
            group-hover:from-azul-petroleo/20 group-hover:to-azul-celeste/20
            transition-all duration-300
          "
        >
          {icon}
        </motion.div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {description}
        </p>

        {/* Decorative Bottom Border */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.2 }}
          className="h-0.5 bg-gradient-to-r from-azul-petroleo to-azul-celeste mt-6"
        />
      </div>
    </motion.div>
  );
};

const Reasons = () => {
  const reasons = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Contenido Laboral Específico",
      description: "Contenidos y ejercicios vinculados directamente a tu área laboral, garantizando relevancia y aplicabilidad inmediata."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Programa de Autoestudio Único",
      description: "Único programa de autoestudio que combina inglés general con inglés técnico especializado en profesiones específicas."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Asistentes Virtuales IA",
      description: "Asistentes virtuales con IA para interacciones directas, corrigiendo pronunciación y estructura de oraciones."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidad Exclusiva",
      description: "Comunidad exclusiva de estudiantes con perfiles similares, fomentando conexiones valiosas y colaborativas."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Actividades Profesionales Reales",
      description: "Actividades basadas en situaciones reales del mundo profesional, promoviendo aprendizaje práctico y contextualizado."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
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
