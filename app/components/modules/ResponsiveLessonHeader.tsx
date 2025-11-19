'use client'

import { motion } from 'framer-motion'
import { Clock, BookOpen, Award } from 'lucide-react'

interface ResponsiveLessonHeaderProps {
  title: string
  description?: string
  durationMinutes?: number
  lessonNumber?: number
  totalLessons?: number
  isCompleted?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Responsive lesson header component
 * Displays lesson title, metadata, and description
 * Adapts layout based on screen size
 *
 * Mobile: Vertical stack, larger margins
 * Desktop: Horizontal layout, compact
 */
export default function ResponsiveLessonHeader({
  title,
  description,
  durationMinutes,
  lessonNumber,
  totalLessons,
  isCompleted = false,
  difficulty,
}: ResponsiveLessonHeaderProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-slate-200 dark:border-slate-700"
    >
      {/* Lesson number and metadata - mobile: stacked, desktop: horizontal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {lessonNumber && totalLessons && (
          <span className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Lección {lessonNumber} de {totalLessons}
          </span>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2">
          {isCompleted && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full"
            >
              ✓ Completada
            </motion.span>
          )}

          {difficulty && (
            <span
              className={`inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-semibold rounded-full ${
                difficultyColors[difficulty]
              }`}
            >
              {difficulty === 'beginner'
                ? 'Principiante'
                : difficulty === 'intermediate'
                ? 'Intermedio'
                : 'Avanzado'}
            </span>
          )}

          {durationMinutes && (
            <span className="inline-flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              {durationMinutes}m
            </span>
          )}
        </div>
      </div>

      {/* Title - responsive size */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 lg:mb-4"
      >
        {title}
      </motion.h1>

      {/* Description - responsive text size */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  )
}
