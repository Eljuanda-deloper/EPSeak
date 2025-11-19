'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModulesList from '@/app/components/dashboard/ModulesList'
import { useModules } from '@/app/hooks/useModules'

// Mock data - This will be replaced with real data from Supabase
const mockModules = [
  {
    id: '1',
    title: 'Introducción a la Medicina',
    description: 'Aprende terminología médica básica y vocabulario esencial para comunicarte en entornos médicos.',
    area_of_interest: 'Medicina',
    order_index: 1,
    is_unlocked: true,
    completion_percentage: 100,
    prerequisites: []
  },
  {
    id: '2',
    title: 'Anatomía y Fisiología',
    description: 'Domina el vocabulario relacionado con el cuerpo humano, sistemas orgánicos y funciones fisiológicas.',
    area_of_interest: 'Medicina',
    order_index: 2,
    is_unlocked: true,
    completion_percentage: 75,
    prerequisites: ['1']
  },
  {
    id: '3',
    title: 'Diagnóstico y Tratamiento',
    description: 'Aprende términos médicos avanzados para diagnósticos, tratamientos y procedimientos clínicos.',
    area_of_interest: 'Medicina',
    order_index: 3,
    is_unlocked: false,
    completion_percentage: 0,
    prerequisites: ['2']
  },
  {
    id: '4',
    title: 'Derecho Contractual',
    description: 'Vocabulario esencial para contratos, acuerdos legales y terminología jurídica básica.',
    area_of_interest: 'Legal',
    order_index: 1,
    is_unlocked: true,
    completion_percentage: 60,
    prerequisites: []
  },
  {
    id: '5',
    title: 'Litigios y Tribunales',
    description: 'Términos avanzados para procedimientos judiciales, litigios y sistema judicial.',
    area_of_interest: 'Legal',
    order_index: 2,
    is_unlocked: false,
    completion_percentage: 0,
    prerequisites: ['4']
  },
  {
    id: '6',
    title: 'Negocios Internacionales',
    description: 'Vocabulario para comercio global, importación/exportación y relaciones comerciales.',
    area_of_interest: 'Negocios',
    order_index: 1,
    is_unlocked: true,
    completion_percentage: 30,
    prerequisites: []
  }
]

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const router = useRouter()
  const { modules, loading, error, filterModules } = useModules()

  const englishModules = modules.filter(module => module.area_of_interest === 'english')
  const filteredModules = filterModules(searchTerm, areaFilter, '').filter(module => englishModules.some(em => em.id === module.id))

  const handleModuleClick = (module: any) => {
    if (module.is_unlocked) {
      router.push(`/dashboard/modules/${module.id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#7CC4E0]/20 border-t-[#7CC4E0] rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-2">Loading modules</h3>
            <p className="text-[#7CC4E0]">Preparing your learning experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
        <div className="bg-white rounded-2xl p-6 border border-[#E0312D]/20">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E0312D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-[#0A4E5A] mb-2">Error loading modules</h3>
            <p className="text-[#7CC4E0] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#0A4E5A] text-white rounded-lg hover:bg-[#7CC4E0] transition-colors"
            >
              Retry
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
            <h1 className="text-2xl font-bold text-[#0A4E5A] mb-2">English Career</h1>
            <p className="text-[#7CC4E0] text-sm">
              Complete sequential modules of general and specific English to master the language in professional contexts.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#0A4E5A]">{englishModules.filter(m => m.is_unlocked).length}</div>
            <div className="text-xs text-[#7CC4E0]">Unlocked modules</div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#E8ECEF] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#0A4E5A]">{englishModules.filter(m => m.completion_percentage === 100).length}</div>
            <div className="text-sm text-[#7CC4E0]">Completed</div>
          </div>
          <div className="bg-[#E8ECEF] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#0A4E5A]">{englishModules.filter(m => m.is_unlocked && m.completion_percentage < 100).length}</div>
            <div className="text-sm text-[#7CC4E0]">In progress</div>
          </div>
          <div className="bg-[#E8ECEF] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#E0312D]">{englishModules.filter(m => !m.is_unlocked).length}</div>
            <div className="text-sm text-[#7CC4E0]">Locked</div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="bg-white rounded-2xl p-6 border border-[#7CC4E0]/20">
        <ModulesList
          modules={filteredModules}
          onModuleClick={handleModuleClick}
        />
      </div>
    </div>
  )
}