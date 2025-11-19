'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LessonNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
  onComplete?: () => void
  isPreviousDisabled?: boolean
  isNextDisabled?: boolean
  isLastLesson?: boolean
  isLoading?: boolean
}

export function LessonNavigation({
  onPrevious,
  onNext,
  onComplete,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isLastLesson = false,
  isLoading = false,
}: LessonNavigationProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !isPreviousDisabled && onPrevious) {
        onPrevious()
      }
      if (e.key === 'ArrowRight' && !isNextDisabled && onNext) {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviousDisabled, isNextDisabled, onPrevious, onNext])

  return (
    <div className="flex gap-4 justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <motion.button
        whileHover={!isPreviousDisabled ? { x: -4 } : {}}
        whileTap={!isPreviousDisabled ? { x: -2 } : {}}
        onClick={onPrevious}
        disabled={isPreviousDisabled || isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        aria-label="Lección anterior (Flecha Izquierda)"
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Anterior</span>
      </motion.button>

      <div className="flex-1 flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Usa <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">←</kbd> y <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">→</kbd>
        </p>
      </div>

      <motion.button
        whileHover={!isNextDisabled ? { x: 4 } : {}}
        whileTap={!isNextDisabled ? { x: 2 } : {}}
        onClick={isLastLesson ? onComplete : onNext}
        disabled={isNextDisabled || isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isLastLesson
            ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
        }`}
        aria-label={isLastLesson ? 'Completar módulo' : 'Siguiente lección (Flecha Derecha)'}
      >
        <span className="hidden sm:inline">{isLastLesson ? 'Completar' : 'Siguiente'}</span>
        <ChevronRight size={20} />
      </motion.button>
    </div>
  )
}
