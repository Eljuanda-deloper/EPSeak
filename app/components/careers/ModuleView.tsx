'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { Lesson, LessonWithAssets } from '@/types/modules'
import { LessonContent } from './LessonContent'
import { LessonNavigation } from './LessonNavigation'
import { LessonSidebar } from './LessonSidebar'
import { ProgressBar } from './ProgressBar'

interface ModuleViewProps {
  moduleName: string
  lessons: Lesson[]
  currentLesson: LessonWithAssets
  completedLessonIds: string[]
  onNavigate: (lessonId: string) => void
  onComplete: () => Promise<void>
  careerSlug: string
  moduleId: string
}

export function ModuleView({
  moduleName,
  lessons,
  currentLesson,
  completedLessonIds,
  onNavigate,
  onComplete,
  careerSlug,
  moduleId,
}: ModuleViewProps) {
  const [showBreadcrumb, setShowBreadcrumb] = useState(true)
  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id)
  const isLastLesson = currentIndex === lessons.length - 1
  const isCompleted = completedLessonIds.includes(currentLesson.id)

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(lessons[currentIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      onNavigate(lessons[currentIndex + 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {moduleName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Lección {currentIndex + 1} de {lessons.length}
              </p>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                ✓ Completada
              </span>
            )}
          </div>

          <ProgressBar
            completed={completedLessonIds.length}
            total={lessons.length}
            showText={true}
            showPercentage={true}
          />
        </div>
      </motion.header>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <LessonSidebar
            lessons={lessons}
            currentLessonId={currentLesson.id}
            completedLessonIds={completedLessonIds}
            onSelectLesson={onNavigate}
          />

          {/* Main content area */}
          <motion.div
            key={currentLesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:col-span-3"
          >
            <article className="bg-white dark:bg-gray-900 rounded-lg p-6 sm:p-8 shadow-sm">
              <LessonContent lesson={currentLesson} />

              {/* Navigation */}
              <LessonNavigation
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={onComplete}
                isPreviousDisabled={currentIndex === 0}
                isNextDisabled={isLastLesson && !isCompleted}
                isLastLesson={isLastLesson}
              />
            </article>
          </motion.div>
        </div>
      </div>

      {/* Floating progress indicator */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={showBreadcrumb ? { opacity: 0, y: 20, pointerEvents: 'none' } : { opacity: 1, y: 0 }}
        aria-label="Ir al inicio"
      >
        <ChevronUp size={24} />
      </motion.button>
    </div>
  )
}
