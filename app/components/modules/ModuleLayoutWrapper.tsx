'use client'

import { ProgressProvider } from '@/app/contexts/ProgressContext'

interface ModuleLayoutWrapperProps {
  children: React.ReactNode
  moduleId: string
}

export function ModuleLayoutWrapper({
  children,
  moduleId
}: ModuleLayoutWrapperProps) {
  return (
    <ProgressProvider moduleId={moduleId}>
      {children}
    </ProgressProvider>
  )
}
