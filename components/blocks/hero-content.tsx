'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
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

export function HeroContent() {
  return (
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
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
              alt="background"
              className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block w-full h-full object-cover opacity-20"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>

          <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

          <div className="mx-auto max-w-7xl px-6">
            <div aria-hidden className="text-center sm:mx-auto lg:mr-auto lg:mt-0 pointer-events-none">
              <AnimatedGroup preset="blur">
                <Link
                  href="#features"
                  className="pointer-events-none hover:bg-background dark:hover:border-t-border bg-slate-100 group mx-auto flex w-fit items-center gap-4 rounded-full border border-slate-200 p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                >
                  <span className="text-slate-700 text-sm font-medium">Nuevas características de IA</span>
                  <span className="dark:border-background block h-4 w-0.5 border-l border-slate-300 bg-white dark:bg-zinc-700"></span>

                  <div className="bg-slate-200 group-hover:bg-slate-100 size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3 text-slate-700" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3 text-slate-700" />
                      </span>
                    </div>
                  </div>
                </Link>

                <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900">
                  Aprende inglés con tecnología moderna
                </h1>

                <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-slate-600">
                  Componentes altamente personalizables para construir tu aprendizaje de inglés de forma moderna e interactiva.
                </p>
              </AnimatedGroup>

              <AnimatedGroup
                preset="slide"
                className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row"
              >
                <div className="bg-slate-900 rounded-[14px] border border-slate-800 p-0.5">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-8 text-base bg-epseak-blue hover:bg-blue-700 text-white"
                  >
                    <Link href="/auth/register">
                      <span className="text-nowrap">Comenzar ahora</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-11 rounded-xl px-8"
                >
                  <Link href="/contact">
                    <span className="text-nowrap">Solicitar demo</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          <AnimatedGroup
            preset="fade"
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-slate-200">
                <img
                  className="bg-background aspect-video relative hidden rounded-2xl dark:block w-full"
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
                <img
                  className="z-2 border-slate-200 aspect-video relative rounded-2xl border dark:hidden w-full"
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      <section className="bg-background pb-16 pt-16 md:pb-32">
        <div className="group relative m-auto max-w-5xl px-6">
          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Link
              href="/about"
              className="block text-sm duration-150 hover:opacity-75 text-slate-700"
            >
              <span> Conoce a nuestros clientes</span>

              <ChevronRight className="ml-1 inline-block size-3" />
            </Link>
          </div>

          <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
            <div className="flex">
              <img
                className="mx-auto h-5 w-fit dark:invert"
                src="https://www.google.com/favicon.ico"
                alt="Google"
                height="20"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-4 w-fit dark:invert"
                src="https://www.udemy.com/favicon.ico"
                alt="Udemy"
                height="16"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-4 w-fit dark:invert"
                src="https://www.duolingo.com/favicon.ico"
                alt="Duolingo"
                height="16"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-5 w-fit dark:invert"
                src="https://www.coursera.org/favicon.ico"
                alt="Coursera"
                height="20"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-5 w-fit dark:invert"
                src="https://www.bbc.com/favicon.ico"
                alt="BBC Learning"
                height="20"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-4 w-fit dark:invert"
                src="https://www.cambridge.org/favicon.ico"
                alt="Cambridge"
                height="16"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-5 w-fit dark:invert"
                src="https://www.oxford.com/favicon.ico"
                alt="Oxford"
                height="20"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                className="mx-auto h-5 w-fit dark:invert"
                src="https://www.ets.org/favicon.ico"
                alt="ETS"
                height="20"
                width="auto"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}