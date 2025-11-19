'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/app/hooks/useToast'

interface UseLessonProgressOptions {
  lessonId: string
  careerSlug: string
  moduleId: string
}

export function useLessonProgress({
  lessonId,
  careerSlug,
  moduleId,
}: UseLessonProgressOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const { addToast } = useToast()

  const markAsComplete = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/careers/${careerSlug}/modules/${moduleId}/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ time_spent_seconds: timeSpent }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to mark lesson as complete')
      }

      const data = await response.json()
      setIsCompleted(true)
      addToast({
        type: 'success',
        message: '✓ Lección completada',
        duration: 3000,
      })

      return data
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      addToast({
        type: 'error',
        message: 'Error al completar la lección',
        duration: 3000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [lessonId, careerSlug, moduleId, timeSpent, addToast])

  const updateTimeSpent = useCallback((seconds: number) => {
    setTimeSpent(seconds)
  }, [])

  return {
    isCompleted,
    isLoading,
    timeSpent,
    markAsComplete,
    updateTimeSpent,
  }
}
