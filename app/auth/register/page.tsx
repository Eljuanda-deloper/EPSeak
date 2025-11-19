export const dynamic = 'force-dynamic'

import RegisterForm from '@/app/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a ESPeak y comienza tu aprendizaje
          </p>
        </div>
        <RegisterForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}