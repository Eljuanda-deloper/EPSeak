'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useCompleteLesson } from '@/app/hooks/useAssessment'

interface CompleteButtonProps {
  lessonId: string
  isCompleted: boolean
  onComplete?: () => void
  timeSpentMinutes?: number
  className?: string
}

export function CompleteButton({
  lessonId,
  isCompleted,
  onComplete,
  timeSpentMinutes = 0,
  className = '',
}: CompleteButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const { completeLesson, loading } = useCompleteLesson()

  const handleClick = async () => {
    try {
      await completeLesson(lessonId, timeSpentMinutes)
      setShowSuccess(true)
      onComplete?.()

      // Reset success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  if (isCompleted && !showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ${className}`}
      >
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Completado</span>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: !loading ? 1.05 : 1 }}
      whileTap={{ scale: !loading ? 0.95 : 1 }}
      className={`
        flex items-center justify-center gap-2 px-4 py-2
        rounded-lg font-medium transition-colors
        ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}
        ${showSuccess
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : showSuccess ? (
        <CheckCircle className="w-5 h-5" />
      ) : null}
      <span>
        {loading
          ? 'Guardando...'
          : showSuccess
            ? '¡Lección completada!'
            : 'Marcar como completada'}
      </span>
    </motion.button>
  )
}
