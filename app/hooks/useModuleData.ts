import { useCallback, useEffect, useState } from 'react'
import type { LessonWithProgress, ModuleWithProgress } from '@/types/lesson'
import type { Assessment } from '@/types/assessment'

export function useModuleData(moduleId: string | undefined) {
  const [module, setModule] = useState<ModuleWithProgress | null>(null)
  const [lessons, setLessons] = useState<LessonWithProgress[]>([])
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModule = useCallback(async () => {
    if (!moduleId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch module with lessons
      const moduleRes = await fetch(`/api/modules/${moduleId}`)
      if (!moduleRes.ok) throw new Error('Error al obtener módulo')

      const moduleData = await moduleRes.json()

      // Fetch progress
      const token = localStorage.getItem('sb-auth-token')
      const progressRes = await fetch(`/api/progress/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      let progress = {
        total_lessons: moduleData.module.lessons.length,
        completed_lessons: 0,
        completion_percentage: 0,
        lessons_progress: [],
      }

      if (progressRes.ok) {
        progress = await progressRes.json()
      }

      // Map lessons with progress
      const lessonsWithProgress: LessonWithProgress[] = 
        moduleData.module.lessons.map((lesson: any) => {
          const lessonProgress = progress.lessons_progress.find(
            (p: any) => p.lesson_id === lesson.id
          )
          return {
            lesson,
            progress: lessonProgress,
            is_completed: !!lessonProgress,
          }
        })

      setModule({
        module: moduleData.module,
        progress: {
          total_lessons: progress.total_lessons,
          completed_lessons: progress.completed_lessons,
          completion_percentage: progress.completion_percentage,
        },
      })

      setLessons(lessonsWithProgress)
      setAssessment(moduleData.module.assessment)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [moduleId])

  useEffect(() => {
    fetchModule()
  }, [fetchModule])

  return {
    module,
    lessons,
    assessment,
    loading,
    error,
    refetch: fetchModule,
  }
}

export function useLessonData(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/lessons/${lessonId}`)
      if (!res.ok) throw new Error('Error al obtener lección')

      const data = await res.json()
      setLesson(data.lesson)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  return {
    lesson,
    loading,
    error,
    refetch: fetchLesson,
  }
}
