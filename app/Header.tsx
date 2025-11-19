"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '@/app/components/shared/Button';
import Logo from '@/app/imagenes/logoEspeak.png';
import { useAuth } from '@/app/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mounted, setMounted] = useState(false);

  // ✅ Todos los hooks deben estar aquí, ANTES de cualquier retorno condicional
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ['inicio', 'quienes-somos', 'testimonios', 'contacto'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Quiénes somos', href: '#quienes-somos' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 w-full z-50 bg-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <motion.header
      style={{
        backdropFilter: `blur(${headerBlur}px)`,
        position: 'fixed'
      }}
      className={`
        top-0 w-full z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-gray-100/50'
          : 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
        }
      `}
    >
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-azul-petroleo group">
              <Image
                src={Logo}
                alt="ESPeak logo"
                width={160}
                height={40}
                className="h-8 w-auto md:h-10"
                priority
                suppressHydrationWarning={true}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-azul-petroleo
                  ${activeSection === link.href.slice(1) ? 'text-azul-petroleo' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-azul-petroleo" />
              ) : user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="secondary">Dashboard</Button>
                  </Link>
                  <Button onClick={() => signOut()}>Cerrar Sesión</Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="secondary">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-azul-petroleo"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-2 text-azul-petroleo group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.25 }}
              >
                <Image
                  src={Logo}
                  alt="ESPeak logo"
                  className="h-8 w-auto md:h-10 transition-all duration-300 group-hover:brightness-110"
                  priority
                  suppressHydrationWarning={true}
                />
              </motion.div>
              <span className="text-xl font-bold md:text-2xl tracking-tight">
                EP<span className="text-rojo-brillante group-hover:text-red-600 transition-colors duration-300">Seak</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.25 }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(link.href.slice(1));
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    hover:bg-azul-petroleo/5 hover:text-azul-petroleo hover:scale-105
                    ${activeSection === link.href.slice(1)
                      ? 'text-azul-petroleo bg-azul-petroleo/10'
                      : 'text-gray-700'
                    }
                  `}
                >
                  {link.name}
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-azul-petroleo/10 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.25 }}
              className="ml-4 flex items-center gap-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-azul-petroleo"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button
                      variant="secondary"
                      className="shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5 hover:text-azul-petroleo"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="secondary"
                      className="shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5 hover:text-azul-petroleo"
                    >
                      Perfil
                    </Button>
                  </Link>
                  <Button
                    onClick={() => signOut()}
                    className="shadow-lg hover:shadow-xl hover:shadow-gray-400/20 bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="secondary"
                      className="shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5 hover:text-azul-petroleo"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      className="shadow-lg hover:shadow-xl hover:shadow-rojo-brillante/20"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-azul-petroleo" />
              ) : (
                <Menu className="w-6 h-6 text-azul-petroleo" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
            >
              <div className="px-6 py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(link.href.slice(1));
                        if (element) {
                          const headerOffset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                        setIsMenuOpen(false);
                      }}
                      className={`
                        block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
                        hover:bg-azul-petroleo/5 hover:text-azul-petroleo hover:translate-x-2
                        ${activeSection === link.href.slice(1)
                          ? 'text-azul-petroleo bg-azul-petroleo/10'
                          : 'text-gray-700'
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-gray-100 space-y-3"
                >
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-azul-petroleo"></div>
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="secondary"
                          className="w-full shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="secondary"
                          className="w-full shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5"
                        >
                          Perfil
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full shadow-lg hover:shadow-xl hover:shadow-gray-400/20 bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="secondary"
                          className="w-full shadow-lg hover:shadow-xl hover:shadow-azul-petroleo/20 bg-white text-azul-petroleo border border-azul-petroleo/20 hover:bg-azul-petroleo/5"
                        >
                          Iniciar Sesión
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          className="w-full shadow-lg hover:shadow-xl hover:shadow-rojo-brillante/20"
                        >
                          Registrarse
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;