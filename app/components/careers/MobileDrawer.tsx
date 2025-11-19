'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  order_index: number
}

interface MobileDrawerProps {
  lessons: Lesson[]
  activeLesson: string
  onSelectLesson: (lessonId: string) => void
  completedLessonIds?: string[]
}

/**
 * Mobile drawer component for lesson navigation
 * Shows as hamburger menu icon on mobile (< lg), slides from left with backdrop
 * Uses Framer Motion for smooth animations
 */
export default function MobileDrawer({
  lessons,
  activeLesson,
  onSelectLesson,
  completedLessonIds = [],
}: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectLesson = (lessonId: string) => {
    onSelectLesson(lessonId)
    setIsOpen(false) // Close drawer after selection
  }

  return (
    <>
      {/* Hamburger button - only visible on mobile (< lg) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-shadow"
        aria-label="Open lesson menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-900 dark:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
        )}
      </button>

      {/* Backdrop - click to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer container - slides from left */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl z-40 overflow-y-auto lg:hidden"
            role="navigation"
            aria-label="Lesson menu"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Lecciones
              </h2>
            </div>

            {/* Lessons list */}
            <nav className="px-4 py-2 space-y-1">
              {lessons && lessons.length > 0 ? (
                lessons.map((lesson) => {
                  const isActive = lesson.id === activeLesson
                  const isCompleted = completedLessonIds.includes(lesson.id)

                  return (
                    <motion.button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Completion indicator */}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCompleted
                          ? isActive
                            ? 'bg-white text-blue-500'
                            : 'bg-green-500 text-white'
                          : isActive
                          ? 'border-2 border-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}>
                        {isCompleted && '✓'}
                      </div>
                      <span className="block text-sm truncate">
                        {lesson.order_index + 1}. {lesson.title}
                      </span>
                    </motion.button>
                  )
                })
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm py-4">
                  No lessons available
                </p>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
