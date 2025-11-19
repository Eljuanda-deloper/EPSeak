'use client'

import { motion } from 'framer-motion'

interface AnswerOptionProps {
  option: string
  index: number
  isSelected: boolean
  onChange: () => void
}

export default function AnswerOption({
  option,
  index,
  isSelected,
  onChange
}: AnswerOptionProps) {
  return (
    <motion.button
      onClick={onChange}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {/* Radio button */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-500'
          : 'border-slate-300 dark:border-slate-600'
      }`}>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-white rounded-full"
          />
        )}
      </div>

      {/* Option text */}
      <span className={`text-base sm:text-lg font-medium ${
        isSelected
          ? 'text-blue-900 dark:text-blue-100'
          : 'text-slate-700 dark:text-slate-300'
      }`}>
        {String.fromCharCode(65 + index)}. {option}
      </span>
    </motion.button>
  )
}
