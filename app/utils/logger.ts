/**
 * Sistema de logging seguro para actividades de usuario
 */

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'security'
  event: string
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  data?: Record<string, any>
  sessionId?: string
}

class SecureLogger {
  private logs: LogEntry[] = []
  private maxLogs: number = 1000
  private isProduction: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Remover información sensible
      return data.replace(/password|token|key/gi, '[REDACTED]')
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data }
      const sensitiveKeys = ['password', 'token', 'key', 'secret', 'apiKey']

      sensitiveKeys.forEach(key => {
        if (key in sanitized) {
          sanitized[key] = '[REDACTED]'
        }
      })

      return sanitized
    }

    return data
  }

  private getClientInfo(): { ip?: string; userAgent?: string } {
    if (typeof window === 'undefined') return {}

    return {
      ip: undefined, // No podemos obtener IP del cliente en frontend
      userAgent: navigator.userAgent
    }
  }

  log(entry: Omit<LogEntry, 'timestamp'>) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      ...this.getClientInfo()
    }

    // Sanitizar datos sensibles
    if (logEntry.data) {
      logEntry.data = this.sanitizeData(logEntry.data)
    }

    // Mantener solo los logs más recientes
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // En desarrollo, mostrar en consola
    if (!this.isProduction) {
      const logMethod = entry.level === 'security' ? console.warn : (console[entry.level as keyof Console] as any) || console.log
      logMethod(`[${entry.level.toUpperCase()}] ${entry.event}:`, {
        ...logEntry,
        data: logEntry.data
      })
    }

    // En producción, enviar a servicio de logging
    if (this.isProduction) {
      this.sendToLoggingService(logEntry)
    }
  }

  // Métodos convenientes para diferentes tipos de eventos
  auth(event: string, userId?: string, email?: string, data?: Record<string, any>) {
    this.log({
      level: 'info',
      event: `auth.${event}`,
      userId,
      email,
      data
    })
  }

  security(event: string, userId?: string, email?: string, data?: Record<string, any>) {
    this.log({
      level: 'security',
      event: `security.${event}`,
      userId,
      email,
      data
    })
  }

  error(event: string, error: Error | string, userId?: string, email?: string) {
    this.log({
      level: 'error',
      event: `error.${event}`,
      userId,
      email,
      data: {
        error: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'object' ? error.stack : undefined
      }
    })
  }

  warn(event: string, message: string, userId?: string, email?: string, data?: Record<string, any>) {
    this.log({
      level: 'warn',
      event: `warn.${event}`,
      userId,
      email,
      data: { message, ...data }
    })
  }

  // Enviar logs a servicio externo (implementación básica)
  private async sendToLoggingService(logEntry: LogEntry) {
    try {
      // En una implementación real, esto enviaría a un servicio como LogRocket, Sentry, etc.
      // Por ahora, solo almacenamos localmente
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
      logs.push(logEntry)

      // Mantener solo los últimos 100 logs en localStorage
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }

      localStorage.setItem('app_logs', JSON.stringify(logs))
    } catch (error) {
      // Fallback silencioso si localStorage falla
      console.warn('Failed to store log:', error)
    }
  }

  // Obtener logs para debugging (solo en desarrollo)
  getLogs(): LogEntry[] {
    if (this.isProduction) return []
    return [...this.logs]
  }

  // Limpiar logs
  clearLogs() {
    this.logs = []
    if (!this.isProduction) {
      localStorage.removeItem('app_logs')
    }
  }
}

// Instancia global del logger
export const logger = new SecureLogger()

// Funciones de conveniencia para logging común
export const logAuthEvent = (event: string, userId?: string, email?: string, data?: Record<string, any>) => {
  logger.auth(event, userId, email, data)
}

export const logSecurityEvent = (event: string, userId?: string, email?: string, data?: Record<string, any>) => {
  logger.security(event, userId, email, data)
}

export const logError = (event: string, error: Error | string, userId?: string, email?: string) => {
  logger.error(event, error, userId, email)
}

export const logWarning = (event: string, message: string, userId?: string, email?: string, data?: Record<string, any>) => {
  logger.warn(event, message, userId, email, data)
}