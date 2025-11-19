'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileDrawer from '@/app/components/careers/MobileDrawer'
import { ModuleCompletionModal } from './ModuleCompletionModal'
import { useLessonCompletion } from '@/app/hooks/useLessonCompletion'
import { useProgressContext } from '@/app/contexts/ProgressContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes: number
  content: string
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

interface ModuleViewProps {
  module: Module
  currentLessonId: string
  onLessonChange: (lessonId: string) => void
  children?: React.ReactNode
}

/**
 * Main module view component with responsive layout
 * Desktop: 2-col (sidebar + content)
 * Mobile: 1-col stacked with drawer
 * Uses Tailwind media queries for responsiveness
 * Integrated with Progress Context for completion tracking
 */
export default function ModuleView({
  module,
  currentLessonId,
  onLessonChange,
  children,
}: ModuleViewProps) {
  const currentLessons = module.lessons || []
  const currentLessonIndex = currentLessons.findIndex(
    (l) => l.id === currentLessonId
  )
  const currentLesson = currentLessons[currentLessonIndex] || null

  // Progress tracking
  const { completedLessons, isModuleComplete, moduleId } = useProgressContext()
  const { completeLesson, isLoading } = useLessonCompletion()
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [startTime] = useState(Date.now())

  // Show modal when module is complete
  useEffect(() => {
    if (isModuleComplete) {
      setShowCompletionModal(true)
    }
  }, [isModuleComplete])

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      onLessonChange(currentLessons[currentLessonIndex - 1].id)
    }
  }

  const handleNext = async () => {
    if (currentLessonIndex < currentLessons.length - 1) {
      // Mark current lesson as complete before moving to next
      if (!completedLessons.includes(currentLessonId)) {
        const timeSpent = Math.floor((Date.now() - startTime) / 60000)
        try {
          await completeLesson(currentLessonId, moduleId, timeSpent)
        } catch (error) {
          console.error('Error completing lesson:', error)
        }
      }
      onLessonChange(currentLessons[currentLessonIndex + 1].id)
    }
  }

  return (
    <>
      {/* Completion Modal */}
      <ModuleCompletionModal
        isOpen={showCompletionModal}
        moduleName={module.title}
        totalLessons={currentLessons.length}
        timeSpent={Math.floor((Date.now() - startTime) / 1000)}
        onClose={() => setShowCompletionModal(false)}
      />

      {/* Mobile Drawer for lesson navigation */}
      <MobileDrawer
        lessons={currentLessons}
        activeLesson={currentLessonId}
        onSelectLesson={onLessonChange}
        completedLessonIds={completedLessons}
      />

      {/* Main container: responsive grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Sidebar - Desktop only, visible below mobile drawer on mobile */}
        <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto">
          <LessonSidebarDesktop
            lessons={currentLessons}
            activeLesson={currentLessonId}
            onSelectLesson={onLessonChange}
            completedLessonIds={completedLessons}
          />
        </aside>

        {/* Main content area */}
        <main className="flex flex-col lg:col-span-2 px-4 sm:px-6 lg:px-0 pt-16 lg:pt-0">
          {/* Breadcrumb navigation */}
          <Breadcrumb moduleName={module.title} lessonName={currentLesson?.title} />

          {/* Content container */}
          <motion.div
            key={currentLessonId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 my-4 lg:my-0"
          >
            {/* Lesson header */}
            {currentLesson && (
              <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {currentLesson.title}
                </h1>
                {currentLesson.duration_minutes && (
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    ⏱️ Duración estimada: {currentLesson.duration_minutes} minutos
                  </p>
                )}
              </div>
            )}

            {/* Children content (rendered content like TextRenderer, VideoPlayer, etc.) */}
            <div className="prose dark:prose-invert max-w-none">{children}</div>
          </motion.div>

          {/* Navigation buttons - responsive layout */}
          <LessonNavigation
            currentIndex={currentLessonIndex}
            totalLessons={currentLessons.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </main>
      </div>
    </>
  )
}

/**
 * Desktop sidebar with lesson list
 */
function LessonSidebarDesktop({
  lessons,
  activeLesson,
  onSelectLesson,
  completedLessonIds = [],
}: {
  lessons: Lesson[]
  activeLesson: string
  onSelectLesson: (id: string) => void
  completedLessonIds?: string[]
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Lecciones
      </h2>
      <nav className="space-y-2">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLesson
          const isCompleted = completedLessonIds.includes(lesson.id)

          return (
            <motion.button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {/* Completion indicator */}
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isCompleted
                  ? isActive
                    ? 'bg-white text-blue-500'
                    : 'bg-green-500 text-white'
                  : isActive
                  ? 'border-2 border-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}>
                {isCompleted && '✓'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate">
                  {lesson.order_index + 1}. {lesson.title}
                </span>
                {lesson.duration_minutes && (
                  <span className="text-xs opacity-75">
                    {lesson.duration_minutes} min
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}

/**
 * Breadcrumb navigation
 */
function Breadcrumb({
  moduleName,
  lessonName,
}: {
  moduleName?: string
  lessonName?: string
}) {
  return (
    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-2">
      <span>Dashboard</span>
      <span className="opacity-50">/</span>
      {moduleName && (
        <>
          <span>{moduleName}</span>
          <span className="opacity-50">/</span>
        </>
      )}
      {lessonName && <span className="font-semibold text-slate-900 dark:text-white truncate">{lessonName}</span>}
    </div>
  )
}

/**
 * Responsive lesson navigation (Previous/Next buttons)
 * Full-width on mobile, side-by-side on desktop
 */
function LessonNavigation({
  currentIndex,
  totalLessons,
  onPrevious,
  onNext,
}: {
  currentIndex: number
  totalLessons: number
  onPrevious: () => void
  onNext: () => void
}) {
  const isPreviousDisabled = currentIndex === 0
  const isNextDisabled = currentIndex === totalLessons - 1

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pb-4">
      {/* Previous button */}
      <motion.button
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base w-full sm:flex-1 ${
          isPreviousDisabled
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-50'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">Atrás</span>
      </motion.button>

      {/* Progress indicator */}
      <div className="hidden sm:flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        {currentIndex + 1} de {totalLessons}
      </div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={isNextDisabled}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base w-full sm:flex-1 ${
          isNextDisabled
            ? 'bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-500 cursor-not-allowed opacity-50'
            : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
        }`}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <span className="sm:hidden">Adelante</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    </div>
  )
}
