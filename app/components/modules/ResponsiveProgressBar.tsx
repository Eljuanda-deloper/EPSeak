'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'

interface ResponsiveProgressBarProps {
  currentLessonIndex: number
  totalLessons: number
  completedLessons: number
  estimatedTimeMinutes?: number
  elapsedTimeMinutes?: number
}

/**
 * Responsive progress indicator component
 * Shows:
 * - Progress bar with percentage
 * - Lesson count (X of Y)
 * - Time estimate
 * - Time remaining
 *
 * Mobile: Compact layout
 * Desktop: Expanded layout
 */
export default function ResponsiveProgressBar({
  currentLessonIndex,
  totalLessons,
  completedLessons,
  estimatedTimeMinutes = 0,
  elapsedTimeMinutes = 0,
}: ResponsiveProgressBarProps) {
  const progressPercentage =
    totalLessons > 0 ? ((currentLessonIndex + 1) / totalLessons) * 100 : 0
  const completionPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const remainingTime = Math.max(0, estimatedTimeMinutes - elapsedTimeMinutes)

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Main progress bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs lg:text-sm font-semibold text-slate-900 dark:text-white">
            Progreso
          </h3>
          <span className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">
            {completedLessons}/{totalLessons}
          </span>
        </div>

        {/* Progress bar with animation */}
        <div className="h-2 lg:h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
          />
        </div>

        {/* Percentage text */}
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {completionPercentage.toFixed(0)}% completado
        </p>
      </div>

      {/* Stats row - responsive layout */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 pt-2 lg:pt-4 border-t border-slate-200 dark:border-slate-700">
        {/* Current lesson */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Lección actual</p>
            <p className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
              {currentLessonIndex + 1}/{totalLessons}
            </p>
          </div>
        </div>

        {/* Estimated time - hidden on mobile if space is tight */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="hidden lg:inline">Tiempo estimado</span>
              <span className="lg:hidden">Duración</span>
            </p>
            <p className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
              {estimatedTimeMinutes}m
            </p>
          </div>
        </div>

        {/* Time remaining - desktop only */}
        <div className="hidden lg:flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tiempo restante</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {remainingTime}m
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: Time remaining as secondary stat */}
      {remainingTime > 0 && (
        <div className="lg:hidden p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-700 dark:text-orange-300">
            ⏱️ Tiempo restante: <span className="font-semibold">{remainingTime}m</span>
          </p>
        </div>
      )}
    </div>
  )
}
