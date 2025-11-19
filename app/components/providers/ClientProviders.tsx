'use client'

import { AuthProvider } from '@/app/contexts/AuthContext'
import { MotionConfig } from 'framer-motion'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>{children}</AuthProvider>
    </MotionConfig>
  )
}