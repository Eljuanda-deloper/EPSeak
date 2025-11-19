'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, Play, Clock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Module {
  id: string
  title: string
  description: string
  area_of_interest: string
  order_index: number
  is_unlocked: boolean
  completion_percentage: number
  prerequisites?: string[]
}

interface ModulesListProps {
  modules: Module[]
  onModuleClick?: (module: Module) => void
}

export default function ModulesList({ modules, onModuleClick }: ModulesListProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const handleModuleClick = (module: Module) => {
    if (module.is_unlocked) {
      setSelectedModule(module.id)
      onModuleClick?.(module)
    }
  }

  const getModuleStatus = (module: Module) => {
    if (module.completion_percentage === 100) return 'completed'
    if (module.is_unlocked) return 'unlocked'
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'unlocked':
        return <Unlock className="w-5 h-5 text-[#7CC4E0]" />
      case 'locked':
        return <Lock className="w-5 h-5 text-[#E0312D]" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 hover:border-green-300'
      case 'unlocked':
        return 'border-[#7CC4E0] bg-[#E8ECEF] hover:border-[#0A4E5A]'
      case 'locked':
        return 'border-[#E0312D]/30 bg-gray-50 opacity-60'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0A4E5A] flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Learning Modules
        </h2>
        <div className="flex items-center gap-4 text-sm text-[#7CC4E0]">
          <div className="flex items-center gap-1">
            <Unlock className="w-4 h-4" />
            <span>Unlocked</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const status = getModuleStatus(module)
          const isClickable = status !== 'locked'

          return (
            <div
              key={module.id}
              className={`relative border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer group ${
                getStatusColor(status)
              } ${selectedModule === module.id ? 'ring-2 ring-[#0A4E5A]' : ''}`}
              onClick={() => handleModuleClick(module)}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                {getStatusIcon(status)}
              </div>

              {/* Module Content */}
              <div className="pr-8">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-lg font-semibold transition-colors ${
                    status === 'locked' ? 'text-gray-500' : 'text-[#0A4E5A] group-hover:text-[#7CC4E0]'
                  }`}>
                    {module.title}
                  </h3>
                </div>

                <p className={`text-sm mb-4 line-clamp-2 ${
                  status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {module.description}
                </p>

                {/* Area of Interest */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'locked'
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-[#7CC4E0]/20 text-[#0A4E5A]'
                  }`}>
                    {module.area_of_interest}
                  </span>
                </div>

                {/* Progress Bar */}
                {status !== 'locked' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#0A4E5A] font-medium">Progress</span>
                      <span className="text-[#7CC4E0]">{module.completion_percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#E8ECEF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full transition-all duration-500"
                        style={{ width: `${module.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {module.prerequisites && module.prerequisites.length > 0 && status === 'locked' && (
                  <div className="mb-4 p-3 bg-[#E0312D]/10 rounded-lg border border-[#E0312D]/20">
                    <div className="flex items-center gap-2 text-sm text-[#E0312D]">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Prerequisites required</span>
                    </div>
                    <p className="text-xs text-[#E0312D]/80 mt-1">
                      Complete {module.prerequisites.length} module{module.prerequisites.length > 1 ? 's' : ''} first
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>~2-3 hours</span>
                  </div>

                  {status === 'unlocked' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0A4E5A] hover:bg-[#7CC4E0] text-white rounded-lg transition-colors text-sm font-medium">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}

                  {status === 'completed' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Review
                    </div>
                  )}

                  {status === 'locked' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                      <Lock className="w-4 h-4" />
                      Locked
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {isClickable && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A4E5A]/5 to-[#7CC4E0]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-[#7CC4E0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0A4E5A] mb-2">No modules available</h3>
          <p className="text-gray-600">Check back later for new learning content.</p>
        </div>
      )}
    </div>
  )
}