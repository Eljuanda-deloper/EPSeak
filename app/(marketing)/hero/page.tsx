import { HeroSection } from '@/components/blocks/hero-section-1';

export const metadata = {
  title: 'Hero Section | EPSeak',
  description: 'Sección hero moderna con animaciones avanzadas y componentes responsivos',
};

export default function HeroPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <HeroSection />
    </main>
  );
}
