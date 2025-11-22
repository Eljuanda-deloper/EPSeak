import { AnimatedGroup } from '@/components/ui/animated-group';
import { TextEffect } from '@/components/ui/text-effect';
import { HeroSection } from '@/components/blocks/hero-section-1';
import { AnimationShowcase } from '@/components/blocks/animation-showcase';

export const metadata = {
  title: 'Componentes Animados | EPSeak',
  description: 'Galería interactiva de componentes modernos con animaciones',
};

export default function ComponentsDemoPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section Demo */}
      <section>
        <HeroSection />
      </section>

      {/* AnimatedGroup Presets Demo */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Presets de AnimatedGroup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['fade', 'slide', 'scale', 'blur', 'zoom', 'bounce', 'rotate', 'swing'] as const).map(
            (preset) => (
              <AnimatedGroup
                key={preset}
                preset={preset}
                className="p-6 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-epseak-blue mb-2 capitalize">
                    {preset}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Animación de tipo {preset}
                  </p>
                </div>
              </AnimatedGroup>
            )
          )}
        </div>
      </section>

      {/* TextEffect Presets Demo */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900">
        <h2 className="text-4xl font-bold mb-12">Presets de TextEffect</h2>
        <div className="space-y-12">
          {(['fade', 'blur', 'shake', 'scale', 'slide'] as const).map((preset) => (
            <div key={preset}>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 capitalize">
                Efecto: {preset}
              </h3>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700">
                <TextEffect
                  preset={preset}
                  per="word"
                  className="text-2xl font-semibold text-slate-900 dark:text-white"
                >
                  {`Este es un ejemplo del efecto ${preset} aplicado por palabra en EPSeak`}
                </TextEffect>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TextEffect Modes Demo */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Modos de TextEffect</h2>
        <div className="space-y-12">
          {([
            {
              mode: 'word' as const,
              title: 'Por Palabra',
              text: 'Este texto se anima palabra por palabra de forma fluida y elegante',
            },
            {
              mode: 'char' as const,
              title: 'Por Carácter',
              text: 'Cada carácter se anima individualmente',
            },
            {
              mode: 'line' as const,
              title: 'Por Línea',
              text: 'Primera línea\nSegunda línea\nTercera línea',
            },
          ] as const).map(({ mode, title, text }) => (
            <div key={mode}>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
                {title}
              </h3>
              <div className="bg-gradient-to-r from-epseak-blue/10 to-epseak-purple/10 p-8 rounded-lg border border-slate-200 dark:border-slate-700">
                <TextEffect
                  preset="blur"
                  per={mode}
                  className="text-xl text-slate-900 dark:text-white leading-relaxed"
                >
                  {text}
                </TextEffect>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Componentes Personalizados EPSeak */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900">
        <h2 className="text-4xl font-bold mb-12">Presets Personalizados para EPSeak</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedGroup preset="lesson-enter" className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-epseak-blue mb-2">Lesson Enter</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Animación optimizada para entrada de lecciones con efecto de desenfoque y movimiento suave
              </p>
            </div>
          </AnimatedGroup>

          <AnimatedGroup preset="progressive-load" className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-epseak-purple mb-2">Progressive Load</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Carga progresiva de elementos con efecto de escala y stagger para mejor UX
              </p>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* Instrucciones de Uso */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Cómo Usar los Componentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AnimatedGroup</h3>
            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-x-auto text-sm">
              <code>{`import { AnimatedGroup } from '@/components/ui'

<AnimatedGroup preset="slide">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedGroup>`}</code>
            </pre>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">TextEffect</h3>
            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-x-auto text-sm">
              <code>{`import { TextEffect } from '@/components/ui'

<TextEffect 
  preset="blur" 
  per="word"
>
  Texto animado por palabra
</TextEffect>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Animation Showcase from Custom Hooks */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          Variantes de Animación Personalizadas
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-12">
          Utilizando el hook <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">useHeroAnimations()</code>
        </p>
        <AnimationShowcase />
      </section>
    </main>
  );
}
