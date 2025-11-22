'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Loader, Users, TrendingUp, Award, Star, CheckCircle, Zap } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  order_index: number
  estimated_hours: number
  total_lessons: number
}

interface Career {
  id: string
  title: string
  slug: string
}

interface CareerModulesClientProps {
  careerSlug: string
}

export default function CareerModulesClient({ careerSlug }: CareerModulesClientProps) {
  const [career, setCareer] = useState<Career | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/careers/${careerSlug}/modules`)

        if (!response.ok) {
          throw new Error('Failed to fetch modules')
        }

        const data = await response.json()
        setCareer(data.career)
        setModules(data.modules)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (careerSlug) {
      fetchModules()
    }
  }, [careerSlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !modules || modules.length === 0) {
    return (
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 min-h-screen flex items-center justify-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Módulos en Preparación</h2>
          <p className="text-gray-600 text-lg mb-8">Los módulos para esta carrera estarán disponibles próximamente. Estamos preparando contenido de alta calidad.</p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <p className="text-sm font-semibold text-blue-600">Próximas semanas</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm font-semibold text-blue-600">Plan de Estudios</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Módulos de Aprendizaje
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {modules.length} módulos estructurados • {modules.reduce((acc, m) => acc + m.total_lessons, 0)} lecciones totales
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/careers/${careerSlug}/modules/${module.id}`}>
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                  {/* Card Header with gradient */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full opacity-20"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-10"></div>
                    </div>

                    <div className="relative h-full flex items-start justify-between p-6">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <motion.span
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-3xl font-bold text-white opacity-80"
                      >
                        {module.order_index + 1}
                      </motion.span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                      {module.title}
                    </h3>

                    {module.description && (
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {module.description}
                      </p>
                    )}

                    {/* Module Stats */}
                    <div className="space-y-3 border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-600">Duración</span>
                        </div>
                        <span className="font-semibold text-gray-900">{module.estimated_hours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-cyan-600" />
                          </div>
                          <span className="text-sm text-gray-600">Lecciones</span>
                        </div>
                        <span className="font-semibold text-gray-900">{module.total_lessons}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Comenzar</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
