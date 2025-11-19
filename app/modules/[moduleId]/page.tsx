'use client'

import { useState, useEffect } from 'react'
import ModuleView from '@/app/components/modules/ModuleView'
import { ModuleLayoutWrapper } from '@/app/components/modules/ModuleLayoutWrapper'
import { TextRenderer } from '@/app/components/renderers/TextRenderer'
import { createClient } from '@supabase/supabase-js'

interface Lesson {
  id: string
  title: string
  order_index: number
  duration_minutes: number
  content: string
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export default function ModuleViewPage({ params }: { params: { moduleId: string } }) {
  const [module, setModule] = useState<Module | null>(null)
  const [currentLessonId, setCurrentLessonId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )

        // Fetch module
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', params.moduleId)
          .single()

        if (moduleError) throw moduleError

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', params.moduleId)
          .order('order_index', { ascending: true })

        if (lessonsError) throw lessonsError

        const formattedModule: Module = {
          id: moduleData.id,
          title: moduleData.title,
          description: moduleData.description,
          lessons: (lessonsData || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            order_index: lesson.order_index,
            duration_minutes: lesson.duration_minutes || 0,
            content: lesson.content || ''
          }))
        }

        setModule(formattedModule)
        setCurrentLessonId(formattedModule.lessons[0]?.id || '')
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading module'
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    fetchModuleData()
  }, [params.moduleId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando módulo...</p>
        </div>
      </div>
    )
  }

  if (error || !module) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Módulo no encontrado'}</p>
          <a href="/dashboard/modules" className="text-blue-600 dark:text-blue-400 hover:underline">
            Volver a módulos
          </a>
        </div>
      </div>
    )
  }

  const currentLesson = module.lessons.find(l => l.id === currentLessonId)

  return (
    <ModuleLayoutWrapper moduleId={module.id}>
      <ModuleView
        module={module}
        currentLessonId={currentLessonId}
        onLessonChange={setCurrentLessonId}
      >
        {currentLesson && currentLesson.content && (
          <TextRenderer content={currentLesson.content} />
        )}
      </ModuleView>
    </ModuleLayoutWrapper>
  )
}
