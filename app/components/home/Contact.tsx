"use client";
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { FaWhatsapp, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const contactMethods = [
  {
    title: 'Escríbenos',
    value: 'hola@epseak.com',
    description: 'Respondemos en menos de 24 horas hábiles.',
    href: 'mailto:hola@epseak.com',
    Icon: EnvelopeIcon
  },
  {
    title: 'WhatsApp directo',
    value: '+57 311 367 8555',
    description: 'Asesoría inmediata de lunes a sábado.',
    href: 'https://wa.me/573113678555',
    Icon: PhoneIcon
  },
  {
    title: 'Sesiones globales',
    value: 'Bogotá · Horarios internacionales',
    description: 'Atención virtual para cualquier zona horaria.',
    href: 'https://maps.app.goo.gl/3bmM5sKfQ1',
    Icon: MapPinIcon
  },
  {
    title: 'Disponibilidad',
    value: 'Lunes a sábado · 8:00am - 7:00pm',
    description: 'Agendamos según tu agenda profesional.',
    href: '#contacto',
    Icon: ClockIcon
  }
];

const contactHighlights = [
  {
    value: '+2000',
    label: 'Profesionales formados',
    description: 'Expertos en salud, ingeniería y educación.'
  },
  {
    value: '98%',
    label: 'Satisfacción',
    description: 'Calificación promedio de nuestros programas.'
  },
  {
    value: '24h',
    label: 'Tiempo de respuesta',
    description: 'Te contactamos en menos de un día hábil.'
  }
];

const socialLinks = [
  { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
  { label: 'WhatsApp', href: 'https://wa.me/573113678555', Icon: FaWhatsapp },
  { label: 'Instagram', href: '#', Icon: FaInstagram }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    profesion: '',
    objetivo: 'Asesoría gratuita',
    mensaje: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, email, profesion, objetivo, mensaje } = formData;
    const whatsappMessage = `Hola, soy ${nombre}. Mi email es ${email}. Soy ${profesion}. Mi objetivo es: ${objetivo}. Mensaje: ${mensaje}`;
    const whatsappUrl = `https://wa.me/573113678555?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    setFormData({
      nombre: '',
      email: '',
      profesion: '',
      objetivo: 'Asesoría gratuita',
      mensaje: ''
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-gradient-to-b from-[var(--gris-suave)] via-white to-white py-24"
    >
      <div className="pointer-events-none absolute -top-48 -left-32 h-72 w-72 rounded-full bg-[var(--azul-celeste)]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-[var(--rojo-brillante)]/15 blur-[140px]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--azul-celeste)]/20 to-transparent lg:block" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full bg-[var(--azul-celeste)]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--azul-celeste)]">
            Agenda tu asesoría
          </span>
          <h2 className="section-title !mb-6 text-4xl sm:text-5xl">
            Conversemos sobre tu proyecto global
          </h2>
          <p className="text-lg text-[var(--azul-petroleo)]/80">
            Nuestro equipo de especialistas en inglés para propósitos específicos te acompaña en cada etapa. Cuéntanos tus objetivos y diseñaremos un plan personalizado para tu crecimiento profesional.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur"
            >
              <div className="pointer-events-none absolute -top-16 -right-24 h-56 w-56 rounded-full bg-[var(--azul-celeste)]/15 blur-[120px]" />
              <div className="relative space-y-6">
                <h3 className="text-2xl font-semibold text-[var(--azul-petroleo)]">
                  Tu acompañamiento inicia aquí
                </h3>
                <p className="text-[var(--azul-petroleo)]/75">
                  Conversa con un asesor académico y descubre el camino ideal para certificarte, migrar o potenciar tu carrera en entornos internacionales.
                </p>
                <ul className="grid gap-4 text-sm text-[var(--azul-petroleo)]/80 sm:grid-cols-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[var(--azul-celeste)]" />
                    Planes personalizados por industria
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[var(--rojo-brillante)]" />
                    Mentores certificados a nivel internacional
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[var(--azul-celeste)]" />
                    Simulaciones reales de entrevistas y exámenes
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[var(--rojo-brillante)]" />
                    Seguimiento semanal con indicadores claros
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 md:grid-cols-2"
            >
              {contactMethods.map(({ title, value, description, href, Icon }) => (
                <a
                  key={title}
                  href={href}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--azul-celeste)]/10 bg-white/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--azul-celeste)]/40 hover:shadow-2xl backdrop-blur"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--azul-celeste)]/0 via-[var(--azul-celeste)]/5 to-[var(--azul-celeste)]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[var(--azul-celeste)]/15 text-[var(--azul-celeste)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--azul-celeste)]/80">
                        {title}
                      </p>
                      <p className="text-lg font-semibold text-[var(--azul-petroleo)]">
                        {value}
                      </p>
                      <p className="text-sm text-[var(--azul-petroleo)]/70">{description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8 rounded-3xl border border-[var(--azul-celeste)]/20 bg-white/75 p-8 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--azul-celeste)]">
                  Confianza global
                </p>
                <div className="grid gap-6 sm:grid-cols-3">
                  {contactHighlights.map(({ value, label, description }) => (
                    <div key={label} className="rounded-2xl bg-white/60 p-4 shadow-inner">
                      <p className="text-3xl font-bold text-[var(--azul-petroleo)]">{value}</p>
                      <p className="mt-1 text-sm font-medium text-[var(--azul-petroleo)]/75">{label}</p>
                      <p className="mt-2 text-xs text-[var(--azul-petroleo)]/60">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--azul-celeste)]/20 bg-white text-[var(--azul-petroleo)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--azul-celeste)]/60 hover:text-[var(--azul-celeste)]"
                  >
                    <Icon className="text-xl" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="pointer-events-none absolute -top-28 right-20 h-56 w-56 rounded-full bg-[var(--azul-celeste)]/20 blur-[120px]" />
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="relative flex h-full flex-col gap-8 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 sm:p-10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--azul-celeste)] via-[var(--rojo-brillante)] to-[var(--azul-celeste)]" />
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-semibold text-[var(--azul-petroleo)]">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Laura Gómez"
                    className="w-full rounded-xl border border-[var(--gris-suave)] bg-white px-4 py-3 text-sm text-[var(--azul-petroleo)] shadow-inner outline-none transition focus:border-[var(--azul-celeste)] focus:shadow-[0_0_0_4px_rgba(124,196,224,0.2)]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[var(--azul-petroleo)]">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nombre@empresa.com"
                    className="w-full rounded-xl border border-[var(--gris-suave)] bg-white px-4 py-3 text-sm text-[var(--azul-petroleo)] shadow-inner outline-none transition focus:border-[var(--azul-celeste)] focus:shadow-[0_0_0_4px_rgba(124,196,224,0.2)]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="profesion" className="text-sm font-semibold text-[var(--azul-petroleo)]">
                    Profesión o rol actual
                  </label>
                  <input
                    type="text"
                    id="profesion"
                    value={formData.profesion}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Enfermera jefe, Ingeniero civil"
                    className="w-full rounded-xl border border-[var(--gris-suave)] bg-white px-4 py-3 text-sm text-[var(--azul-petroleo)] shadow-inner outline-none transition focus:border-[var(--azul-celeste)] focus:shadow-[0_0_0_4px_rgba(124,196,224,0.2)]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="objetivo" className="text-sm font-semibold text-[var(--azul-petroleo)]">
                    Objetivo principal
                  </label>
                  <select
                    id="objetivo"
                    value={formData.objetivo}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-[var(--gris-suave)] bg-white px-4 py-3 text-sm text-[var(--azul-petroleo)] shadow-inner outline-none transition focus:border-[var(--azul-celeste)] focus:shadow-[0_0_0_4px_rgba(124,196,224,0.2)]"
                  >
                    <option value="Asesoría gratuita">Asesoría gratuita</option>
                    <option value="Inglés para certificaciones">Inglés para certificaciones</option>
                    <option value="Preparar entrevista internacional">Preparar entrevista internacional</option>
                    <option value="Capacitación empresarial">Capacitación empresarial</option>
                    <option value="Otro objetivo">Otro objetivo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-semibold text-[var(--azul-petroleo)]">
                  Cuéntanos en qué podemos ayudarte
                </label>
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Comparte tus metas, certificaciones a lograr o fechas límite relevantes."
                  className="w-full rounded-2xl border border-[var(--gris-suave)] bg-white px-4 py-3 text-sm text-[var(--azul-petroleo)] shadow-inner outline-none transition focus:border-[var(--azul-celeste)] focus:shadow-[0_0_0_4px_rgba(124,196,224,0.2)]"
                />
              </div>

              <div className="rounded-2xl bg-[var(--gris-suave)]/60 px-5 py-4 text-xs leading-relaxed text-[var(--azul-petroleo)]/70">
                Al enviar tus datos autorizas a ESPeak a contactarte por correo, WhatsApp o llamada telefónica. Protegemos tu información según nuestra política de privacidad.
              </div>

              <button type="submit" className="btn-cta w-full py-4 text-lg">
                Agendar una sesión gratuita
              </button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
