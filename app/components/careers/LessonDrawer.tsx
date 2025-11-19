'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, CheckCircle2 } from 'lucide-react'
import { Lesson } from '@/types/modules'

interface LessonDrawerProps {
  lessons: Lesson[]
  currentLessonId: string
  completedLessonIds: string[]
  onSelectLesson: (lessonId: string) => void
}

export function LessonDrawer({
  lessons,
  currentLessonId,
  completedLessonIds,
  onSelectLesson,
}: LessonDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectLesson = (lessonId: string) => {
    onSelectLesson(lessonId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-20 right-4 z-40 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        aria-label="Abrir menú de lecciones"
        aria-expanded={isOpen}
      >
        <Menu size={24} />
      </button>

      {/* Drawer overlay and content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 h-screen w-64 z-50 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  aria-label="Cerrar"
                >
                  <X size={24} />
                </button>

                <h2 className="text-lg font-bold mb-6 mt-8">Lecciones</h2>

                <nav className="space-y-2">
                  {lessons.map((lesson) => {
                    const isCompleted = completedLessonIds.includes(lesson.id)
                    const isCurrent = currentLessonId === lesson.id

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        <div className="flex items-start gap-3">
                          {isCompleted && (
                            <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lesson.title}
                            </p>
                            {lesson.estimated_duration_minutes && (
                              <p
                                className={`text-xs mt-1 ${
                                  isCurrent ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {lesson.estimated_duration_minutes} min
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
