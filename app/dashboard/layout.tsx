import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Validar sesión en servidor (seguro)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">EPSeak Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bienvenido, {user.email?.split('@')[0]}
            </span>
            <form action="/api/auth/logout" method="POST" className="inline">
              <button
                type="submit"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}