/**
 * Sistema de monitoreo de errores y performance
 */

interface ErrorReport {
  timestamp: string
  error: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  sessionId?: string
  additionalData?: Record<string, any>
}

interface PerformanceMetric {
  timestamp: string
  name: string
  value: number
  url: string
  userId?: string
}

class ErrorMonitor {
  private errors: ErrorReport[] = []
  private maxErrors: number = 50
  private isProduction: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.setupGlobalErrorHandlers()
  }

  private setupGlobalErrorHandlers() {
    // Solo configurar handlers si estamos en el navegador
    if (typeof window === 'undefined') return

    // Manejador de errores no capturados
    window.addEventListener('error', (event) => {
      this.captureError({
        error: event.error?.message || event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Manejador de promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        error: `Unhandled Promise Rejection: ${event.reason}`,
        url: window.location.href,
        userAgent: navigator.userAgent,
        additionalData: {
          reason: event.reason
        }
      })
    })
  }

  captureError(report: Omit<ErrorReport, 'timestamp'>) {
    const errorReport: ErrorReport = {
      ...report,
      timestamp: new Date().toISOString()
    }

    // Mantener solo los errores más recientes
    this.errors.push(errorReport)
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // En desarrollo, mostrar en consola (solo si window existe)
    if (!this.isProduction && typeof window !== 'undefined') {
      console.error('[ERROR MONITOR]', errorReport)
    }

    // En producción, enviar a servicio de monitoreo
    if (this.isProduction) {
      this.sendErrorReport(errorReport)
    }
  }

  // Enviar reporte de error a servicio externo
  private async sendErrorReport(report: ErrorReport) {
    try {
      // En una implementación real, esto enviaría a Sentry, LogRocket, etc.
      // Por ahora, almacenamos localmente para debugging (solo en navegador)
      if (typeof window !== 'undefined' && window.localStorage) {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
        errors.push(report)

        // Mantener solo los últimos 50 errores
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50)
        }

        localStorage.setItem('app_errors', JSON.stringify(errors))
      }
    } catch (error) {
      // Fallback silencioso si localStorage falla
      if (typeof console !== 'undefined') {
        console.warn('Failed to store error report:', error)
      }
    }
  }

  getErrors(): ErrorReport[] {
    if (this.isProduction) return []
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
    if (!this.isProduction && typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('app_errors')
    }
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics: number = 100
  private isProduction: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.setupPerformanceObservers()
  }

  private setupPerformanceObservers() {
    // Solo configurar si estamos en el navegador
    if (typeof window === 'undefined') return

    // Monitorear Core Web Vitals
    if ('web-vitals' in window) {
      // En una implementación real, importaríamos web-vitals
      // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
    }

    // Monitorear navegación
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        this.captureMetric('navigation_timing', navigation.loadEventEnd - navigation.fetchStart, window.location.href)
      }
    }
  }

  captureMetric(name: string, value: number, url: string = (typeof window !== 'undefined' ? window.location.href : ''), userId?: string) {
    const metric: PerformanceMetric = {
      timestamp: new Date().toISOString(),
      name,
      value,
      url,
      userId
    }

    this.metrics.push(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // En desarrollo, mostrar en consola
    if (!this.isProduction) {
      console.log(`[PERFORMANCE] ${name}: ${value}ms`)
    }

    // En producción, enviar métricas
    if (this.isProduction) {
      this.sendMetric(metric)
    }
  }

  private async sendMetric(metric: PerformanceMetric) {
    try {
      // En una implementación real, enviar a analytics service
      // Solo almacenar si estamos en navegador
      if (typeof window !== 'undefined' && window.localStorage) {
        const metrics = JSON.parse(localStorage.getItem('app_metrics') || '[]')
        metrics.push(metric)

        if (metrics.length > 100) {
          metrics.splice(0, metrics.length - 100)
        }

        localStorage.setItem('app_metrics', JSON.stringify(metrics))
      }
    } catch (error) {
      if (typeof console !== 'undefined') {
        console.warn('Failed to store metric:', error)
      }
    }
  }

  // Métodos convenientes para métricas comunes
  measurePageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window && 'timing' in performance) {
      const timing = performance.timing
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart
      this.captureMetric('page_load_time', pageLoadTime)
    }
  }

  measureApiCall(endpoint: string, startTime: number) {
    const duration = Date.now() - startTime
    this.captureMetric('api_call_duration', duration, endpoint)
  }

  getMetrics(): PerformanceMetric[] {
    if (this.isProduction) return []
    return [...this.metrics]
  }

  clearMetrics() {
    this.metrics = []
    if (!this.isProduction && typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('app_metrics')
    }
  }
}

// Instancias globales
export const errorMonitor = new ErrorMonitor()
export const performanceMonitor = new PerformanceMonitor()

// Funciones de conveniencia
export const reportError = (error: Error | string, additionalData?: Record<string, any>) => {
  errorMonitor.captureError({
    error: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'object' ? error.stack : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    additionalData
  })
}

export const measurePerformance = (name: string, fn: () => void) => {
  const start = Date.now()
  fn()
  const duration = Date.now() - start
  performanceMonitor.captureMetric(name, duration)
}

// HOC para monitorear componentes (comentado por simplicidad)
/*
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ErrorBoundaryWrapper(props: P) {
    try {
      return React.createElement(Component, props)
    } catch (error) {
      reportError(error as Error, { component: Component.name })
      // Retornar componente de error simple
      return React.createElement('div', { className: 'error-boundary' },
        React.createElement('h2', null, 'Algo salió mal'),
        React.createElement('p', null, 'Por favor, recarga la página e intenta de nuevo.')
      )
    }
  }
}
*/