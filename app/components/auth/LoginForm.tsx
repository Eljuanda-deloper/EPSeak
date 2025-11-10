'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Button from '@/app/components/shared/Button'
import { validateEmail, authRateLimiter } from '@/app/utils/security'
import { logAuthEvent, logError, logWarning } from '@/app/utils/logger'
import { reportError } from '@/app/utils/monitoring'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔐 Starting login process for:', email.substring(0, 3) + '***')

    // Rate limiting
    if (!authRateLimiter.canAttempt()) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime() / 1000 / 60)
      console.log('⏱️ Rate limit exceeded, remaining time:', remainingTime, 'minutes')
      setError(`Demasiados intentos. Intenta de nuevo en ${remainingTime} minutos.`)
      setLoading(false)
      logWarning('rate_limit_exceeded', 'Login rate limit exceeded', undefined, email.substring(0, 3) + '***')
      return
    }

    // Validación de email
    if (!validateEmail(email)) {
      console.log('❌ Invalid email format')
      setError('Por favor ingresa un correo electrónico válido')
      setLoading(false)
      return
    }

    try {
      console.log('📤 Calling signIn function...')
      logAuthEvent('login_attempt', undefined, email.substring(0, 3) + '***')

      const { error } = await signIn(email, password)

      if (error) {
        console.log('❌ Sign in error:', error)
        logWarning('login_failed', 'User login failed', undefined, email.substring(0, 3) + '***', { error: error.substring(0, 50) })
        setError(error)
        setLoading(false)
      } else {
        console.log('✅ Sign in successful')
        logAuthEvent('login_success', undefined, email.substring(0, 3) + '***')
        // Let the AuthContext handle the redirect
        setLoading(false)
      }
    } catch (err) {
      console.log('💥 Unexpected error during login:', err)
      logError('login_error', String(err), undefined, email.substring(0, 3) + '***')
      reportError(err as Error, { context: 'login_form', email: email.substring(0, 3) + '***' })
      setError('Error inesperado. Por favor, intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Tu contraseña"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {error === 'Invalid login credentials'
                ? 'Credenciales inválidas. Verifica tu email y contraseña.'
                : error === 'Email not confirmed'
                ? 'Por favor confirma tu email antes de iniciar sesión.'
                : error
              }
            </p>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  )
}