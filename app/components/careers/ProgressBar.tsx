'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  completed: number
  total: number
  showText?: boolean
  showPercentage?: boolean
}

export function ProgressBar({
  completed,
  total,
  showText = true,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-label="Progreso de lecciones"
        />
      </div>
      {showText && (
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {completed} de {total} completadas
          </span>
          {showPercentage && (
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {percentage}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
