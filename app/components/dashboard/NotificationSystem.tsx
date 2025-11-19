'use client'

import { useState, useEffect } from 'react'
import { X, Unlock, Trophy, CheckCircle, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'unlock' | 'achievement' | 'milestone' | 'info'
  title: string
  message: string
  module_id?: string
  timestamp: Date
  read?: boolean
}

interface NotificationSystemProps {
  notifications: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onNotificationDismiss?: (notificationId: string) => void
}

export default function NotificationSystem({
  notifications,
  onNotificationClick,
  onNotificationDismiss
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Show only unread notifications initially
    const unreadNotifications = notifications.filter(n => !n.read)
    setVisibleNotifications(unreadNotifications.slice(0, 3)) // Show max 3 at once
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'unlock':
        return <Unlock className="w-6 h-6 text-[#7CC4E0]" />
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 'milestone':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'info':
        return <AlertCircle className="w-6 h-6 text-[#0A4E5A]" />
      default:
        return <AlertCircle className="w-6 h-6 text-[#0A4E5A]" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'unlock':
        return 'border-[#7CC4E0] bg-[#7CC4E0]/10'
      case 'achievement':
        return 'border-yellow-500 bg-yellow-500/10'
      case 'milestone':
        return 'border-green-500 bg-green-500/10'
      case 'info':
        return 'border-[#0A4E5A] bg-[#0A4E5A]/10'
      default:
        return 'border-[#0A4E5A] bg-[#0A4E5A]/10'
    }
  }

  const handleDismiss = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId))
    onNotificationDismiss?.(notificationId)
  }

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification)
    // Mark as read and hide
    setVisibleNotifications(prev => prev.filter(n => n.id !== notification.id))
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} días`
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${getNotificationColor(notification.type)}`}
          onClick={() => handleNotificationClick(notification)}
        >
          {/* Close button */}
          <button
            onClick={(e) => handleDismiss(notification.id, e)}
            className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-[#0A4E5A]" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 pr-8">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#0A4E5A] text-sm leading-tight">
                {notification.title}
              </h4>
              <p className="text-[#7CC4E0] text-xs mt-1 leading-relaxed">
                {notification.message}
              </p>
              <div className="text-[#7CC4E0] text-xs mt-2 opacity-75">
                {formatTimeAgo(notification.timestamp)}
              </div>
            </div>
          </div>

          {/* Progress indicator for unlock notifications */}
          {notification.type === 'unlock' && notification.module_id && (
            <div className="mt-3 pt-3 border-t border-[#7CC4E0]/20">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#E8ECEF] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0A4E5A] to-[#7CC4E0] rounded-full w-full animate-pulse" />
                </div>
                <span className="text-xs text-[#7CC4E0] font-medium">¡Desbloqueado!</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Show all notifications button */}
      {notifications.length > visibleNotifications.length && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full bg-white border-2 border-[#7CC4E0]/30 rounded-xl p-3 hover:border-[#0A4E5A] transition-colors shadow-lg"
        >
          <div className="text-center">
            <div className="text-sm font-medium text-[#0A4E5A]">
              {notifications.length - visibleNotifications.length} notificaciones más
            </div>
            <div className="text-xs text-[#7CC4E0] mt-1">
              {showAll ? 'Ocultar' : 'Mostrar todas'}
            </div>
          </div>
        </button>
      )}

      {/* Expanded notifications */}
      {showAll && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.slice(visibleNotifications.length).map((notification) => (
            <div
              key={notification.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${getNotificationColor(notification.type)}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#0A4E5A] text-sm leading-tight">
                    {notification.title}
                  </h4>
                  <p className="text-[#7CC4E0] text-xs mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="text-[#7CC4E0] text-xs mt-2 opacity-75">
                    {formatTimeAgo(notification.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    clearAll
  }
}