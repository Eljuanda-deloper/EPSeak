'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface ProgressData {
  completedLessons: string[]
  totalLessons: number
  progressPercentage: number
  currentLessonId?: string
  isLoading: boolean
  error: string | null
}

export function useProgress(moduleId: string) {
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: [],
    totalLessons: 0,
    progressPercentage: 0,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchProgress = async () => {
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
          setProgress(prev => ({
            ...prev,
            isLoading: false,
            error: 'User not authenticated'
          }))
          return
        }

        // Get all lessons in module
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', moduleId)

        if (lessonsError) throw lessonsError

        const totalLessons = lessons?.length || 0

        // Get completed lessons for this student
        const { data: completions, error: completionsError } = await supabase
          .from('student_lesson_progress')
          .select('lesson_id')
          .eq('student_id', user.id)
          .eq('module_id', moduleId)

        if (completionsError && completionsError.code !== 'PGRST116') {
          throw completionsError
        }

        const completedLessons = completions?.map(c => c.lesson_id) || []
        const progressPercentage = totalLessons > 0 
          ? Math.round((completedLessons.length / totalLessons) * 100)
          : 0

        setProgress({
          completedLessons,
          totalLessons,
          progressPercentage,
          isLoading: false,
          error: null
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching progress'
        setProgress(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
      }
    }

    if (moduleId) {
      fetchProgress()
    }
  }, [moduleId])

  return progress
}
