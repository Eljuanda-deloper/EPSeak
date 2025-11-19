/**
 * Utilidades de seguridad para el frontend
 */

// Validación de entrada de usuario
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula')
  }

  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (username.length < 3) {
    errors.push('El nombre de usuario debe tener al menos 3 caracteres')
  }

  if (username.length > 20) {
    errors.push('El nombre de usuario no puede tener más de 20 caracteres')
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Sanitización de entrada
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remover tags HTML básicos
    .trim()
    .slice(0, 1000) // Limitar longitud
}

// Rate limiting básico (cliente-side)
class RateLimiter {
  private attempts: number[] = []
  private maxAttempts: number
  private windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 intentos por 15 minutos
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  canAttempt(): boolean {
    const now = Date.now()
    this.attempts = this.attempts.filter(time => now - time < this.windowMs)

    if (this.attempts.length >= this.maxAttempts) {
      return false
    }

    this.attempts.push(now)
    return true
  }

  getRemainingTime(): number {
    if (this.attempts.length === 0) return 0

    const oldestAttempt = Math.min(...this.attempts)
    const timePassed = Date.now() - oldestAttempt
    return Math.max(0, this.windowMs - timePassed)
  }
}

export const authRateLimiter = new RateLimiter()

// Utilidades de encriptación básica para datos sensibles en localStorage
export const encryptData = (data: string, key: string): string => {
  // Nota: Esta es una encriptación básica para demo. En producción usar crypto APIs
  try {
    return btoa(JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    return data
  }
}

export const decryptData = (encryptedData: string, key: string): string | null => {
  try {
    const parsed = JSON.parse(atob(encryptedData))
    // Verificar que no haya expirado (24 horas)
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

// Utilidades de logging seguro
export const secureLog = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const timestamp = new Date().toISOString()

  // En desarrollo mostrar logs, en producción enviar a servicio de logging
  if (process.env.NODE_ENV === 'development') {
    const logData = data ? { message, data, timestamp } : { message, timestamp }

    switch (level) {
      case 'info':
        console.info('[SECURE LOG]', logData)
        break
      case 'warn':
        console.warn('[SECURE LOG]', logData)
        break
      case 'error':
        console.error('[SECURE LOG]', logData)
        break
    }
  } else {
    // En producción, enviar a servicio de logging seguro
    // sendToLoggingService(level, message, data)
  }
}

// Utilidades de Content Security Policy
export const generateCSP = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://nrgqbrwqrzbjsujgyput.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}

// Utilidades de headers de seguridad
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': generateCSP()
}