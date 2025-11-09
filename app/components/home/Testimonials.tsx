'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Star, Users, Award, Quote, ArrowUpRight } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  result: string;
  emoji: string;
  gradient: string;
  delay: number;
  gender: 'male' | 'female';
}

const testimonials: Testimonial[] = [
  {
    name: 'Dr. Alejandro Rivera',
    role: 'Cirujano cardiovascular · Canadá',
    quote:
      '"EPSeak me ayudó a pasar de B2 a C1 en inglés médico. Los asistentes IA corrigieron mi pronunciación en tiempo real durante simulaciones quirúrgicas."',
    result: 'Aprobó MCCQE en 4 meses. +25% aumento salarial.',
    emoji: '👨‍⚕️',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.1,
    gender: 'male'
  },
  {
    name: 'Sofia Martínez',
    role: 'Controller financiera · Estados Unidos',
    quote:
      '"Empecé con nivel básico. Las simulaciones de board meetings con IA me dieron confianza. Ahora lidero reportes globales en inglés."',
    result: 'Ascenso a directora regional. TOEIC: 850 → 950.',
    emoji: '📊',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.2,
    gender: 'female'
  },
  {
    name: 'Miguel Torres',
    role: 'Engineering Manager · Alemania',
    quote:
      '"El vocabulario técnico en DevOps mejoró un 40%. Las prácticas con IA hicieron que las auditorías fueran naturales."',
    result: 'Promoción internacional. +30% en entregas cross-team.',
    emoji: '🧑‍💻',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.3,
    gender: 'male'
  }
];

const stats = [
  {
    value: '4.9/5',
    label: 'Índice de satisfacción',
    descriptor: 'Promedio en cohorts 2024-2025.',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    value: '93%',
    label: 'Renuevan programas',
    descriptor: 'Comités de talento amplían licencias EPSeak.',
    icon: Award,
    color: 'text-blue-500'
  },
  {
    value: '28',
    label: 'Sectores representados',
    descriptor: 'Desde salud y energía hasta fintech y edtech.',
    icon: Users,
    color: 'text-green-500'
  }
];

