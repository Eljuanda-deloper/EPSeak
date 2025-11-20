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
import Button from '../shared/Button';

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

          {/* Key Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: Clock, label: "Duración", value: career.duration },
              { icon: Target, label: "Nivel", value: career.level },
              { icon: BookOpen, label: "Módulos", value: career.modules.toString() },
              { icon: Award, label: "Certificación", value: "Internacional" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-azul-celeste mx-auto mb-3" />
                <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-white/90 text-lg">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="px-8 py-4 text-lg font-semibold shadow-2xl">
              <span className="flex items-center gap-2">
                Comenzar Programa
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button
              variant="secondary"
              className="px-8 py-4 text-lg border-white/30 hover:bg-white/10 text-white"
              onClick={() => scrollToSection('curriculum')}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Ver Curriculum
              </span>
            </Button>
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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-azul-celeste/10 to-azul-petroleo/10 border border-azul-celeste/20 mb-8">
              <Target className="w-6 h-6 text-azul-celeste" />
              <span className="text-azul-petroleo font-semibold text-sm uppercase tracking-wide">Programa Especializado</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              ¿Qué aprenderás?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Desarrolla las competencias especializadas que te posicionarán como líder en tu campo profesional
            </p>
          </motion.div>

          {/* Career Image */}
          {/* Removed - Image is now in hero section */}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {career.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-azul-celeste/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-azul-celeste to-azul-petroleo rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {feature}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 max-w-md mx-auto"
          >
            <div className="bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-2xl p-8 text-center text-white shadow-xl">
              <div className="text-4xl font-bold mb-2">{career.price}</div>
              <div className="text-white/90 mb-6">Programa completo</div>
              <Button className="w-full bg-white text-azul-petroleo hover:bg-gray-50 font-semibold">
                Inscribirme Ahora
              </Button>
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
              <Button
                variant="secondary"
                onClick={() => setShowAllCurriculum(!showAllCurriculum)}
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {showAllCurriculum ? 'Ver menos módulos' : `Ver todos los módulos (${career.curriculum.length})`}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Historias de Éxito
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Profesionales como tú que transformaron sus carreras con nuestros programas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {career.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial content */}
                <blockquote className="text-gray-700 text-lg mb-8 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Resolvemos tus dudas sobre el programa
            </p>
          </motion.div>

          <div className="space-y-4">
            {career.faq.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-azul-petroleo transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-azul-celeste" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-azul-celeste transition-colors" />
                    )}
                  </div>
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6 border-t border-gray-100"
                  >
                    <p className="text-gray-600 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
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
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para transformar tu carrera?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Únete a miles de profesionales que ya dominan el inglés en sus campos especializados
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="px-10 py-4 text-lg font-semibold shadow-2xl bg-white text-azul-petroleo hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  Comenzar Programa
                  <Zap className="w-5 h-5" />
                </span>
              </Button>
              <Button variant="secondary" className="px-10 py-4 text-lg border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Consulta Gratuita
                </span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Garantía de satisfacción</div>
                  <div className="text-sm text-white/70">30 días de devolución</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Acceso global</div>
                  <div className="text-sm text-white/70">Aprende desde cualquier lugar</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Certificación reconocida</div>
                  <div className="text-sm text-white/70">Valorada internacionalmente</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetail;