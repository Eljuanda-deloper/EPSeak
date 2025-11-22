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
    <header className="fixed top-0 z-[100] w-full">
      <nav className="w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-4 sm:px-6 transition-all duration-300 lg:px-8',
            shouldBeScrolled &&
            'bg-white/98 max-w-5xl rounded-2xl border border-slate-200/60 shadow-lg'
          )}
        >
          <div className="flex items-center justify-between w-full h-16">
            {/* Left Section: Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/logoEspeak.png"
                  alt="Espeak Logo"
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Center Section: Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <ul className="flex gap-6 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-azul-petroleo dark:text-slate-400 dark:hover:text-white font-medium transition-colors duration-150"
                      onClick={() => setMenuState(false)}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Desktop Buttons */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  'text-slate-700 hover:text-azul-petroleo hover:bg-azul-petroleo/5 transition-all duration-300',
                  !shouldBeScrolled && !isCareerPage && 'hidden'
                )}
              >
                <Link href="/auth/login">
                  Iniciar sesión
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className={cn(
                  'text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
                  isCareerPage
                    ? 'bg-rojo-brillante hover:bg-red-600'
                    : 'bg-epseak-blue hover:bg-blue-700'
                )}
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
                    'transition-all duration-200 m-auto size-6 text-slate-700',
                    menuState && 'scale-0 opacity-0'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 text-slate-700 transition-all duration-200',
                    !menuState && 'scale-0 opacity-0'
                  )}
                />
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {menuState && (
              <div className="fixed top-16 left-0 right-0 lg:hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xl shadow-zinc-300/20 dark:shadow-none z-40 mx-4">
                <div className="space-y-6">
                  <ul className="space-y-4 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-slate-600 hover:text-azul-petroleo dark:text-slate-400 dark:hover:text-white block font-medium transition-colors duration-150"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-azul-petroleo/20 text-azul-petroleo hover:bg-azul-petroleo/5"
                    >
                      <Link href="/auth/login" onClick={() => setMenuState(false)}>
                        Iniciar sesión
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        'text-white rounded-full shadow-lg',
                        isCareerPage
                          ? 'bg-rojo-brillante hover:bg-red-600'
                          : 'bg-epseak-blue hover:bg-blue-700'
                      )}
                    >
                      <Link href="/auth/register" onClick={() => setMenuState(false)}>
                        Comenzar
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
