'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'

interface Module {
  id: string
  title: string
  description: string
  order_index: number
  estimated_hours: number
  total_lessons: number
  career_id: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch modules for the English Automation career
        const response = await fetch('/api/careers/english-automation/modules', {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error('Failed to load modules')
        }

        const data = await response.json()
        setModules(data.modules || [])
      } catch (err) {
        console.error('Error fetching modules:', err)
        setError(err instanceof Error ? err.message : 'Error loading modules')
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const handleModuleClick = (moduleId: string) => {
    router.push(`/dashboard/modules/${moduleId}`)
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#7CC4E0]/20 border-t-[#7CC4E0] rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-2">Cargando módulos</h3>
            <p className="text-[#7CC4E0]">Preparando tu experiencia de aprendizaje...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="bg-white rounded-2xl p-6 border border-red-200">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-2">Error al cargar módulos</h3>
            <p className="text-[#7CC4E0] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A4E5A] mb-2">Módulos - English for Automation</h1>
            <p className="text-[#7CC4E0] text-sm">
              Completa los módulos secuenciales de inglés general y específico para dominar el idioma en contextos profesionales.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#0A4E5A]">{modules.length}</div>
            <div className="text-xs text-[#7CC4E0]">Módulos disponibles</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => handleModuleClick(module.id)}
            className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20 hover:border-[#7CC4E0] cursor-pointer transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0A4E5A] flex-1">{module.title}</h3>
              <span className="text-xs bg-[#7CC4E0]/10 text-[#0A4E5A] px-3 py-1 rounded-full font-semibold">
                Módulo {module.order_index}
              </span>
            </div>

            <p className="text-[#7CC4E0] text-sm mb-4 line-clamp-2">{module.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#E8ECEF] rounded-lg p-3">
                <div className="text-xs text-[#7CC4E0] mb-1">Duración</div>
                <div className="text-sm font-bold text-[#0A4E5A]">{module.estimated_hours}h</div>
              </div>
              <div className="bg-[#E8ECEF] rounded-lg p-3">
                <div className="text-xs text-[#7CC4E0] mb-1">Lecciones</div>
                <div className="text-sm font-bold text-[#0A4E5A]">{module.total_lessons}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modules.length === 0 && !loading && !error && (
        <div className="bg-white rounded-2xl p-12 border border-[#7CC4E0]/20 text-center">
          <p className="text-[#7CC4E0]">No hay módulos disponibles en este momento</p>
        </div>
      )}
    </div>
  )
}