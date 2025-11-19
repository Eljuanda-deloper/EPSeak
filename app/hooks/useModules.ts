'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

export interface Module {
  id: string
  title: string
  description: string
  area_of_interest: string
  order_index: number
  is_unlocked: boolean
  completion_percentage: number
  prerequisites: string[]
  lessons: Lesson[]
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content: string
  video_url?: string
  duration_minutes: number
  order_index: number
  completed: boolean
  created_at: string
  updated_at: string
}

export interface StudentProgress {
  id: string
  student_id: string
  lesson_id: string
  completed_at: string
  time_spent_minutes: number
  score: number
  attempts: number
  notes?: string
}

export interface StudentModule {
  id: string
  student_id: string
  module_id: string
  enrolled_at: string
  completion_percentage: number
  is_unlocked: boolean
  unlocked_at?: string
  last_accessed_at?: string
}

export function useModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchModules = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch modules with lessons and student modules (but not student_progress directly)
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (*),
          student_modules (
            completion_percentage,
            is_unlocked,
            unlocked_at,
            last_accessed_at
          )
        `)
        .eq('is_active', true)
        .order('order_index')

      if (modulesError) throw modulesError

      // Fetch student progress separately - filtered by authenticated user
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('lesson_id, completed_at, time_spent_minutes, score')
        .eq('student_id', user.id)

      if (progressError) throw progressError

      // Process the data to determine unlock status and completion
      const processedModules: Module[] = modulesData.map((module: any) => {
        const studentModule = module.student_modules?.[0]
        const studentProgress = progressData?.filter((sp: any) =>
          module.lessons?.some((lesson: any) => lesson.id === sp.lesson_id)
        ) || []

        // Calculate completion percentage based on completed lessons
        const totalLessons = module.lessons?.length || 0
        const completedLessons = studentProgress.length
        const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

        // Determine if module is unlocked
        let isUnlocked = false
        if (module.order_index === 1) {
          // First module is always unlocked
          isUnlocked = true
        } else if (studentModule?.is_unlocked) {
          // Explicitly unlocked
          isUnlocked = true
        } else {
          // Check if prerequisites are completed
          const prerequisites = module.prerequisites || []
          if (prerequisites.length === 0) {
            isUnlocked = true
          } else {
            // Check if all prerequisite modules are completed
            const prerequisiteModules = modulesData.filter((m: any) =>
              prerequisites.includes(m.id)
            )
            isUnlocked = prerequisiteModules.every((prereq: any) => {
              const prereqProgress = prereq.student_progress || []
              const prereqTotalLessons = prereq.lessons?.length || 0
              const prereqCompletedLessons = prereqProgress.length
              return prereqTotalLessons > 0 && prereqCompletedLessons >= prereqTotalLessons
            })
          }
        }

        // Process lessons with completion status
        const processedLessons: Lesson[] = (module.lessons || []).map((lesson: any) => ({
          ...lesson,
          completed: studentProgress.some((sp: any) => sp.lesson_id === lesson.id)
        })).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)

        return {
          id: module.id,
          title: module.title,
          description: module.description,
          area_of_interest: module.area_of_interest,
          order_index: module.order_index,
          is_unlocked: isUnlocked,
          completion_percentage: completionPercentage,
          prerequisites: module.prerequisites || [],
          lessons: processedLessons,
          created_at: module.created_at,
          updated_at: module.updated_at
        }
      })

      setModules(processedModules)
    } catch (err) {
      console.error('Error fetching modules:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar módulos')
    } finally {
      setLoading(false)
    }
  }

  const filterModules = (searchTerm: string, areaFilter: string, levelFilter: string) => {
    return modules.filter(module => {
      const matchesSearch = !searchTerm ||
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesArea = !areaFilter || module.area_of_interest === areaFilter

      // For now, we'll skip level filtering as we don't have level data in the schema
      const matchesLevel = !levelFilter || true

      return matchesSearch && matchesArea && matchesLevel
    })
  }

  const updateModuleProgress = async (moduleId: string, lessonId: string, progress: Partial<StudentProgress>) => {
    if (!user) return

    try {
      // Update or insert student progress
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user.id,
          lesson_id: lessonId,
          ...progress
        }, {
          onConflict: 'student_id,lesson_id'
        })

      if (error) throw error

      // Refresh modules data
      await fetchModules()
    } catch (err) {
      console.error('Error updating progress:', err)
      throw err
    }
  }

  const unlockModule = async (moduleId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('student_modules')
        .upsert({
          student_id: user.id,
          module_id: moduleId,
          is_unlocked: true,
          unlocked_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,module_id'
        })

      if (error) throw error

      // Insert unlock event
      await supabase
        .from('module_unlock_events')
        .insert({
          student_id: user.id,
          module_id: moduleId,
          unlocked_by_completion: true,
          unlocked_at: new Date().toISOString()
        })

      // Refresh modules data
      await fetchModules()
    } catch (err) {
      console.error('Error unlocking module:', err)
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchModules()
    }
  }, [user])

  return {
    modules,
    loading,
    error,
    filterModules,
    updateModuleProgress,
    unlockModule,
    refetch: fetchModules
  }
}