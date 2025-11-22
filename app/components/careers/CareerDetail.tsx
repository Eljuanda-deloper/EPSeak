'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import {
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  Zap,
  Globe,
  Shield,
  Check,
  Star,
  PlayCircle,
  Layers
} from 'lucide-react';
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee';
import { cn } from '@/lib/utils';

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

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const displayedCurriculum = showAllCurriculum ? career.curriculum : career.curriculum.slice(0, 5);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gris-suave font-sans selection:bg-azul-petroleo/20">
      {/* --- Cinematic Hero Section --- */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[600px] h-[75vh] max-h-[800px] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          {career.image && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${career.image})` }}
            />
          )}
          {/* Multi-layer gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-azul-petroleo/70 to-azul-petroleo/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-xl"
              >
                <span className="text-xl filter drop-shadow-lg">{career.icon}</span>
                <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">Programa Profesional</span>
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                {career.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl border-l-2 border-azul-celeste pl-4">
                {career.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-4 border-t border-white/10">
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Duración</div>
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-azul-celeste flex-shrink-0" />
                    <span className="text-xs">{career.duration}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Nivel</div>
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-azul-celeste flex-shrink-0" />
                    <span className="text-xs">{career.level}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Módulos</div>
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-azul-celeste flex-shrink-0" />
                    <span className="text-xs">{career.modules}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button className="group relative px-6 py-3 bg-rojo-brillante text-white font-bold rounded-full overflow-hidden shadow-[0_0_30px_-10px_rgba(224,49,45,0.5)] hover:shadow-[0_0_50px_-10px_rgba(224,49,45,0.7)] transition-all duration-300 hover:-translate-y-1">
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                    Comenzar Ahora <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rojo-brillante opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => scrollToSection('curriculum')}
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm"
                >
                  <PlayCircle className="w-4 h-4" /> Ver Plan de Estudios
                </button>
              </div>
            </motion.div>

            {/* Right: Visual/Abstract Element (Optional, keeps focus on text/bg) */}
            <div className="hidden lg:block relative h-full">
              {/* Could add a floating 3D element or abstract shape here if desired */}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-widest">Descubre más</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </motion.section>

      {/* --- Overview & Features Section --- */}
      <section id="overview" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-azul-celeste/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">

            {/* Left: Sticky Content */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azul-petroleo/5 text-azul-petroleo text-xs sm:text-sm font-medium"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> Por qué este programa
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Domina el lenguaje de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-azul-petroleo to-azul-celeste">futuro profesional</span>.
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Este programa no es solo un curso de inglés. Es una inmersión estratégica diseñada para profesionales que buscan romper barreras internacionales.
              </p>

              {/* Pricing Card (Mini) */}
              <div className="bg-azul-petroleo rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-azul-celeste/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-azul-celeste/30 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="text-azul-celeste/80 text-sm font-medium mb-2">Inversión Total</div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl sm:text-4xl font-bold">{career.price}</span>
                    <span className="text-white/50 line-through text-sm opacity-70">$599</span>
                  </div>

                  <ul className="space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center gap-3 text-sm text-white/90">
                      <Check className="w-4 h-4 text-azul-celeste" /> Acceso de por vida
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/90">
                      <Check className="w-4 h-4 text-azul-celeste" /> Certificado incluido
                    </li>
                  </ul>

                  <button className="w-full py-3 bg-rojo-brillante text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                    Inscribirme Ahora
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Features Grid */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-6">
              {career.features.slice(0, 4).map((feature, index) => {
                // Define unique icons and descriptions for each feature
                const featureDetails = [
                  {
                    icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-azul-petroleo" />,
                    description: "Vocabulario técnico esencial y comunicación efectiva en contextos profesionales reales."
                  },
                  {
                    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-azul-petroleo" />,
                    description: "Aprende a documentar, presentar y comunicarte con precisión en tu campo especializado."
                  },
                  {
                    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-azul-petroleo" />,
                    description: "Desarrolla confianza para interactuar con equipos internacionales y clientes globales."
                  },
                  {
                    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-azul-petroleo" />,
                    description: "Comprende estándares internacionales y mejores prácticas de tu industria en inglés."
                  }
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative p-6 sm:p-8 bg-gradient-to-br from-white to-azul-celeste/5 rounded-2xl sm:rounded-3xl border border-azul-celeste/20 shadow-sm hover:shadow-2xl hover:border-azul-celeste/40 transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-azul-petroleo/0 to-azul-celeste/0 group-hover:from-azul-petroleo/5 group-hover:to-azul-celeste/10 transition-all duration-300 rounded-2xl sm:rounded-3xl" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-azul-petroleo/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-azul-petroleo/20 transition-all duration-300">
                        {featureDetails[index]?.icon}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 group-hover:text-azul-petroleo transition-colors leading-tight">
                        {feature}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {featureDetails[index]?.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- Curriculum Section --- */}
      <section id="curriculum" className="py-16 sm:py-24 md:py-32 bg-azul-petroleo text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-azul-celeste/10 rounded-full blur-[80px] sm:blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-azul-celeste/10 rounded-full blur-[80px] sm:blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Plan de Estudios</h2>
            <p className="text-azul-celeste/80 text-base sm:text-lg max-w-2xl mx-auto">
              Un recorrido estructurado paso a paso para garantizar tu dominio del idioma técnico.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {displayedCurriculum.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 md:items-center">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/5 font-mono text-lg sm:text-xl md:text-2xl font-bold text-white/30 group-hover:text-white group-hover:bg-azul-celeste transition-all duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-azul-celeste transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2 text-xs sm:text-sm text-azul-celeste/70 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {module.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {career.curriculum.length > 5 && (
            <div className="mt-8 sm:mt-12 text-center">
              <button
                onClick={() => setShowAllCurriculum(!showAllCurriculum)}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-md text-sm sm:text-base"
              >
                {showAllCurriculum ? 'Mostrar menos' : 'Ver currículo completo'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Testimonials --- */}
      <div className="py-12 sm:py-16 md:py-20 bg-gris-suave">
        <TestimonialsSection
          title="Historias de Éxito"
          description="Profesionales reales logrando metas reales."
          testimonials={career.testimonials.map((t, i) => ({
            author: {
              name: t.name,
              handle: t.role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=b6e3f4`
            },
            text: t.content
          }))}
          className="bg-transparent"
        />
      </div>

      {/* --- FAQ Section --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-12 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-3 sm:space-y-4">
            {career.faq.map((faq, index) => (
              <div key={index} className="border-b border-azul-celeste/10 last:border-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 sm:py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-base sm:text-lg font-medium text-slate-900 group-hover:text-azul-petroleo transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-azul-celeste transition-transform duration-300 flex-shrink-0",
                      expandedFaq === index && "rotate-180 text-azul-petroleo"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-azul-petroleo relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-azul-celeste/20 rounded-full blur-[100px] sm:blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
            Tu carrera internacional <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-azul-celeste to-white">comienza hoy.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-azul-celeste/80 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Únete a la comunidad de profesionales que están redefiniendo su futuro con inglés especializado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-rojo-brillante text-white text-base sm:text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(224,49,45,0.5)] hover:shadow-[0_0_60px_-10px_rgba(224,49,45,0.7)] hover:-translate-y-1 transition-all duration-300">
              Inscribirme al Programa
            </button>
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-white/30 text-white text-base sm:text-lg font-medium rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              Agendar Asesoría Gratis
            </button>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 text-azul-celeste/70 text-sm sm:text-base">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Garantía de 30 días
            </div>
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> Acceso Global
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetail;