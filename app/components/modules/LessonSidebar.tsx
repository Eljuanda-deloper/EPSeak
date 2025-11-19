'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import type { LessonWithProgress } from '@/types/lesson'

interface LessonSidebarProps {
  lessons: LessonWithProgress[]
  currentLessonId?: string
  moduleId: string
  className?: string
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  moduleId,
  className = '',
}: LessonSidebarProps) {
  return (
    <nav className={`flex flex-col gap-2 ${className}`}>
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.lesson.id}
          href={`/modules/${moduleId}/lessons/${lesson.lesson.id}`}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-start gap-3 p-3 rounded-lg
              transition-colors group
              ${
                currentLessonId === lesson.lesson.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <div className="mt-1">
              {lesson.is_completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {index + 1}. {lesson.lesson.title}
              </div>
              {lesson.lesson.duration_minutes && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lesson.lesson.duration_minutes} min
                </div>
              )}
            </div>

            {lesson.is_completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs font-semibold text-green-600 dark:text-green-400 flex-shrink-0"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        </Link>
      ))}
    </nav>
  )
}
