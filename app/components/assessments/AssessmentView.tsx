'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuestionCard from '@/app/components/assessments/QuestionCard'
import ResultsView from '@/app/components/assessments/ResultsView'
import Timer from '@/app/components/assessments/Timer'
import { createClient } from '@supabase/supabase-js'

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false'
  options: string[]
  correct_answer: number
  explanation?: string
}

interface AssessmentData {
  id: string
  title: string
  description?: string
  module_id: string
  passing_score: number
  time_limit_minutes?: number
  questions: Question[]
}

interface AssessmentViewProps {
  assessmentId: string
  moduleId: string
  onComplete?: (score: number, passed: boolean) => void
}

export default function AssessmentView({
  assessmentId,
  moduleId,
  onComplete
}: AssessmentViewProps) {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeExpired, setTimeExpired] = useState(false)

  // Load assessment
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )

        const { data, error: fetchError } = await supabase
          .from('assessments')
          .select(`
            id,
            title,
            description,
            module_id,
            passing_score,
            time_limit_minutes,
            assessment_questions (
              id,
              question_text,
              question_type,
              options,
              correct_answer_index,
              explanation
            )
          `)
          .eq('id', assessmentId)
          .single()

        if (fetchError) throw fetchError

        const formattedAssessment: AssessmentData = {
          id: data.id,
          title: data.title,
          description: data.description,
          module_id: data.module_id,
          passing_score: data.passing_score || 70,
          time_limit_minutes: data.time_limit_minutes,
          questions: (data.assessment_questions || []).map((q: any) => ({
            id: q.id,
            text: q.question_text,
            type: q.question_type,
            options: q.options,
            correct_answer: q.correct_answer_index,
            explanation: q.explanation
          }))
        }

        setAssessment(formattedAssessment)
        setAnswers(new Array(formattedAssessment.questions.length).fill(null))
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading assessment'
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando evaluación...</p>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Evaluación no encontrada'}</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const passed = score >= assessment.passing_score
    return (
      <ResultsView
        score={score}
        totalQuestions={assessment.questions.length}
        passingScore={assessment.passing_score}
        passed={passed}
        onComplete={() => {
          if (onComplete) onComplete(score, passed)
        }}
      />
    )
  }

  const currentQuestion = assessment.questions[currentQuestionIndex]
  const totalQuestions = assessment.questions.length
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0
    answers.forEach((answer, index) => {
      if (answer === assessment.questions[index].correct_answer) {
        correctCount++
      }
    })
    const finalScore = Math.round((correctCount / totalQuestions) * 100)
    setScore(finalScore)

    // Submit to API
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          answers,
          score: finalScore,
          timeExpired
        })
      })

      if (!response.ok) throw new Error('Failed to submit assessment')
    } catch (err) {
      console.error('Error submitting assessment:', err)
    }

    setShowResults(true)
  }

  const handleTimeExpired = () => {
    setTimeExpired(true)
    handleSubmit()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {assessment.title}
          </h1>
          {assessment.description && (
            <p className="text-slate-600 dark:text-slate-400">
              {assessment.description}
            </p>
          )}
        </motion.div>

        {/* Progress bar and timer */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>

          {/* Timer */}
          {assessment.time_limit_minutes && (
            <Timer
              minutes={assessment.time_limit_minutes}
              onTimeExpired={handleTimeExpired}
            />
          )}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentQuestionIndex === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Anterior
          </motion.button>

          <div className="flex-1" />

          {currentQuestionIndex === totalQuestions - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
            >
              Enviar Evaluación
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Siguiente
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
