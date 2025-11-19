'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LessonWithProgress } from '@/types/lesson'

interface LessonHeaderProps {
  lesson: LessonWithProgress
  previousLesson?: LessonWithProgress | null
  nextLesson?: LessonWithProgress | null
  moduleId: string
  lessonIndex: number
  totalLessons: number
}

export function LessonHeader({
  lesson,
  previousLesson,
  nextLesson,
  moduleId,
  lessonIndex,
  totalLessons,
}: LessonHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      {/* Title and progress */}
      <div>
        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Lección {lessonIndex + 1} de {totalLessons}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {lesson.lesson.title}
        </h1>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        {previousLesson ? (
          <Link href={`/modules/${moduleId}/lessons/${previousLesson.lesson.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Anterior</span>
            </motion.button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/modules/${moduleId}/lessons/${nextLesson.lesson.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              <span className="text-sm font-medium">Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  )
}
