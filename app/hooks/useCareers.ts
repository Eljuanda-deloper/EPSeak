'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'

export interface CareerModule {
  id: string
  title: string
  description: string
  area: string
  level: string
  duration_hours: number
  total_lessons: number
  order_index: number
  is_unlocked?: boolean
  completion_percentage?: number
}

export interface CareerPath {
  id: string
  title: string
  description: string
  icon: string
  target_role: string
  total_duration_hours: number
  created_at: string
  modules?: CareerModule[]
}

export function useCareers() {
  const [careers, setCareers] = useState<CareerPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCareers = async () => {
    try {
      setLoading(true)
      setError(null)

      // First get all careers
      const { data: careersData, error: careersError } = await supabase
        .from('career_paths')
        .select('*')
        .order('created_at', { ascending: false })

      if (careersError) throw careersError

      // Then get modules for each career (assuming career title maps to module area)
      const careersWithModules = await Promise.all(
        (careersData || []).map(async (career) => {
          // Map career title to module areas (support multiple areas)
          const areas = []
          if (career.title.toLowerCase().includes('automation')) {
            areas.push('automation')
          }
          if (career.title.toLowerCase().includes('english')) {
            areas.push('english')
          }
          if (areas.length === 0) {
            areas.push('general')
          }

          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select(`
              id,
              title,
              description,
              area,
              level,
              duration_hours,
              total_lessons,
              order_index
            `)
            .in('area', areas)
            .eq('is_active', true)
            .order('order_index', { ascending: true })

          if (modulesError) {
            console.warn(`Error fetching modules for career ${career.title}:`, modulesError)
          }

          return {
            ...career,
            modules: modulesData || []
          }
        })
      )

      setCareers(careersWithModules)
    } catch (err) {
      console.error('Error fetching careers:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar carreras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCareers()
  }, [])

  return {
    careers,
    loading,
    error,
    refetch: fetchCareers
  }
}