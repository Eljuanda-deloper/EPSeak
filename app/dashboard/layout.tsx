import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import DashboardSidebar from '@/app/components/layout/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - EPSeak',
}

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
    <html lang="es">
      <body className="min-h-screen w-full font-poppins bg-gray-50 antialiased">
        <div className="flex h-screen">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}