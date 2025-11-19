/**
 * Utilidades de optimización de performance
 */

import React from 'react'
import { performanceMonitor } from './monitoring'

// Lazy loading para componentes
export const lazyLoad = (importFunc: () => Promise<any>, fallback?: React.ComponentType) => {
  return React.lazy(importFunc)
}

// Caching básico para datos
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

export const dataCache = new SimpleCache()

// Debounce para optimizar llamadas a API
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle para controlar frecuencia de ejecución
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memoización básica
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Optimización de imágenes
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  height?: number,
  quality: number = 80
): string => {
  // Para implementación real, usar un servicio como Cloudinary, Imgix, etc.
  // Por ahora, retornamos la URL original
  return src
}

// Preload de recursos críticos
export const preloadCriticalResources = () => {
  // Preload de fuentes críticas
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.href = '/fonts/poppins.woff2'
  fontLink.as = 'font'
  fontLink.type = 'font/woff2'
  fontLink.crossOrigin = 'anonymous'
  document.head.appendChild(fontLink)

  // Preload de componentes críticos
  // Esto se haría con React.lazy y Suspense
}

// Optimización de bundle splitting
export const loadable = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc)
}

// Service Worker básico para caching (implementación mínima)
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', registration)
    } catch (error) {
      console.log('SW registration failed:', error)
    }
  }
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Para medidas personalizadas, usar startTime y duration
        if ('duration' in entry) {
          performanceMonitor.captureMetric(
            entry.name.toLowerCase(),
            (entry as any).duration || 0,
            window.location.href
          )
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['measure'] })
    } catch (e) {
      // Fallback para navegadores que no soportan entryTypes
    }
  }
}

// Optimización de re-renders con React.memo
export const optimizedMemo = React.memo

// Hook personalizado para performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const startTime = Date.now()

    return () => {
      const duration = Date.now() - startTime
      performanceMonitor.captureMetric(
        `component_render_time_${componentName}`,
        duration
      )
    }
  }, [componentName])
}

// Virtual scrolling básico (para listas grandes)
export const useVirtualScroll = (
  itemHeight: number,
  containerHeight: number,
  items: any[],
  scrollTop: number
) => {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    offsetY,
    startIndex,
    endIndex
  }
}

// Code splitting con dynamic imports
export const dynamicImport = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc)
}

// Preload de rutas críticas
export const preloadRoute = (route: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  }
}

// Optimización de API calls con SWR-like caching
export const apiCache = new SimpleCache()

// Función para medir tiempo de ejecución
export const measureExecutionTime = async <T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> => {
  const start = Date.now()
  try {
    const result = await fn()
    const duration = Date.now() - start
    performanceMonitor.captureMetric(`execution_time_${label}`, duration)
    return result
  } catch (error) {
    const duration = Date.now() - start
    performanceMonitor.captureMetric(`execution_time_${label}_error`, duration)
    throw error
  }
}