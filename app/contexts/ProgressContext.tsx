'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useProgress } from '@/app/hooks/useProgress'

interface ProgressContextType {
  completedLessons: string[]
  totalLessons: number
  progressPercentage: number
  isModuleComplete: boolean
  isLoading: boolean
  error: string | null
  moduleId: string
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

interface ProgressProviderProps {
  children: React.ReactNode
  moduleId: string
}

export function ProgressProvider({ children, moduleId }: ProgressProviderProps) {
  const progress = useProgress(moduleId)
  const [isModuleComplete, setIsModuleComplete] = useState(false)

  useEffect(() => {
    setIsModuleComplete(
      progress.progressPercentage === 100 && progress.totalLessons > 0
    )
  }, [progress.progressPercentage, progress.totalLessons])

  const value: ProgressContextType = {
    completedLessons: progress.completedLessons,
    totalLessons: progress.totalLessons,
    progressPercentage: progress.progressPercentage,
    isModuleComplete,
    isLoading: progress.isLoading,
    error: progress.error,
    moduleId
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgressContext() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgressContext must be used within ProgressProvider')
  }
  return context
}
