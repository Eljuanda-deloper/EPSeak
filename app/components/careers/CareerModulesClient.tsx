'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Loader } from 'lucide-react'

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Módulos no disponibles</h1>
          <p className="text-gray-500">Los módulos para esta carrera no están disponibles aún</p>
        </div>
      </div>
    )
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Módulos no disponibles</h1>
          <p className="text-gray-500">Los módulos para esta carrera no están disponibles aún</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Learning Modules
          </h2>
          <p className="text-lg text-gray-600">
            {modules.length} modules • {modules.reduce((acc, m) => acc + m.total_lessons, 0)} lessons
          </p>
        </motion.div>

        {/* Modules Grid */}
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/careers/${careerSlug}/modules/${module.id}`}>
                  <div className="h-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <div className="flex items-start justify-between">
                        <BookOpen className="w-8 h-8 text-white opacity-80" />
                        <span className="text-sm font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
                          Module {module.order_index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        {module.title}
                      </h3>

                      {module.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {module.description}
                        </p>
                      )}

                      {/* Module Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{module.estimated_hours}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{module.total_lessons} lessons</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Action */}
                    <div className="px-6 pb-6">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 group">
                        <span>Start Learning</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No modules available</h2>
            <p className="text-gray-600">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </div>
  )
}
