'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLessonProgress } from '@/app/hooks/useLessonProgress'

interface CompleteButtonProps {
  lessonId: string
  careerSlug: string
  moduleId: string
  isCompleted?: boolean
  onComplete?: () => void
  className?: string
}

export function CompleteButton({
  lessonId,
  careerSlug,
  moduleId,
  isCompleted = false,
  onComplete,
  className = '',
}: CompleteButtonProps) {
  const { isLoading, markAsComplete } = useLessonProgress({
    lessonId,
    careerSlug,
    moduleId,
  })

  const [isLocalCompleted, setIsLocalCompleted] = React.useState(isCompleted)

  const handleClick = async () => {
    try {
      await markAsComplete()
      setIsLocalCompleted(true)
      onComplete?.()
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLocalCompleted || isLoading}
      whileHover={!isLocalCompleted && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLocalCompleted && !isLoading ? { scale: 0.95 } : {}}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-lg font-medium
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isLocalCompleted
            ? 'bg-green-600 dark:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
        }
        ${className}
      `}
      aria-label={isLocalCompleted ? 'Lección completada' : 'Marcar como completada'}
      aria-disabled={isLocalCompleted || isLoading}
    >
      {isLocalCompleted ? (
        <>
          <Check size={20} />
          <span>Completada</span>
        </>
      ) : isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          <span>Guardando...</span>
        </>
      ) : (
        <>
          <Check size={20} />
          <span>Completar lección</span>
        </>
      )}
    </motion.button>
  )
}
