'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface ProgressTrackerProps {
  completedLessons: number
  totalLessons: number
  completionPercentage: number
}

export function ProgressTracker({
  completedLessons,
  totalLessons,
  completionPercentage,
}: ProgressTrackerProps) {
  const percentage = Math.round(completionPercentage)

  return (
    <div className="w-full space-y-3">
      {/* Percentage Circle with Text */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-16 h-16"
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="text-blue-500"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {percentage}%
              </span>
            </div>
          </motion.div>

          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Progreso
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {completedLessons} de {totalLessons} lecciones
            </div>
          </div>
        </div>

        {/* Completed badge */}
        {percentage === 100 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center gap-2 text-green-600 dark:text-green-400"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="text-sm font-semibold">¡Completado!</span>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
