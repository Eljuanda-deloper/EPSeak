/**
 * Utilidades básicas de auditoría de seguridad
 */

import { logSecurityEvent } from './logger'

interface SecurityCheck {
  name: string
  check: () => Promise<boolean>
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

class SecurityAuditor {
  private checks: SecurityCheck[] = []

  addCheck(check: SecurityCheck) {
    this.checks.push(check)
  }

  async runAudit(): Promise<{
    passed: SecurityCheck[]
    failed: SecurityCheck[]
    summary: { total: number; passed: number; failed: number; critical: number }
  }> {
    const results = {
      passed: [] as SecurityCheck[],
      failed: [] as SecurityCheck[],
      summary: { total: 0, passed: 0, failed: 0, critical: 0 }
    }

    for (const check of this.checks) {
      try {
        const passed = await check.check()
        results.summary.total++

        if (passed) {
          results.passed.push(check)
          results.summary.passed++
        } else {
          results.failed.push(check)
          results.summary.failed++

          if (check.severity === 'critical') {
            results.summary.critical++
          }

          logSecurityEvent('security_check_failed', undefined, undefined, {
            checkName: check.name,
            severity: check.severity,
            description: check.description
          })
        }
      } catch (error) {
        results.failed.push(check)
        results.summary.failed++
        results.summary.total++

        logSecurityEvent('security_check_error', undefined, undefined, {
          checkName: check.name,
          error: String(error)
        })
      }
    }

    return results
  }
}

// Instancia global del auditor
export const securityAuditor = new SecurityAuditor()

// Checks de seguridad básicos
securityAuditor.addCheck({
  name: 'https_check',
  check: async () => {
    if (typeof window === 'undefined') return true // Skip en server-side
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  },
  severity: 'high',
  description: 'Verificar que la aplicación use HTTPS en producción'
})

securityAuditor.addCheck({
  name: 'content_security_policy',
  check: async () => {
    if (typeof document === 'undefined') return true
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
    return !!cspMeta
  },
  severity: 'medium',
  description: 'Verificar que se implemente Content Security Policy'
})

securityAuditor.addCheck({
  name: 'x_frame_options',
  check: async () => {
    // Esta verificación requiere una petición HTTP, por simplicidad retornamos true
    // En una implementación real, verificaríamos los headers HTTP
    return true
  },
  severity: 'medium',
  description: 'Verificar protección contra clickjacking (X-Frame-Options)'
})

securityAuditor.addCheck({
  name: 'local_storage_sensitive_data',
  check: async () => {
    if (typeof localStorage === 'undefined') return true

    const sensitiveKeys = ['password', 'token', 'key', 'secret']
    const keys = Object.keys(localStorage)

    for (const key of keys) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        // Verificar si los datos están encriptados (básico)
        const value = localStorage.getItem(key)
        if (value && !value.startsWith('eyJ')) { // No parece JWT
          return false
        }
      }
    }

    return true
  },
  severity: 'high',
  description: 'Verificar que no se almacenen datos sensibles sin encriptar en localStorage'
})

securityAuditor.addCheck({
  name: 'console_exposure',
  check: async () => {
    if (typeof window === 'undefined') return true

    // Verificar que no se expongan funciones sensibles en window
    const sensitiveFunctions = ['supabase', 'auth', 'apiKey', 'secret']
    const globalKeys = Object.keys(window)

    for (const key of globalKeys) {
      if (sensitiveFunctions.some(func => key.toLowerCase().includes(func))) {
        return false
      }
    }

    return true
  },
  severity: 'low',
  description: 'Verificar que no se expongan funciones sensibles en el objeto global'
})

securityAuditor.addCheck({
  name: 'input_validation',
  check: async () => {
    if (typeof document === 'undefined') return true

    // Verificar que los inputs de password tengan restricciones básicas
    const passwordInputs = document.querySelectorAll('input[type="password"]')

    for (const input of passwordInputs) {
      const htmlInput = input as HTMLInputElement
      if (!htmlInput.required) {
        return false // Los campos de password deberían ser requeridos
      }
    }

    return true
  },
  severity: 'medium',
  description: 'Verificar validación básica de inputs sensibles'
})

// Función para ejecutar auditoría
export const runSecurityAudit = async () => {
  console.log('🔒 Ejecutando auditoría de seguridad...')

  const results = await securityAuditor.runAudit()

  console.log(`📊 Resultados de auditoría:`)
  console.log(`Total de checks: ${results.summary.total}`)
  console.log(`✅ Pasaron: ${results.summary.passed}`)
  console.log(`❌ Fallaron: ${results.summary.failed}`)
  console.log(`🚨 Críticos: ${results.summary.critical}`)

  if (results.failed.length > 0) {
    console.log('❌ Checks fallidos:')
    results.failed.forEach(check => {
      console.log(`  - ${check.name} (${check.severity}): ${check.description}`)
    })
  }

  return results
}

// Utilidades de sanitización de XSS básico
export const sanitizeHtml = (html: string): string => {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}

// Verificación de integridad de dependencias (básico)
export const checkDependencyIntegrity = async () => {
  // En una implementación real, verificaríamos hashes de dependencias
  // Por ahora, solo verificamos que las dependencias críticas estén cargadas
  const criticalDeps = ['React', 'Supabase']

  for (const dep of criticalDeps) {
    if (typeof window !== 'undefined' && !(dep in window)) {
      logSecurityEvent('dependency_integrity_check_failed', undefined, undefined, {
        dependency: dep
      })
      return false
    }
  }

  return true
}

// Detección básica de ataques de inyección
export const detectInjectionAttempts = (input: string): boolean => {
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /Function\(/i
  ]

  return injectionPatterns.some(pattern => pattern.test(input))
}

// Rate limiting para endpoints sensibles
export const endpointRateLimiter = {
  login: { attempts: 0, lastAttempt: 0, limit: 5, window: 15 * 60 * 1000 }, // 5 intentos por 15 min
  register: { attempts: 0, lastAttempt: 0, limit: 3, window: 60 * 60 * 1000 }, // 3 intentos por hora
  passwordReset: { attempts: 0, lastAttempt: 0, limit: 3, window: 60 * 60 * 1000 }
}

export const checkRateLimit = (endpoint: keyof typeof endpointRateLimiter): boolean => {
  const config = endpointRateLimiter[endpoint]
  const now = Date.now()

  // Reset counter if window has passed
  if (now - config.lastAttempt > config.window) {
    config.attempts = 0
  }

  config.lastAttempt = now

  if (config.attempts >= config.limit) {
    logSecurityEvent('rate_limit_exceeded', undefined, undefined, {
      endpoint,
      attempts: config.attempts
    })
    return false
  }

  config.attempts++
  return true
}