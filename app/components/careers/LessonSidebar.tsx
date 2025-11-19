'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Lesson } from '@/types/modules'

interface LessonSidebarProps {
  lessons: Lesson[]
  currentLessonId: string
  completedLessonIds: string[]
  onSelectLesson: (lessonId: string) => void
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  completedLessonIds,
  onSelectLesson,
}: LessonSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-fit sticky top-20">
      <h2 className="text-lg font-bold mb-4">Lecciones</h2>
      <nav className="space-y-2">
        {lessons.map((lesson) => {
          const isCompleted = completedLessonIds.includes(lesson.id)
          const isCurrent = currentLessonId === lesson.id

          return (
            <motion.button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              aria-label={`Lección: ${lesson.title}${isCompleted ? ' (completada)' : ''}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <div className="flex items-start gap-3">
                {isCompleted && (
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{lesson.title}</p>
                  {lesson.estimated_duration_minutes && (
                    <p className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
                      {lesson.estimated_duration_minutes} min
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </nav>
    </aside>
  )
}
