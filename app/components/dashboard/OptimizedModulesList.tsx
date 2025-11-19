'use client'

import { Suspense, lazy, useMemo } from 'react'
import { Skeleton } from '@/app/components/ui/Skeleton'

// Lazy load OptimizedModuleCard - improves initial bundle size
const OptimizedModuleCard = lazy(() =>
  import('@/app/components/dashboard/OptimizedModuleCard').then(mod => ({
    default: mod.default
  }))
)

interface Module {
  id: string
  title: string
  description: string
  completion_percentage: number
  is_unlocked: boolean
  area_of_interest: string
  lessons?: Array<{ id: string }>
}

interface OptimizedModulesListProps {
  modules: Module[]
  isLoading?: boolean
}

export default function OptimizedModulesList({
  modules,
  isLoading = false,
}: OptimizedModulesListProps) {
  // Memoize the modules to prevent unnecessary re-renders
  const memoizedModules = useMemo(() => modules, [modules])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {memoizedModules.map((module) => (
        <Suspense
          key={module.id}
          fallback={<Skeleton className="h-96 rounded-lg" />}
        >
          <OptimizedModuleCard
            id={module.id}
            title={module.title}
            description={module.description}
            completionPercentage={module.completion_percentage}
            isUnlocked={module.is_unlocked}
            areaOfInterest={module.area_of_interest}
            lessonsCount={module.lessons?.length || 0}
          />
        </Suspense>
      ))}
    </div>
  )
}
