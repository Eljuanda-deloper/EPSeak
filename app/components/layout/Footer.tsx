'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowUp, Heart } from 'lucide-react';
import Button from '../shared/Button';
// Removed Logo import - using string path instead
import { FC, useRef, useEffect, useState } from 'react';
import { useInView } from '@/app/hooks/useInView';
import { FadeIn, ScaleIn, SlideIn } from '../shared/Animations';

interface FooterProps {}

interface CtaHighlight {
  title: string;
  detail: string;
}

interface NavigationItem {
  label: string;
  href: string;
}

interface ContactItem {
  label: string;
  value: string;
  href: string;
}

interface SocialLink {
  icon: IconType;
  label: string;
  href: string;
}

const ctaHighlights: CtaHighlight[] = [
  {
    title: 'Diagnóstico 360°',
    detail: 'Analizamos equipos, objetivos y nivel lingüístico de cada rol.'
  },
  {
    title: 'Mentores por industria',
    detail: 'Asignamos especialistas con experiencia real en tu sector.'
  },
  {
    title: 'Reportes ejecutivos',
    detail: 'KPIs mensuales con progreso, asistencia y proyección de impacto.'
  }
];

const Footer: FC<FooterProps> = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Hide footer in dashboard routes
  const isInDashboard = pathname.startsWith('/dashboard');
  if (isInDashboard) {
    return null;
  }

  // Refs para animaciones
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Scroll effects
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });

  // Estados de animación
  const ctaInView = useInView(ctaRef);
  const brandInView = useInView(brandRef);
  const navigationInView = useInView(navigationRef);
  const contactInView = useInView(contactRef);
  const resourcesInView = useInView(resourcesRef);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigation: NavigationItem[] = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Quiénes somos', href: '#quienes-somos' },
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Razones', href: '#razones' },
    { label: 'Contacto', href: '#contacto' }
  ];

  const contactInfo: ContactItem[] = [
    { label: 'Email', value: 'hola@epseak.com', href: 'mailto:hola@epseak.com' },
    { label: 'WhatsApp', value: '+57 311 367 8555', href: 'https://wa.me/573113678555' },
    { label: 'Dirección', value: 'Bogotá, Colombia · Atención global', href: '#' }
  ];

  const socialLinks: SocialLink[] = [
    { icon: FaFacebookF, label: 'Facebook', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
    { icon: FaTwitter, label: 'Twitter', href: '#' },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
    { icon: FaYoutube, label: 'YouTube', href: '#' }
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: showScrollTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 z-50 p-4 bg-gradient-to-r from-azul-petroleo to-azul-celeste rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </motion.button>

      <motion.footer
        ref={footerRef}
        style={{ y: springY, opacity: springOpacity }}
        className="block relative mt-20 min-h-[500px] w-full bg-gradient-to-b from-azul-petroleo via-[#0a192f] to-[#0a0f1a] text-white overflow-hidden"
      >
        {/* Enhanced background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-azul-celeste/15 blur-[120px]"
          />
          <div
            className="absolute top-1/3 right-[-120px] h-96 w-96 rounded-full bg-azul-celeste/8 blur-[140px]"
          />
          <div
            className="absolute bottom-[-160px] left-1/4 h-96 w-96 rounded-full bg-rojo-brillante/10 blur-[160px]"
          />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${15 + i * 10}%`,
                top: `${20 + i * 8}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 1 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]"
          style={{
            maskImage: 'linear-gradient(180deg, white, rgba(255,255,255,0))'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 backdrop-blur-[2px]">
        {/* Enhanced CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mb-20 overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-white/15 to-white/5 shadow-[0_45px_90px_-30px_rgba(15,23,42,0.55)] backdrop-blur-xl"
        >
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            {/* Animated background elements */}
            <div
              className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-azul-celeste/20 blur-[140px]"
            />
            <div
              className="pointer-events-none absolute right-[-60px] bottom-0 h-72 w-72 rounded-full bg-rojo-brillante/15 blur-[160px]"
            />

            <div
              className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-10"
              style={{
                maskImage: 'linear-gradient(120deg, rgba(255,255,255,0.8), transparent 65%)'
              }}
            />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <div className="max-w-3xl space-y-8 text-white">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-2 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart className="w-4 h-4 text-rojo-brillante" />
                  </motion.div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/90">
                    Partner corporativo
                  </span>
                </motion.div>

                <div className="space-y-6">
                  <motion.h3
                    className="text-3xl font-bold sm:text-4xl leading-tight"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                  >
                    ¿Listo para llevar a tu equipo al siguiente nivel global?
                  </motion.h3>
                  <motion.p
                    className="text-lg text-white/80 leading-relaxed"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.1 }}
                  >
                    Nuestros consultores diseñan un roadmap de inglés aplicado con metas claras, mentores certificados y reportes accionables para talento directivo y operativo.
                  </motion.p>
                </div>

                <motion.ul
                  className="grid gap-4 text-sm sm:grid-cols-3 sm:gap-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {ctaHighlights.map(({ title, detail }, index) => (
                    <motion.li
                      key={title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.15)"
                      }}
                      className="group rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm hover:border-white/30 transition-all duration-300 cursor-pointer"
                    >
                      <motion.p
                        className="text-sm font-semibold text-white mb-2 group-hover:text-azul-celeste transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        {title}
                      </motion.p>
                      <motion.p
                        className="text-xs leading-relaxed text-white/70 group-hover:text-white/90 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        {detail}
                      </motion.p>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                className="flex flex-col gap-4 sm:w-full sm:max-w-sm"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => window.location.href = '#contacto'}
                    className="w-full text-base font-semibold shadow-xl hover:shadow-2xl hover:shadow-rojo-brillante/30"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Agenda un diagnóstico
                    </span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="secondary"
                    onClick={() => window.location.href = '#quienes-somos'}
                    className="w-full border-2 border-white/40 bg-white/10 text-base text-white hover:border-white/60 hover:bg-white/20 backdrop-blur-sm"
                  >
                    Conoce nuestra metodología
                  </Button>
                </motion.div>

                <motion.p
                  className="text-xs text-white/70 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  * Respondemos en <span className="font-bold text-white">menos de 24 horas hábiles</span> con una propuesta personalizada.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <SlideIn ref={brandRef} direction="left" delay={0.2}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-azul-celeste/20 to-rojo-brillante/20 blur"></div>
                  <Image
                    src="/logoESPeak.svg"
                    alt="ESPeak"
                    width={160}
                    height={40}
                    className="relative h-10 w-auto"
                    priority
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-white/70">English for Specific Purpose</p>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-white/80">
                  Formamos profesionales que conquistan oportunidades globales mediante programas especializados en inglés técnico y aplicado.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    ISO 9001:2015
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    +2000 Estudiantes
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    95% Tasa de éxito
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    50+ Empresas
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    Certificación Cambridge
                  </span>
                </div>
              </div>
            </div>
          </SlideIn>

          {/* Navigation */}
          <FadeIn ref={navigationRef} delay={0.4}>
            <h5 className="text-lg font-semibold text-azul-celeste">Explora</h5>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 transition-all duration-200 hover:text-azul-celeste hover:translate-x-1"
                  >
                    <span className="text-xs text-azul-celeste/70 transition-colors duration-200 group-hover:text-azul-celeste">●</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Enhanced Contact */}
          <motion.div
            ref={contactRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.15 }}
          >
            <motion.h5
              className="text-lg font-semibold text-azul-celeste mb-6"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ duration: 0.1 }}
            >
              Contacto
            </motion.h5>
            <ul className="space-y-4 text-sm">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.15 }}
                >
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex flex-col gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.1] p-5 transition-all duration-300 hover:border-azul-celeste/40 hover:from-white/[0.08] hover:to-white/[0.15] hover:shadow-lg hover:shadow-azul-celeste/10"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-azul-celeste/0 via-azul-celeste/0 to-azul-celeste/0 transition-all duration-500 group-hover:from-azul-celeste/10 group-hover:via-azul-celeste/15 group-hover:to-azul-celeste/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.1 }}
                      >
                        {item.label === 'Email' && <Mail className="w-5 h-5 text-azul-celeste/70 group-hover:text-azul-celeste" />}
                        {item.label === 'WhatsApp' && <Phone className="w-5 h-5 text-green-400/70 group-hover:text-green-400" />}
                        {item.label === 'Dirección' && <MapPin className="w-5 h-5 text-rojo-brillante/70 group-hover:text-rojo-brillante" />}
                      </motion.div>

                      <div className="flex-1">
                        <span className="block text-xs font-medium uppercase tracking-wide text-white/60 transition-colors duration-200 group-hover:text-azul-celeste/80">
                          {item.label}
                        </span>
                        <span className="block text-sm font-medium transition-colors duration-200 group-hover:text-white">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <SlideIn ref={resourcesRef} direction="right" delay={0.8}>
            <h5 className="text-lg font-semibold text-azul-celeste">Recursos</h5>
            <p className="mt-5 text-sm leading-relaxed text-white/80">
              Recibe consejos profesionales, materiales exclusivos y tips de certificaciones directamente en tu correo.
            </p>
            <motion.form
              className="mt-6 flex flex-col gap-4 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                if (email && email.includes('@')) {
                  alert('¡Gracias por suscribirte! Pronto recibirás novedades de ESPeak.');
                  form.reset();
                } else {
                  alert('Por favor ingresa un correo electrónico válido.');
                }
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  className="w-full rounded-full border-2 border-white/20 bg-white/10 px-6 py-4 text-sm text-white placeholder-white/50 outline-none transition-all duration-300 focus:border-azul-celeste focus:bg-white/15 focus:ring-2 focus:ring-azul-celeste/20 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 font-semibold shadow-lg hover:shadow-xl hover:shadow-azul-celeste/20"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Suscribirme
                  </span>
                </Button>
              </motion.div>
            </motion.form>
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.15 }}
            >
              {socialLinks.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 1.1 + index * 0.1,
                    duration: 0.15,
                    type: "spring",
                    bounce: 0.4
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    y: -3,
                    boxShadow: "0 10px 25px rgba(33,150,243,0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.15] transition-all duration-300 hover:border-azul-celeste/50 backdrop-blur-sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-azul-celeste/0 via-azul-celeste/0 to-azul-celeste/0 transition-all duration-500 group-hover:from-azul-celeste/20 group-hover:via-azul-celeste/10 group-hover:to-azul-celeste/20 rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />

                  <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.1 }}
                  >
                    <item.icon className="text-xl text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                  </motion.div>

                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/30"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </SlideIn>
        </div>

        {/* Enhanced footer bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.15 }}
          className="mt-16 sm:mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rojo-brillante" />
            <p>
              &copy; {currentYear} ESPeak. Todos los derechos reservados.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            {[
              { href: '#', label: 'Política de Privacidad' },
              { href: '#', label: 'Términos y Condiciones' },
              { href: '#', label: 'Programa de Referidos' }
            ].map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group relative transition-all duration-300 hover:text-azul-celeste"
                >
                  <span className="relative z-10 group-hover:scale-105 inline-block">
                    {link.label}
                  </span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-azul-celeste rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.15 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
    </>
  );
};

export default Footer;