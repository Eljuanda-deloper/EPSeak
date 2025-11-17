import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import type { Metadata } from 'next'
import SidebarWrapper from '@/app/components/layout/SidebarWrapper'
import DashboardHeaderWrapper from '@/app/components/layout/DashboardHeaderWrapper'

export const metadata: Metadata = {
  title: 'Dashboard - ESPeak',
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
    <div className="flex w-full bg-white flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full h-screen">
        {/* Header */}
        <DashboardHeaderWrapper />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}