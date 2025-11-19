'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Award, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ModuleCompletionModalProps {
  isOpen: boolean
  moduleName: string
  totalLessons: number
  timeSpent?: number
  onClose: () => void
  onNextModule?: () => void
}

export function ModuleCompletionModal({
  isOpen,
  moduleName,
  totalLessons,
  timeSpent = 0,
  onClose,
  onNextModule
}: ModuleCompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Trigger confetti animation
      triggerConfetti()
    }
  }, [isOpen])

  const triggerConfetti = () => {
    if (typeof window === 'undefined') return

    // Fallback confetti implementation using CSS
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5
    }))

    return confettiPieces
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 sm:p-8 text-center"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {/* Confetti Animation */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10px'
                      }}
                      animate={{
                        y: 400,
                        opacity: [1, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: Math.random() * 0.3,
                        ease: 'easeIn'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Icon */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              {/* Content */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                ¡Felicidades!
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Completaste el módulo
                <span className="font-bold text-blue-600 dark:text-blue-400 block mt-1">
                  {moduleName}
                </span>
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 gap-4 mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Lecciones completadas
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalLessons}
                  </p>
                </div>

                {timeSpent > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Tiempo dedicado
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatTime(timeSpent)}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {onNextModule && (
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNextModule}
                  >
                    Siguiente módulo
                  </motion.button>
                )}

                <motion.button
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  <RotateCcw className="w-5 h-5" />
                  Revisar módulo
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
