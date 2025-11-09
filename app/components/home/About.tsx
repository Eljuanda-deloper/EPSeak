'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Play, Users, Award, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../shared/Button';
import { FadeIn, ScaleIn } from '../shared/Animations';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

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
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      value: '94%',
      label: 'Ascensos',
      detail: 'de participantes en menos de 9 meses',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      value: '+45%',
      label: 'Incremento salarial',
      detail: 'promedio después del programa',
      icon: TrendingUp,
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
      className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-azul-celeste/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-rojo-brillante/6 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-azul-petroleo/5 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
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
            <h2 className="text-5xl md:text-6xl font-bold text-azul-petroleo mb-6">
              Quiénes somos
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-azul-celeste to-rojo-brillante mx-auto rounded-full mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            />
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-center">
          {/* Video Container */}
          <motion.div
            ref={videoRef}
            style={{ y: videoY }}
            className="relative order-2 lg:order-1"
            onHoverStart={() => setIsVideoHovered(true)}
            onHoverEnd={() => setIsVideoHovered(false)}
          >
            <motion.div
              className="relative aspect-video bg-gradient-to-br from-azul-celeste via-azul-petroleo to-rojo-brillante rounded-3xl overflow-hidden shadow-2xl group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-azul-celeste/20 via-transparent to-rojo-brillante/20"
                animate={isVideoHovered ? {
                  background: [
                    "linear-gradient(45deg, rgba(124,196,224,0.2), transparent, rgba(224,49,45,0.2))",
                    "linear-gradient(225deg, rgba(124,196,224,0.2), transparent, rgba(224,49,45,0.2))",
                    "linear-gradient(45deg, rgba(124,196,224,0.2), transparent, rgba(224,49,45,0.2))"
                  ]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}

              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-all duration-500 group-hover:backdrop-blur-none group-hover:bg-black/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <ScaleIn delay={0.5}>
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-24 h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-xl group/play"
                  >
                    <motion.div
                      animate={isVideoHovered ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.6, repeat: isVideoHovered ? Infinity : 0 }}
                    >
                      <Play className="w-12 h-12 text-azul-petroleo ml-1 group-hover/play:text-rojo-brillante transition-colors duration-300" />
                    </motion.div>

                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={isVideoHovered ? { scale: 1.5, opacity: 0 } : {}}
                      transition={{ duration: 0.6, repeat: isVideoHovered ? Infinity : 0 }}
                    />
                  </motion.div>
                </ScaleIn>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <FadeIn delay={0.4}>
              <motion.h3
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-azul-petroleo via-azul-celeste to-rojo-brillante bg-clip-text text-transparent leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Tu puente hacia oportunidades globales
              </motion.h3>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="space-y-6 text-gray-700">
                <motion.p
                  className="text-lg leading-relaxed"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  En <strong className="text-azul-petroleo font-semibold">EPSeak</strong> no solo enseñamos inglés, formamos
                  profesionales preparados para competir en el mercado internacional con confianza y excelencia.
                </motion.p>

                <motion.p
                  className="text-lg leading-relaxed"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Nuestra metodología se enfoca en el <strong className="text-azul-petroleo font-semibold">inglés específico
                  para tu área profesional</strong>, combinando vocabulario técnico,
                  casos reales y situaciones laborales del día a día.
                </motion.p>

                <motion.p
                  className="text-lg leading-relaxed"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Contamos con instructores certificados y especializados en
                  diferentes campos profesionales: salud, ingeniería, negocios,
                  tecnología y más.
                </motion.p>
              </div>
            </FadeIn>

            {/* Features Grid */}
            <FadeIn delay={0.6}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <feature.icon className="w-8 h-8 text-azul-petroleo mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Stats Grid */}
            <FadeIn delay={0.8}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -8,
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                    }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <motion.div
                      className="flex items-center gap-3 mb-3"
                      whileHover={{ x: 5 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      <div className="text-3xl font-bold text-azul-petroleo group-hover:text-rojo-brillante transition-colors">
                        {stat.value}
                      </div>
                    </motion.div>
                    <div className="font-semibold text-gray-800 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.detail}
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={1.0}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => window.location.href = '#contacto'}
                  className="mt-8 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-rojo-brillante/20 transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    Empieza hoy
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;