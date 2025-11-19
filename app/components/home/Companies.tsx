"use client";
import { motion } from 'framer-motion';

const partnerLogos = [
  { name: 'MedGlobal', descriptor: 'Salud internacional' },
  { name: 'AeroTech Labs', descriptor: 'Aeronáutica' },
  { name: 'Quantum Finance', descriptor: 'Servicios financieros' },
  { name: 'Nova Engineers', descriptor: 'Ingeniería civil' },
  { name: 'EduWorld Group', descriptor: 'Educación superior' },
  { name: 'BioSolutions', descriptor: 'Biotecnología' },
  { name: 'LegalBridge', descriptor: 'Legal & compliance' },
  { name: 'Softwave', descriptor: 'Tecnología' }
];

const partnershipStats = [
  {
    value: '120+',
    label: 'Empresas integradas',
    description: 'Programas corporativos en 8 industrias reguladas.'
  },
  {
    value: '4.9/5',
    label: 'Índice de satisfacción',
    description: 'Evaluación promedio de equipos líderes y talento senior.'
  },
  {
    value: '18 países',
    label: 'Alcance global',
    description: 'Operamos en zonas horarias de América y Europa.'
  }
];

const solutionHighlights = [
  'Diseño de academias internas enfocadas en certificaciones internacionales.',
  'Plan de reporting mensual con KPIs de progreso y retención.',
  'Facilitadores bilingües con experiencia en industrias especializadas.',
  'Implementación híbrida: workshops live + plataforma asincrónica.'
];

const industriesServed = [
  {
    title: 'Salud y ciencias de la vida',
    summary: 'Equipos clínicos, regulatorios y de investigación preparados para auditorías FDA y EMA.'
  },
  {
    title: 'Ingeniería y energía',
    summary: 'Cuadros técnicos con dominio del inglés para licitaciones internacionales y HSE.'
  },
  {
    title: 'Tecnología y finanzas',
    summary: 'Squads ágiles y áreas de gestión con comunicación efectiva en entornos remotos.'
  }
];

const Companies = () => {
  return (
    <section
      id="empresas"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--gris-suave)]/60 via-white to-white py-24"
    >
      <div className="pointer-events-none absolute -top-40 -left-28 h-80 w-80 rounded-full bg-[var(--azul-celeste)]/20 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-52 right-[-120px] h-96 w-96 rounded-full bg-[var(--rojo-brillante)]/15 blur-[160px]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.08] [mask-image:radial-gradient(circle_at_top,rgba(0,0,0,0.35),transparent_70%)]" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full bg-[var(--azul-celeste)]/15 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--azul-celeste)]">
            Programas corporativos
          </span>
          <h2 className="section-title !mb-5 text-4xl sm:text-5xl">
            Empresas líderes confían su talento a ESPeak
          </h2>
          <p className="text-lg text-[var(--azul-petroleo)]/75">
            Acompañamos a organizaciones globales con soluciones de inglés para propósitos específicos que aceleran la expansión internacional, la certificación técnica y la comunicación de alto impacto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-3"
        >
          {partnershipStats.map(({ value, label, description }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 px-6 py-8 text-left shadow-xl backdrop-blur"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--azul-celeste)]/0 via-[var(--azul-celeste)]/10 to-[var(--azul-celeste)]/5 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              <div className="relative space-y-3">
                <p className="text-4xl font-bold text-[var(--azul-petroleo)]">{value}</p>
                <p className="text-sm font-semibold uppercase tracking-wide text-[var(--azul-celeste)]/90">{label}</p>
                <p className="text-sm text-[var(--azul-petroleo)]/60">{description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {partnerLogos.map(({ name, descriptor }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--azul-celeste)]/15 bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-300"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--azul-celeste)]/0 via-[var(--azul-celeste)]/15 to-[var(--azul-celeste)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="text-2xl font-semibold tracking-tight text-[var(--azul-petroleo)] group-hover:text-[var(--azul-celeste)]">{name}</div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--azul-petroleo)]/40">{descriptor}</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--azul-petroleo)]/10 to-transparent" />
                <p className="text-sm text-[var(--azul-petroleo)]/60">
                  Programas de inglés aplicado para equipos multidisciplinarios y managers globales.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-[32px] border border-[var(--azul-celeste)]/25 bg-white/85 p-10 shadow-2xl backdrop-blur-lg"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-[var(--azul-petroleo)]">
                Soluciones medibles para equipos corporativos
              </h3>
              <p className="text-[var(--azul-petroleo)]/70">
                Diseñamos hojas de ruta por niveles y roles, conectando objetivos de negocio con indicadores tangibles: certificaciones logradas, avance en rúbricas lingüísticas y desempeño en simulaciones reales.
              </p>
              <ul className="grid gap-4 text-sm text-[var(--azul-petroleo)]/75 md:grid-cols-2">
                {solutionHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[var(--rojo-brillante)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5">
              {industriesServed.map(({ title, summary }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[var(--azul-celeste)]/15 bg-[var(--azul-petroleo)]/5 p-6 shadow-inner"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--azul-celeste)]/90">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--azul-petroleo)]/70">
                    {summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[var(--azul-petroleo)]/90 px-8 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                Agenda corporativa
              </p>
              <p className="text-lg font-semibold">
                ¿Buscas un partner para escalar la comunicación global de tu empresa?
              </p>
              <p className="text-sm text-white/70">
                Coordinemos un diagnóstico gratuito y recibes una propuesta con roadmap, KPIs y metodología blended.
              </p>
            </div>
            <a href="#contacto" className="btn-cta inline-flex items-center justify-center rounded-full px-8 py-3 text-base">
              Diseñar plan corporativo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Companies;
