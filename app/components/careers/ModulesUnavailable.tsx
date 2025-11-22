'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, Award } from 'lucide-react';

export default function ModulesUnavailable() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-20">
      {/* Animated Background with Beams Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-azul-celeste opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-azul-petroleo opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rojo-brillante opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-azul-celeste/10 to-azul-petroleo/10 border border-azul-celeste/20 mb-6">
            <Clock className="w-5 h-5 text-azul-petroleo" />
            <span className="text-azul-petroleo font-semibold text-sm">Próximamente</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Módulos en Desarrollo
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos creando contenido de calidad mundial para expandir tu experiencia de aprendizaje
          </p>
        </motion.div>

        {/* Bento Grid Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-azul-petroleo/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-azul-celeste/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificaciones Avanzadas</h3>
              <p className="text-gray-600 leading-relaxed">
                Nuevas certificaciones internacionales reconocidas por las principales organizaciones profesionales
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-azul-petroleo/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-azul-celeste/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mentoría 1 a 1</h3>
              <p className="text-gray-600 leading-relaxed">
                Sesiones personalizadas con expertos de la industria para guiar tu desarrollo profesional
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-azul-petroleo/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-azul-celeste/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Laboratorios Prácticos</h3>
              <p className="text-gray-600 leading-relaxed">
                Entornos interactivos para practicar habilidades reales en escenarios profesionales
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-azul-petroleo via-azul-celeste to-azul-petroleo rounded-2xl p-8 md:p-12 text-white shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
              <p className="text-white/80">Nuevos módulos en desarrollo</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
              <p className="text-white/80">Oportunidades de aprendizaje</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">Q1 2026</div>
              <p className="text-white/80">Fecha de lanzamiento</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="px-8 py-4 bg-white text-azul-petroleo font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95">
              Notificarme cuando esté listo
            </button>
            <button className="px-8 py-4 bg-white/20 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 active:scale-95">
              Ir a otros módulos
            </button>
          </div>
        </motion.div>

        {/* Coming Soon Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">Cronograma de Lanzamientos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { month: 'Q1 2026', title: 'Advanced Certifications' },
              { month: 'Q2 2026', title: 'One-on-One Mentoring' },
              { month: 'Q3 2026', title: 'Practical Labs' },
              { month: 'Q4 2026', title: 'Expert Network' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-azul-petroleo/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-sm font-semibold text-azul-petroleo mb-2">{item.month}</div>
                <div className="text-lg font-bold text-gray-900">{item.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
