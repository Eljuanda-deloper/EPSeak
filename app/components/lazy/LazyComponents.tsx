'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { Skeleton } from '@/app/components/ui/Skeleton'

/**
 * Componentes renderizados dinámicamente para mejorar performance
 * Solo se cargan cuando se necesitan
 */

// Lazy load TextRenderer
export const LazyTextRenderer = lazy(() =>
  import('@/app/components/renderers/TextRenderer').then(mod => ({
    default: mod.TextRenderer
  }))
)

// Lazy load VideoPlayer
export const LazyVideoPlayer = lazy(() =>
  import('@/app/components/renderers/VideoPlayer')
)

// Lazy load AssessmentView
export const LazyAssessmentView = lazy(() =>
  import('@/app/components/assessments/AssessmentView')
)

// Lazy load ModuleCompletionModal
export const LazyModuleCompletionModal = lazy(() =>
  import('@/app/components/modules/ModuleCompletionModal')
)

/**
 * Wrapper component para lazy loading con fallback
 */
interface LazyComponentWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyComponentWrapper({
  children,
  fallback = <Skeleton className="w-full h-96" />,
}: LazyComponentWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
