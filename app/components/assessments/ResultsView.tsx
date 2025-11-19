'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, RefreshCw, Award } from 'lucide-react'

interface ResultsViewProps {
  score: number
  totalQuestions: number
  passingScore: number
  passed: boolean
  onComplete?: () => void
}

export default function ResultsView({
  score,
  totalQuestions,
  passingScore,
  passed,
  onComplete
}: ResultsViewProps) {
  const correctAnswers = Math.round((score / 100) * totalQuestions)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700"
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          {passed ? (
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-2xl sm:text-3xl font-bold text-center mb-2 ${
            passed
              ? 'text-green-600 dark:text-green-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}
        >
          {passed ? '¡Aprobado!' : 'Intenta de nuevo'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 text-center mb-6"
        >
          {passed
            ? 'Felicidades, superaste la evaluación.'
            : 'No alcanzaste la puntuación mínima. Revisa el material e intenta nuevamente.'}
        </motion.p>

        {/* Score display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
              Puntuación
            </span>
          </div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {score}%
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {correctAnswers} de {totalQuestions} respuestas correctas
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Mínimo requerido: {passingScore}%
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${
                passed
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : 'bg-gradient-to-r from-orange-400 to-orange-500'
              }`}
            />
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          {!passed && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all ${
              passed
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            {passed ? 'Continuar' : 'Cerrar'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
