'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { Users, Award, TrendingUp, ArrowRight, CheckCircle, MessageCircle, Rocket, Trophy, BarChart3 } from 'lucide-react';
import ReactPlayer from 'react-player';
import Button from '../shared/Button';
import { FadeIn, ScaleIn } from '../shared/Animations';
import { useInView } from '../../hooks/useInView';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { isInView: isStatsInView } = useInView(statsRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: videoScrollProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const videoY = useTransform(videoScrollProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  const springY = useSpring(y, { stiffness: 400, damping: 40 });
  const springOpacity = useSpring(opacity, { stiffness: 400, damping: 40 });
  const springScale = useSpring(scale, { stiffness: 400, damping: 40 });

  const stats = [
    {
      value: '2.3x',
      label: 'Mayor velocidad',
      detail: 'para lograr certificaciones',
      icon: Rocket,
      color: 'text-green-600'
    },
    {
      value: '94%',
      label: 'Ascensos',
      detail: 'de participantes en menos de 9 meses',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      value: '+45%',
      label: 'Incremento salarial',
      detail: 'promedio después del programa',
      icon: BarChart3,
      color: 'text-blue-600'
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Instructores especializados",
      description: "Profesionales certificados en tu campo específico"
    },
    {
      icon: CheckCircle,
      title: "Metodología probada",
      description: "Casos reales y situaciones laborales del día a día"
    },
    {
      icon: Award,
      title: "Certificaciones reconocidas",
      description: "Validadas internacionalmente por empresas líderes"
    }
  ];

  return (
    <motion.section
      ref={sectionRef}
      id="quienes-somos"
      style={{ y: springY, opacity: springOpacity, scale: springScale }}
      className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-azul-celeste/8 rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-rojo-brillante/6 rounded-full blur-2xl"
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-azul-petroleo/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-azul-petroleo/10 px-6 py-3 mb-6"
            >
              <Users className="w-5 h-5 text-azul-petroleo" />
              <span className="text-sm font-medium text-azul-petroleo">Conoce nuestra historia</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul-petroleo mb-6">
              Quiénes somos
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-azul-celeste to-rojo-brillante mx-auto rounded-full mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            />
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Video Container - 2 columns on desktop */}
          <motion.div
            ref={videoRef}
            style={{ y: videoY }}
            className="relative order-2 lg:order-1 lg:col-span-2"
          >
            <motion.div
              className="relative aspect-video bg-gradient-to-br from-azul-celeste via-azul-petroleo to-rojo-brillante rounded-2xl overflow-hidden shadow-2xl group lg:sticky lg:top-24"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
              role="region"
              aria-label="Video explicativo de ESPeak"
            >
              {/* Video player with ReactPlayer - responsive and optimized */}
              <ReactPlayer
                src="https://www.youtube.com/watch?v=JGwWNGJdvx8" // Shape of You - Ed Sheeran (test video)
                controls={true}
                width="100%"
                height="100%"
                style={{ borderRadius: '1rem', overflow: 'hidden' }}
                config={{
                  youtube: {
                    color: 'white'
                  }
                }}
                onReady={() => console.log('Video ready')}
                onError={(error) => console.error('Video error:', error)}
                playing={false}
                light={false}
              />
            </motion.div>
          </motion.div>

          {/* Content - 3 columns on desktop */}
          <div className="space-y-8 order-1 lg:order-2 lg:col-span-3">
            <FadeIn delay={0.4}>
              <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-azul-petroleo via-azul-celeste to-rojo-brillante bg-clip-text text-transparent leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                Tu puente hacia oportunidades globales
              </motion.h3>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="space-y-6 text-gray-700">
                <p className="text-base md:text-lg leading-relaxed">
                  En esta sección, se explica a través de un corto video el valor agregado que ofrece <strong className="text-azul-petroleo font-semibold">ESPeak</strong> en comparación con otros institutos que ofrecen solamente el aprendizaje del idioma inglés. Se explica muy bien la articulación del inglés general junto con el inglés específico o con énfasis en distintos perfiles profesionales.
                </p>

                <div className="bg-azul-petroleo/5 p-5 md:p-6 rounded-2xl border-l-4 border-azul-petroleo">
                  <h4 className="text-lg md:text-xl font-bold text-azul-petroleo mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                    ¿Preguntas? ¿Inquietudes?
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed mb-4">
                    Contactate con nosotros y agenda tu cita para poder aclarar todo lo relacionado con nuestra metodología.
                  </p>
                  <motion.a
                    href="https://wa.me/573001234567?text=Hola,%20tengo%20preguntas%20sobre%20la%20metodología%20de%20ESPeak"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                    aria-label="Contactar por WhatsApp para consultas sobre metodología ESPeak"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Contactar por WhatsApp
                  </motion.a>
                </div>
              </div>
            </FadeIn>


            {/* Stats Grid */}
            <FadeIn delay={0.6}>
              <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.25 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -8,
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                    }}
                    className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <motion.div
                      className="flex items-center gap-2 mb-2"
                      whileHover={{ x: 5 }}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <motion.div
                        className="text-2xl md:text-3xl font-bold text-azul-petroleo group-hover:text-rojo-brillante transition-colors"
                        initial={{ scale: 0 }}
                        animate={isStatsInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.5, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                    </motion.div>
                    <div className="font-semibold text-gray-800 mb-1 text-sm">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stat.detail}
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={1.0}>
              <div className="flex justify-center lg:justify-start mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => window.location.href = '#contacto'}
                    className="px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold shadow-2xl hover:shadow-3xl hover:shadow-rojo-brillante/30 transition-all duration-300 group bg-gradient-to-r from-azul-petroleo to-azul-celeste hover:from-azul-celeste hover:to-rojo-brillante"
                  >
                    <span className="flex items-center gap-3">
                      Empieza hoy
                      <motion.div
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;