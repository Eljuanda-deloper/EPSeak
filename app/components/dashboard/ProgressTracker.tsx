'use client'

import { useState } from 'react'
import { Trophy, Target, TrendingUp, Award, Star, CheckCircle, Lock, Play, Clock } from 'lucide-react'

interface Module {
  id: string
  title: string
  area_of_interest: string
  order_index: number
  is_unlocked: boolean
  completion_percentage: number
  lessons: any[]
}

interface ProgressTrackerProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
}

export default function ProgressTracker({ modules, onModuleClick }: ProgressTrackerProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview')

  // Sort modules by order_index
  const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index)

  const totalModules = modules.length
  const completedModules = modules.filter(m => m.completion_percentage === 100).length
  const unlockedModules = modules.filter(m => m.is_unlocked).length
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = modules.reduce((acc, module) =>
    acc + module.lessons.filter((lesson: any) => lesson.completed).length, 0
  )

  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0

  const getModuleStatus = (module: Module) => {
    if (module.completion_percentage === 100) return 'completed'
    if (module.is_unlocked) return 'unlocked'
    return 'locked'
  }

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'unlocked':
        return <Play className="w-6 h-6 text-[#7CC4E0]" />
      case 'locked':
        return <Lock className="w-6 h-6 text-[#E0312D]" />
      default:
        return null
    }
  }

  const getModuleColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-600'
      case 'unlocked':
        return 'bg-[#7CC4E0] border-[#0A4E5A]'
      case 'locked':
        return 'bg-[#E0312D]/20 border-[#E0312D]/50'
      default:
        return 'bg-gray-200 border-gray-300'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#7CC4E0]/20 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] text-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 md:w-7 md:h-7" />
              Your Learning Path
            </h2>
            <p className="text-white/80 mt-1 text-sm md:text-base">
              Master professional English through structured modules
            </p>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-2xl md:text-3xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-white/80">Overall Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 md:mt-6">
          <div className="flex justify-between text-xs md:text-sm text-white/80 mb-2">
            <span>Start</span>
            <span className="hidden sm:inline">{completedModules} of {totalModules} modules completed</span>
            <span className="sm:hidden">{completedModules}/{totalModules} done</span>
            <span>Goal</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7CC4E0] to-[#0A4E5A] rounded-full transition-all duration-1000"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 md:p-6 border-b border-[#E8ECEF]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-xl text-center border border-green-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-green-700">{completedModules}</div>
            <div className="text-xs md:text-sm text-green-600 font-medium">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-xl text-center border border-blue-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-blue-700">{unlockedModules}</div>
            <div className="text-xs md:text-sm text-blue-600 font-medium">Unlocked</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 md:p-4 rounded-xl text-center border border-red-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-red-700">{totalModules - unlockedModules}</div>
            <div className="text-xs md:text-sm text-red-600 font-medium">Locked</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 md:p-4 rounded-xl text-center border border-yellow-200 lg:col-span-2 lg:max-w-xs lg:mx-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-yellow-700">{completedLessons}</div>
            <div className="text-xs md:text-sm text-yellow-600 font-medium">Lessons Completed</div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="p-4 md:p-6 border-b border-[#E8ECEF]">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedView === 'overview'
                ? 'bg-[#0A4E5A] text-white shadow-md'
                : 'bg-[#E8ECEF] text-[#0A4E5A] hover:bg-[#7CC4E0]/20 hover:shadow-sm'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedView === 'detailed'
                ? 'bg-[#0A4E5A] text-white shadow-md'
                : 'bg-[#E8ECEF] text-[#0A4E5A] hover:bg-[#7CC4E0]/20 hover:shadow-sm'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Learning Path Visualization */}
      <div className="p-4 md:p-6">
        {selectedView === 'overview' ? (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg font-semibold text-[#0A4E5A] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Learning Path
            </h3>

            {/* Progress Track */}
            <div className="relative">
              {/* Track Path */}
              <div className="h-4 md:h-5 bg-[#E8ECEF] rounded-full relative overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#0A4E5A] via-[#7CC4E0] to-[#0A4E5A] rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {/* Module Checkpoints */}
              <div className="absolute -top-10 md:-top-12 left-0 right-0 flex justify-between px-2">
                {sortedModules.map((module, index) => {
                  const status = getModuleStatus(module)
                  const position = sortedModules.length > 1 ? (index / (sortedModules.length - 1)) * 100 : 50

                  return (
                    <div
                      key={module.id}
                      className="flex flex-col items-center max-w-16 md:max-w-20"
                      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                    >
                      <button
                        onClick={() => onModuleClick(module)}
                        disabled={status === 'locked'}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-3 md:border-4 flex items-center justify-center transition-all hover:scale-110 shadow-md ${
                          getModuleColor(status)
                        } ${status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg'}`}
                      >
                        {getModuleIcon(status)}
                      </button>
                      <div className="text-center mt-2">
                        <div className={`text-xs font-medium truncate leading-tight ${
                          status === 'locked' ? 'text-[#E0312D]' : 'text-[#0A4E5A]'
                        }`}>
                          {module.title}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
              {completedModules >= 1 && (
                <div className="bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] text-white p-3 md:p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow">
                  <Award className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="font-semibold text-sm md:text-base">First module completed</div>
                  <div className="text-xs md:text-sm text-white/80">Excellent start!</div>
                </div>
              )}
              {completedModules >= totalModules * 0.5 && (
                <div className="bg-gradient-to-r from-[#7CC4E0] to-[#0A4E5A] text-white p-3 md:p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="font-semibold text-sm md:text-base">Halfway there</div>
                  <div className="text-xs md:text-sm text-white/80">You're on the right track!</div>
                </div>
              )}
              {completedModules === totalModules && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 md:p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                  <Star className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="font-semibold text-sm md:text-base">Career completed!</div>
                  <div className="text-xs md:text-sm text-white/80">Congratulations!</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Detailed View */
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg font-semibold text-[#0A4E5A] flex items-center gap-2">
              <Target className="w-5 h-5" />
              Detailed Progress by Module
            </h3>

            {sortedModules.map((module) => {
              const status = getModuleStatus(module)
              const completedLessons = module.lessons.filter((l: any) => l.completed).length
              const totalLessons = module.lessons.length

              return (
                <div
                  key={module.id}
                  className="border border-[#E8ECEF] rounded-xl p-3 md:p-4 hover:border-[#7CC4E0] hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        status === 'completed' ? 'bg-green-100 text-green-600' :
                        status === 'unlocked' ? 'bg-[#7CC4E0]/20 text-[#7CC4E0]' :
                        'bg-[#E0312D]/20 text-[#E0312D]'
                      }`}>
                        {getModuleIcon(status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-[#0A4E5A] truncate">{module.title}</h4>
                        <p className="text-sm text-[#7CC4E0] capitalize">{module.area_of_interest}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onModuleClick(module)}
                      disabled={status === 'locked'}
                      className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        status === 'locked'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-[#0A4E5A] text-white hover:bg-[#7CC4E0] hover:shadow-md'
                      }`}
                    >
                      {status === 'completed' ? 'Review' : status === 'unlocked' ? 'Continue' : 'Locked'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#0A4E5A] font-medium">Module Progress</span>
                      <span className="text-[#7CC4E0] font-semibold">{module.completion_percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#E8ECEF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full transition-all duration-500"
                        style={{ width: `${module.completion_percentage}%` }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm text-[#7CC4E0]">
                        {completedLessons} of {totalLessons} lessons completed
                      </span>
                      <span className="text-sm text-[#7CC4E0]">
                        {module.lessons.reduce((acc: number, lesson: any) => acc + lesson.duration_minutes, 0)} min total
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}