const TestimonialCard = ({ name, role, quote, result, emoji, gradient, delay, gender }: Testimonial) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{
        translateY: -12,
        scale: 1.02,
        transition: { duration: 0.15 }
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl hover:shadow-[0_35px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-500"
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.15 }}
      />

      {/* Floating orbs */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-azul-celeste/20 to-transparent blur-xl"
      />

      <div
        className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-tr from-rojo-brillante/15 to-transparent blur-lg"
      />

      <div className="relative space-y-6">
        {/* Header with avatar and info */}
        <motion.div
          className="flex items-center gap-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.15 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
            <div className="relative">
              <img
                src={
                  name === 'Dr. Alejandro Rivera'
                    ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
                    : name === 'Sofia Martínez'
                    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                }
                alt={`${name} avatar`}
                className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-white/50 object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b6e3f4`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-azul-celeste rounded-full p-1">
                <div className="text-white text-xs">{emoji}</div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <motion.p
              className="text-lg font-bold text-azul-petroleo group-hover:text-azul-celeste transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              {name}
            </motion.p>
            <motion.p
              className="text-sm uppercase tracking-wide text-azul-petroleo/60 font-medium"
              whileHover={{ x: 2 }}
            >
              {role}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <Quote className="w-6 h-6 text-azul-celeste/40 group-hover:text-azul-celeste/60 transition-colors duration-300" />
          </motion.div>
        </motion.div>

        {/* Quote */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          className="relative"
        >
          <div className="absolute -top-2 -left-2 text-azul-celeste/30 text-4xl font-serif">"</div>
          <p className="text-base leading-relaxed text-azul-petroleo/80 font-medium italic pl-4">
            {quote}
          </p>
          <div className="absolute -bottom-2 -right-2 text-azul-celeste/30 text-4xl font-serif">"</div>
        </motion.div>

        {/* Result badge */}
        <motion.div
          className="flex items-start gap-3"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.1 }}
          >
            <ArrowUpRight className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          </motion.div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            <span className="font-bold">Resultado:</span> {result}
          </div>
        </motion.div>
      </div>

      {/* Hover effect border */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
        style={{
          padding: '1px',
          backgroundClip: 'padding-box'
        }}
      >
        <div className="h-full w-full rounded-3xl bg-white/90" />
      </motion.div>
    </motion.article>
  );
};

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  return (
    <motion.section
      ref={sectionRef}
      id="testimonios"
      style={{ y: springY, opacity: springOpacity, scale: springScale }}
      className="relative overflow-hidden bg-gradient-to-b from-gray-50/80 via-white to-gray-50/40 py-16"
    >
      {/* Enhanced background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-azul-celeste/10 via-transparent to-rojo-brillante/10 blur-[180px]"
        />
        <div
          className="absolute -bottom-36 right-12 h-80 w-80 rounded-full bg-gradient-to-l from-rojo-brillante/8 to-azul-petroleo/8 blur-[160px]"
        />
        <div
          className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-azul-petroleo/5 to-azul-celeste/5 blur-[140px]"
        />

        {/* Animated grid */}
        <div
          className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"
        />

        {/* Subtle wave pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-4xl text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-azul-celeste/15 to-rojo-brillante/15 px-6 py-2 mb-8 border border-white/20 backdrop-blur-sm"
          >
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-azul-petroleo">
              Historias reales de transformación
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-azul-petroleo via-azul-celeste to-rojo-brillante bg-clip-text text-transparent leading-tight"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
          >
            Talento global que escala con EPSeak
          </motion.h2>

          <motion.p
            className="text-xl text-azul-petroleo/80 leading-relaxed max-w-3xl mx-auto"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.1 }}
          >
            Nuestro acompañamiento combina feedback técnico y coaching intercultural. Así, equipos y líderes llevan su comunicación profesional al nivel que exigen proyectos internacionales.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-3 mb-20"
        >
          {stats.map(({ value, label, descriptor, icon: Icon, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, delay: 0.3 + index * 0.1 }}
              whileHover={{
                y: -8,
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/90 px-8 py-10 text-center shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.15 }}
              />

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.15 }}
                  className="flex justify-center mb-4"
                >
                  <Icon className={`w-12 h-12 ${color}`} />
                </motion.div>

                <motion.p
                  className="text-4xl md:text-5xl font-bold text-azul-petroleo mb-3 group-hover:text-azul-celeste transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {value}
                </motion.p>

                <motion.p
                  className="text-sm uppercase tracking-wider text-azul-celeste font-semibold mb-2"
                  whileHover={{ x: 2 }}
                >
                  {label}
                </motion.p>

                <motion.p
                  className="text-sm text-azul-petroleo/70 leading-relaxed"
                  whileHover={{ y: -1 }}
                >
                  {descriptor}
                </motion.p>
              </div>

              {/* Hover effect border */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-azul-celeste/20 to-rojo-brillante/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  padding: '2px',
                  backgroundClip: 'padding-box'
                }}
              >
                <div className="h-full w-full rounded-3xl bg-white/95" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15, delay: 0.4 }}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/95 to-white/80 px-8 py-12 text-center shadow-2xl backdrop-blur-xl"
        >
          {/* Animated background */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-azul-celeste/5 via-transparent to-rojo-brillante/5"
          />

          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-azul-petroleo/10 px-4 py-2 mb-6"
            >
              <Award className="w-4 h-4 text-azul-petroleo" />
              <span className="text-sm font-medium text-azul-petroleo uppercase tracking-wide">
                Evidencia de impacto
              </span>
            </motion.div>

            <motion.p
              className="max-w-3xl text-xl text-azul-petroleo/80 leading-relaxed mx-auto mb-8"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.1 }}
            >
              8 de cada 10 compañías reportan mejoras medibles en cierres comerciales, auditorías y satisfacción de clientes globales tras 90 días de programa.
            </motion.p>

            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rojo-brillante to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-rojo-brillante/30 transition-all duration-300 group"
            >
              <span>Solicitar caso de éxito detallado</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-azul-celeste/10 blur-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-rojo-brillante/10 blur-lg" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;