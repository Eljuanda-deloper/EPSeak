import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { lazy, Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import type { Metadata } from 'next'

const DashboardSidebar = lazy(() => import('@/app/components/layout/Sidebar'))
const DashboardHeader = lazy(() => import('@/app/components/layout/DashboardHeader'))

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
    <div className="flex w-full bg-gray-100 flex-col md:flex-row h-screen">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <Suspense fallback={<Skeleton height="100%" width="256px" className="hidden md:block md:w-64" />}>
        <DashboardSidebar />
      </Suspense>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header - Mobile and Desktop */}
        <Suspense fallback={<Skeleton height="60px" />}>
          <DashboardHeader />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full px-3 py-4 sm:px-4 md:px-8 md:py-6">
            <div className="max-w-7xl mx-auto">
              <Suspense fallback={<Skeleton count={5} />}>
                {children}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}