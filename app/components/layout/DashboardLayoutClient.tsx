'use client'

import { useRouter } from 'next/navigation'
import NotificationSystem from '@/app/components/dashboard/NotificationSystem'
import { useNotifications } from '@/app/hooks/useNotifications'

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const router = useRouter()
  const { notifications, loading, error, dismissNotification } = useNotifications()

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    dismissNotification(notification.id)

    // Navigate based on notification type
    if (notification.type === 'unlock' && notification.module_id) {
      router.push(`/dashboard/modules/${notification.module_id}`)
    } else if (notification.type === 'achievement') {
      router.push('/profile')
    }
    // For other types, just log for now
    console.log('Notification clicked:', notification)
  }

  return (
    <>
      {children}

      {/* Notification System */}
      {!loading && !error && notifications.length > 0 && (
        <NotificationSystem
          notifications={notifications}
          onNotificationDismiss={dismissNotification}
          onNotificationClick={handleNotificationClick}
        />
      )}

      {/* Error state for notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-xl p-4 max-w-sm shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-800">Error de notificaciones</h4>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}