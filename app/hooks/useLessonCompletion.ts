'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface LessonCompletionState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export function useLessonCompletion() {
  const [state, setState] = useState<LessonCompletionState>({
    isLoading: false,
    error: null,
    success: false
  })

  const completeLesson = useCallback(
    async (lessonId: string, moduleId: string, timeSpent: number = 0) => {
      setState({ isLoading: true, error: null, success: false })

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )

        // Get current user
        const {
          data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('User not authenticated')
        }

        // Call API endpoint
        const response = await fetch(`/api/lessons/${lessonId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: user.id,
            moduleId,
            timeSpent,
            completedAt: new Date().toISOString()
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to complete lesson')
        }

        setState({
          isLoading: false,
          error: null,
          success: true
        })

        return await response.json()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error completing lesson'
        setState({
          isLoading: false,
          error: errorMessage,
          success: false
        })
        throw err
      }
    },
    []
  )

  return {
    completeLesson,
    isLoading: state.isLoading,
    error: state.error,
    success: state.success
  }
}
