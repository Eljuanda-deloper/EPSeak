'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Inicio', href: '/' },
  { name: 'Quiénes somos', href: '#quienes-somos' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Contacto', href: '#contacto' },
];

export default function HeaderNew() {
  const pathname = usePathname();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Detectar si estamos en una página de carrera
  const isCareerPage = pathname?.startsWith('/careers/');

  // En páginas de carreras, el header siempre está "scrolled" (sólido)
  const shouldBeScrolled = isCareerPage || isScrolled;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-[100] w-full bg-white">
      <nav className="w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            shouldBeScrolled &&
            'bg-white/50 dark:bg-slate-900/50 max-w-4xl rounded-2xl border border-slate-200 backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="flex items-center justify-between w-full h-14">
            {/* Left Section: Logo */}
            <div className="flex items-center flex-1 justify-center">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/logoEspeak.png"
                  alt="Espeak Logo"
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Center Section: Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1">
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
            <div className="hidden lg:flex items-center justify-center gap-3 flex-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(
                  'rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
                  !shouldBeScrolled && 'hidden'
                )}
              >
                <Link href="/auth/login">
                  Iniciar sesión
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-epseak-blue hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                      className="bg-epseak-blue hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
}
