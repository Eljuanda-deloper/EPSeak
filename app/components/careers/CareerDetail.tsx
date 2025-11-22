'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  Clock,
  Users,
  Award,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Play,
  BookOpen,
  Target,
  Zap,
  Globe,
  Shield,
  Heart,
  Calendar,
  DollarSign,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee';

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

interface CareerDetailProps {
  career: Career;
}

const CareerDetail = ({ career }: CareerDetailProps) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAllCurriculum, setShowAllCurriculum] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const displayedCurriculum = showAllCurriculum ? career.curriculum : career.curriculum.slice(0, 4);

  // Smooth scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image - Positioned behind everything */}
        {career.image && (
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${career.image})`
            }}
          />
        )}

        {/* Dark overlay to darken the image */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-azul-petroleo/80 to-azul-celeste/80 z-20" />

        {/* Animated background elements */}
        <div className="absolute inset-0 z-30">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(124,196,224,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(226, 31, 45, 0.2) 0%, transparent 50%)"
            }}
          />
        </div>

        <div className="relative z-40 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-2xl">{career.icon}</span>
              <span className="text-white/90 text-sm font-medium">Programa Especializado</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {career.title}
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12">
              {career.description}
            </p>
          </motion.div>



          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button style={{ color: '#FFFFFF', backgroundColor: '#E0312D' }} className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 hover:bg-red-600">
              Comenzar Programa
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full border-2 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              onClick={() => scrollToSection('curriculum')}
            >
              <BookOpen className="w-5 h-5" />
              Ver Curriculum
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center cursor-pointer hover:border-white/60 transition-colors"
            onClick={() => scrollToSection('overview')}
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Overview Section */}
      <section id="overview" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                ¿Qué aprenderás?
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Desarrolla las competencias que necesitas para destacar en un entorno profesional internacional.
              </p>
            </motion.div>

            {/* Right Column - Features List */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {career.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-azul-petroleo flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-azul-petroleo" />
                    </div>
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 max-w-sm mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header with red accent */}
              <div className="bg-gradient-to-r from-rojo-brillante to-red-600 px-12 pt-12 pb-8">
                <div className="text-white text-center">
                  <div className="text-sm font-medium text-red-100 mb-3">Precio Especial</div>
                  <div className="text-5xl font-bold text-white">$249</div>
                </div>
              </div>

              {/* Body */}
              <div className="px-12 py-8">
                <div className="text-gray-600 text-center text-sm mb-8">
                  Acceso completo al programa de {career.modules} módulos
                </div>
                <button className="w-full bg-rojo-brillante text-white hover:bg-red-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95">
                  Inscribirme Ahora
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Plan de Estudios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un currículo estructurado diseñado por expertos para maximizar tu aprendizaje
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-azul-petroleo to-azul-celeste"></div>

            <div className="space-y-8">
              {displayedCurriculum.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-8"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white border-4 border-azul-celeste rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-azul-petroleo font-bold text-lg">{index + 1}</span>
                  </div>

                  {/* Content card */}
                  <div className="flex-grow bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{module.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {career.curriculum.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <button
                onClick={() => setShowAllCurriculum(!showAllCurriculum)}
                className="px-8 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                {showAllCurriculum ? 'Ver menos módulos' : `Ver todos los módulos (${career.curriculum.length})`}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section with Marquee */}
      <TestimonialsSection
        title="Lo que dicen nuestros estudiantes"
        description="Historias reales de profesionales que transformaron su carrera"
        testimonials={career.testimonials.map((testimonial, index) => {
          const avatarImages = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507214159519-1a373571b636?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506336584489-27f5c0dd7e61?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1524666666564-c68968c77e8e?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          ]
          return {
            author: {
              name: testimonial.name,
              handle: testimonial.role,
              avatar: avatarImages[index % avatarImages.length]
            },
            text: testimonial.content,
          }
        })}
        className="bg-white"
      />

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600">
              Resolvemos tus dudas sobre el programa
            </p>
          </motion.div>

          <div className="space-y-3">
            {career.faq.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between bg-white border border-gray-200 rounded-xl hover:border-azul-petroleo/50 transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-900 pr-4 group-hover:text-azul-petroleo transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 text-azul-petroleo group-hover:text-azul-celeste transition-colors">
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gradient-to-br from-azul-celeste/5 to-azul-petroleo/5 border-l-4 border-azul-petroleo">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-azul-petroleo via-azul-celeste to-azul-petroleo">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 md:p-16 border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Listo para transformar tu carrera?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Únete a miles de profesionales que ya dominan el inglés en sus campos especializados
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button style={{ color: '#FFFFFF', backgroundColor: '#E0312D' }} className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 hover:bg-red-600">
                Comenzar Programa
                <Zap className="w-5 h-5" />
              </button>
              <button style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }} className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-semibold rounded-full border-2 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                <Heart className="w-5 h-5" />
                Consulta Gratuita
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">Garantía de satisfacción</div>
                  <div className="text-sm text-white/70">30 días de devolución</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">Acceso global</div>
                  <div className="text-sm text-white/70">Aprende desde cualquier lugar</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">Certificación reconocida</div>
                  <div className="text-sm text-white/70">Valorada internacionalmente</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetail;