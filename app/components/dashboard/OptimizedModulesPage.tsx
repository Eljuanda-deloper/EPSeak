'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import OptimizedModulesList from '@/app/components/dashboard/OptimizedModulesList'
import { Skeleton } from '@/app/components/ui/Skeleton'

export interface Module {
  id: string
  title: string
  description: string
  completion_percentage: number
  is_unlocked: boolean
  area_of_interest: string
  lessons: Array<{ id: string }>
}

export default function OptimizedModulesPage() {
  const { user, loading: authLoading } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !user) return

    const fetchModules = async () => {
      try {
        setLoading(true)
        setError(null)

        // Usar endpoint optimizado con caché
        const response = await fetch('/api/modules/cached', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch modules: ${response.status}`)
        }

        const data = await response.json()
        setModules(data)
      } catch (err) {
        console.error('Error fetching modules:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar módulos')
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-12 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Módulos</h1>
        <p className="text-gray-600 mt-1">
          {modules.length} módulos disponibles
        </p>
      </div>

      {/* Content */}
      {error && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Error al cargar módulos</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <OptimizedModulesList
        modules={modules}
        isLoading={loading}
      />

      {!loading && modules.length === 0 && !error && (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <p>No hay módulos disponibles</p>
        </div>
      )}
    </div>
  )
}
