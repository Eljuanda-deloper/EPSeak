'use client'

import { useCallback } from 'react'

export interface Toast {
  id?: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

// This is a simple implementation. In a real app, use a toast library
export function useToast() {
  const addToast = useCallback((toast: Toast) => {
    // Simple console logging for now
    console.log(`[${toast.type.toUpperCase()}] ${toast.message}`)
    
    // In production, you would dispatch to a toast context or use a library
  }, [])

  return { addToast }
}
