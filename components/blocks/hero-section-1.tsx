'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';
import { Variants } from 'framer-motion';

const transitionVariants: { item?: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    } as any,
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    } as any,
  },
};

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,102,204,0.08)_0,hsla(0,102,204,0.02)_50%,hsla(0,102,204,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(111,66,193,0.06)_0,hsla(111,66,193,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(111,66,193,0.04)_0,hsla(111,66,193,0.02)_80%,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--azul-petroleo)] via-[var(--azul-celeste)] via-30% to-[var(--rojo-brillante)] to-70% opacity-10 animate-gradient-shift"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(124,196,224,0.08),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(224,49,45,0.04),transparent_60%)]"></div>
            </AnimatedGroup>

            <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup preset="blur">
                  <Link
                    href="#carreras"
                    className="hover:bg-gradient-to-r hover:from-[var(--azul-celeste)] hover:to-[var(--azul-petroleo)] dark:hover:border-t-border bg-gradient-to-r from-[var(--gris-suave)] to-white group mx-auto flex w-fit items-center gap-4 rounded-full border border-[var(--azul-celeste)] p-1 pl-4 shadow-lg shadow-[var(--azul-petroleo)]/20 transition-all duration-500 dark:border-t-white/5 dark:shadow-zinc-950 hover:shadow-xl hover:shadow-[var(--azul-celeste)]/30 animate-fade-in"
                  >
                    <span className="text-[var(--azul-petroleo)] text-sm font-semibold">🚀 Carreras profesionales en inglés</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l border-[var(--azul-celeste)] bg-white dark:bg-zinc-700"></span>

                    <div className="bg-[var(--azul-celeste)] group-hover:bg-[var(--rojo-brillante)] size-6 overflow-hidden rounded-full duration-500 transition-colors">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-white" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-white" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[var(--azul-petroleo)] via-[var(--azul-celeste)] to-[var(--rojo-brillante)] bg-clip-text text-transparent">
                    ¡Transforma tu carrera con inglés profesional!
                  </h1>

                  <p className="mx-auto mt-8 max-w-2xl text-balance text-xl text-[var(--azul-petroleo)]/90 font-medium">
                    Domina el inglés que necesitas para trabajar en multinacionales. Más de 2000 profesionales ya trabajan en sus sueños gracias a ESPeak. ¡Tu oportunidad global te espera!
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  preset="slide"
                  className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row"
                >
                  <div className="bg-gradient-to-r from-[var(--azul-petroleo)] to-[var(--azul-celeste)] rounded-xl border border-[var(--azul-celeste)] p-1 shadow-2xl shadow-[var(--azul-petroleo)]/30">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-10 py-4 text-lg font-bold bg-[var(--rojo-brillante)] hover:bg-[var(--rojo-brillante)]/90 active:bg-[var(--rojo-brillante)]/80 text-white shadow-lg hover:shadow-xl hover:shadow-[var(--rojo-brillante)]/50 transition-all duration-300 hover:scale-105 animate-bounce-in"
                    >
                      <Link href="#carreras">
                        <span className="text-nowrap flex items-center gap-2">
                          🚀 Comienza tu viaje hoy
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl px-10 py-4 text-lg font-semibold border-2 border-[var(--azul-celeste)] text-[var(--azul-petroleo)] hover:bg-[var(--azul-celeste)] hover:text-white active:bg-[var(--azul-celeste)] active:text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Link href="#quienes-somos">
                      <span className="text-nowrap">Conoce nuestro método</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}

const menuItems = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Quiénes somos', href: '#quienes-somos' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Contacto', href: '#contacto' },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-[100] w-full">
      <nav className="w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
            'bg-white/50 dark:bg-slate-900/50 max-w-4xl rounded-2xl border border-slate-200 backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="flex items-center justify-between w-full h-14">
            {/* Left Section: Logo */}
            <div className="flex items-center flex-1 justify-start">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/logoEspeak.png"
                  alt="Espeak Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Center Section: Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white block duration-150"
                      onClick={() => setMenuState(false)}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Desktop Buttons */}
            <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(
                  'rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
                  !isScrolled && 'hidden'
                )}
              >
                <Link href="/auth/login">
                  Iniciar sesión
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-[var(--rojo-brillante)] hover:bg-[var(--rojo-brillante)]/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link href="/auth/register">
                  Comenzar
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Cerrar menú' : 'Abrir menú'}
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5"
              >
                <Menu
                  className={cn(
                    'transition-all duration-200 m-auto size-6',
                    menuState && 'scale-0 opacity-0'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 transition-all duration-200',
                    !menuState && 'scale-0 opacity-0'
                  )}
                />
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {menuState && (
              <div className="fixed top-16 left-0 right-0 lg:hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xl shadow-zinc-300/20 dark:shadow-none z-40 mx-4">
                <div className="space-y-6">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white block duration-150"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col space-y-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/auth/login" onClick={() => setMenuState(false)}>
                        Iniciar sesión
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-[var(--rojo-brillante)] hover:bg-[var(--rojo-brillante)]/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/auth/register" onClick={() => setMenuState(false)}>
                        Registrarse
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
};
