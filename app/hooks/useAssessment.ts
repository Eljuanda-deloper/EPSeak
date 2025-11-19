import { useCallback, useState } from 'react'
import type { StudentAssessmentAnswer } from '@/types/assessment'

export function useCompleteLesson() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeLesson = useCallback(
    async (lessonId: string, timeSpentMinutes: number = 0) => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('sb-auth-token')
        if (!token) throw new Error('No autorizado')

        const res = await fetch(`/api/lessons/${lessonId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ time_spent_minutes: timeSpentMinutes }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Error al marcar lección')
        }

        const data = await res.json()
        return data.progress
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { completeLesson, loading, error }
}

export function useSubmitAssessment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitAssessment = useCallback(
    async (assessmentId: string, answers: StudentAssessmentAnswer[]) => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('sb-auth-token')
        if (!token) throw new Error('No autorizado')

        const res = await fetch(
          `/api/assessments/${assessmentId}/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ answers }),
          }
        )

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Error al enviar evaluación')
        }

        const data = await res.json()
        return data.result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { submitAssessment, loading, error }
}
