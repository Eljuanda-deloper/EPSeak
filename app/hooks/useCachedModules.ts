'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import type { Module, Lesson, StudentProgress } from '@/app/hooks/useModules'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

class ModulesCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION_MS
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
}

const modulesCache = new ModulesCache()

interface UseCachedModulesReturn {
  modules: Module[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCachedModules(userId: string | undefined): UseCachedModulesReturn {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const cacheKey = `modules_${userId}`

  const fetchModules = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Check cache first
    const cachedModules = modulesCache.get<Module[]>(cacheKey)
    if (cachedModules) {
      setModules(cachedModules)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

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

      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('lesson_id, completed_at, time_spent_minutes, score')
        .eq('student_id', userId)

      if (progressError) throw progressError

      const processedModules: Module[] = modulesData.map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        area_of_interest: module.area_of_interest,
        order_index: module.order_index,
        is_unlocked: module.student_modules?.[0]?.is_unlocked ?? true,
        completion_percentage: module.student_modules?.[0]?.completion_percentage ?? 0,
        prerequisites: module.prerequisites || [],
        lessons: module.lessons || [],
        created_at: module.created_at,
        updated_at: module.updated_at,
      }))

      // Store in cache
      modulesCache.set(cacheKey, processedModules)
      setModules(processedModules)
    } catch (err) {
      console.error('Error fetching modules:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar módulos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [userId])

  const refetch = async () => {
    modulesCache.clear(cacheKey)
    await fetchModules()
  }

  return { modules, loading, error, refetch }
}
