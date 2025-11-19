'use client'

import { motion } from 'framer-motion'
import AnswerOption from '@/app/components/assessments/AnswerOption'

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false'
  options: string[]
  correct_answer: number
  explanation?: string
}

interface QuestionCardProps {
  question: Question
  selectedAnswer: number | null
  onAnswerSelect: (optionIndex: number) => void
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-700"
    >
      {/* Question text */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {question.text}
      </h2>

      {/* Question type indicator */}
      <div className="mb-6 inline-block">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
          {question.type === 'true_false' ? 'Verdadero o Falso' : 'Opción Múltiple'}
        </span>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AnswerOption
              option={option}
              index={index}
              isSelected={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
