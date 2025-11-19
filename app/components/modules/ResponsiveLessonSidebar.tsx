'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes?: number
}

interface ResponsiveLessonSidebarProps {
  lessons: Lesson[]
  currentLessonId: string
  onSelectLesson: (lessonId: string) => void
  completedLessonIds?: string[]
}

/**
 * Responsive sidebar for lesson selection
 * - Desktop (lg): Vertical list, sticky positioning
 * - Mobile (md-below): Collapsible accordion
 * Includes progress indicators and duration
 */
export default function ResponsiveLessonSidebar({
  lessons,
  currentLessonId,
  onSelectLesson,
  completedLessonIds = [],
}: ResponsiveLessonSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate progress
  const totalLessons = lessons.length
  const completedLessons = completedLessonIds.length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <aside className="flex flex-col">
      {/* Mobile: Expandable header */}
      <div className="lg:hidden mb-4">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <span className="font-semibold text-slate-900 dark:text-white">
            Lecciones ({completedLessons}/{totalLessons})
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </motion.div>
        </motion.button>

        {/* Progress bar - mobile */}
        <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {progressPercentage.toFixed(0)}% completado
        </p>
      </div>

      {/* Desktop: Progress card */}
      <div className="hidden lg:block mb-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Progreso del módulo
        </p>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {completedLessons} de {totalLessons} lecciones completadas
        </p>
      </div>

      {/* Lessons list */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden lg:overflow-visible lg:block lg:h-auto"
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-3 lg:p-4 space-y-1 border border-slate-200 dark:border-slate-700 lg:border-0">
          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonId
              const isCompleted = completedLessonIds.includes(lesson.id)

              return (
                <motion.button
                  key={lesson.id}
                  onClick={() => {
                    onSelectLesson(lesson.id)
                    setIsExpanded(false) // Close mobile accordion after selection
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-3 py-2.5 lg:py-3 rounded-lg transition-all flex items-start gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Completion indicator */}
                  <div
                    className={`mt-0.5 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? isActive
                          ? 'bg-white border-white text-blue-500'
                          : 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'border-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isCompleted && '✓'}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm lg:text-base font-medium truncate">
                      {lesson.order_index + 1}. {lesson.title}
                    </span>
                    {lesson.duration_minutes && (
                      <span className={`block text-xs opacity-75 ${isActive ? 'text-blue-100' : ''}`}>
                        {lesson.duration_minutes} min
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
              No hay lecciones disponibles
            </p>
          )}
        </div>
      </motion.div>
    </aside>
  )
}
