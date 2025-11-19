'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Button from '@/app/components/shared/Button'
import { validatePassword, validateEmail, authRateLimiter } from '@/app/utils/security'
import { logAuthEvent, logError, logWarning } from '@/app/utils/logger'
import { reportError } from '@/app/utils/monitoring'
import { useCareers } from '@/app/hooks/useCareers'
import { createClient } from '@/app/utils/supabase/client'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp } = useAuth()
  const router = useRouter()
  const { careers, loading: careersLoading, error: careersError } = useCareers()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Rate limiting
    if (!authRateLimiter.canAttempt()) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime() / 1000 / 60)
      setError(`Demasiados intentos. Intenta de nuevo en ${remainingTime} minutos.`)
      setLoading(false)
      logWarning('rate_limit_exceeded', 'Registration rate limit exceeded', undefined, email.substring(0, 3) + '***')
      return
    }

    // Validación de email
    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido')
      setLoading(false)
      return
    }

    // Validación de contraseña
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('. '))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (!selectedCareer) {
      setError('Por favor selecciona una carrera')
      setLoading(false)
      return
    }

    try {
      logAuthEvent('registration_attempt', undefined, email.substring(0, 3) + '***')

      const { error } = await signUp(email, password)

      if (error) {
        logWarning('registration_failed', 'User registration failed', undefined, email.substring(0, 3) + '***', { error: error.substring(0, 50) })
        setError(error)
        setLoading(false)
      } else {
        // Asignar la carrera seleccionada al usuario
        try {
          // Crear perfil del usuario
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            // Insertar en profiles
            await supabase.from('profiles').insert({
              id: user.id,
              email: email,
              current_career_id: selectedCareer
            })

            // Insertar en student_careers
            await supabase.from('student_careers').insert({
              student_id: user.id,
              career_path_id: selectedCareer,
              enrolled_at: new Date().toISOString()
            })

            logAuthEvent('career_assigned', user.id, `Career ${selectedCareer} assigned to user`)
          }
        } catch (careerError) {
          logWarning('career_assignment_failed', 'Failed to assign career to user', undefined, email.substring(0, 3) + '***', { error: String(careerError) })
          // No fallar el registro por esto, solo loggear
        }

        logAuthEvent('registration_success', undefined, email.substring(0, 3) + '***')
        setSuccess('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err) {
      logError('registration_error', String(err), undefined, email.substring(0, 3) + '***')
      reportError(err as Error, { context: 'register_form', email: email.substring(0, 3) + '***' })
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
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div>
          <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-2">
            Carrera de aprendizaje
          </label>
          {careersLoading ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Cargando carreras...
            </div>
          ) : careersError ? (
            <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
              Error al cargar carreras. Por favor, recarga la página.
            </div>
          ) : (
            <select
              id="career"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option value="">Selecciona una carrera</option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>
                  {career.icon} {career.title} - {career.target_role}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Elige la carrera que mejor se adapte a tus objetivos profesionales
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {error === 'User already registered'
                ? 'Este email ya está registrado. Intenta iniciar sesión.'
                : error === 'Password should be at least 6 characters'
                ? 'La contraseña debe tener al menos 6 caracteres.'
                : error
              }
            </p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading || careersLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : careersLoading ? 'Cargando carreras...' : 'Crear cuenta'}
        </Button>
      </form>
    </div>
  )
}