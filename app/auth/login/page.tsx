'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import LoginForm from '@/app/components/auth/LoginForm'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasRedirectedRef = useRef(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // ✅ Redirigir después del login exitoso - solución robusta
  useEffect(() => {
    // Solo proceder si no estamos cargando, hay usuario, no hemos redirigido antes y no estamos en proceso de redirección
    if (!loading && user && !hasRedirectedRef.current && !isRedirecting) {
      hasRedirectedRef.current = true
      setIsRedirecting(true)

      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      console.log('✅ User authenticated, redirecting to:', redirectTo)

      // Usar requestAnimationFrame + setTimeout para asegurar que el DOM esté completamente renderizado
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Verificar que aún estamos en la página de login antes de redirigir
          if (window.location.pathname === '/auth/login') {
            console.log('🚀 Executing redirect to:', redirectTo)
            router.replace(redirectTo)
          }
        }, 100) // Pequeño delay después del render frame
      })
    }
  }, [user, loading, router, searchParams, isRedirecting])

  // Reset flags when component unmounts or user logs out
  useEffect(() => {
    return () => {
      hasRedirectedRef.current = false
      setIsRedirecting(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      hasRedirectedRef.current = false
      setIsRedirecting(false)
    }
  }, [user])

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Mostrar mensaje si ya está autenticado (mientras redirige)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de EPSeak
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}