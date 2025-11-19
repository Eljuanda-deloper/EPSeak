'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Globe, Target } from 'lucide-react';
import Button from '../shared/Button';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    })
  };

  return (
    <motion.section
      ref={sectionRef}
      id="inicio"
      style={{ y: springY, opacity: springOpacity, scale }}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden text-white"
    >
      {/* Background Layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary gradient */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,196,224,0.4),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(124,196,224,0.25),transparent_60%),linear-gradient(135deg,rgba(10,78,90,0.92),rgba(124,196,224,0.8))]"
          style={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />

        {/* Animated grid */}
        <motion.div
          className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]"
          animate={{
            backgroundPosition: ["0px 0px", "20px 20px"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-azul-celeste/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1]
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-24 h-24 bg-rojo-brillante/15 rounded-full blur-lg"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 4
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}

        {/* Main heading */}
        <motion.h1
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          <span className="block">Aprende inglés</span>
          <span className="block bg-gradient-to-r from-white via-azul-celeste to-white bg-clip-text text-transparent">
            para tu profesión
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Domina el idioma y trabaja en lo que amas, en cualquier parte del mundo
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => (window.location.href = '#quienes-somos')}
              className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl group"
            >
              <span className="flex items-center gap-2">
                Conoce nuestra metodología
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              onClick={() => (window.location.href = '#experiencia')}
              className="px-8 py-4 text-lg font-semibold border-white/30 hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ver resultados
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { icon: Globe, value: "28+", label: "Sectores profesionales" },
            { icon: Target, value: "94%", label: "Tasa de éxito" },
            { icon: Sparkles, value: "2000+", label: "Estudiantes formados" }
          ].map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <Icon className="w-8 h-8 text-azul-celeste" />
              <div className="text-center">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm opacity-80">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
