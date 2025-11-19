'use client'

import { useState, useEffect } from 'react'
import { Bell, Menu, X, BookOpen, TrendingUp, Award, Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/utils/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'achievement'
  timestamp: string
  read: boolean
}

export default function DashboardHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load notifications from Supabase
  useEffect(() => {
    if (!user?.id) return
    
    const loadNotifications = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (data) {
          setNotifications(data as unknown as Notification[])
          setUnreadCount(data.filter((n: any) => !n.read).length)
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()
    
    // Subscribe to real-time notifications
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user?.id])

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 1) return 'Dashboard'
    const lastSegment = segments[segments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />
      case 'success':
        return <HomeIcon className="w-4 h-4 text-green-500" />
      case 'warning':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      default:
        return <BookOpen className="w-4 h-4 text-blue-500" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-[#E8ECEF] sticky top-0 z-20 h-16">
        <div className="flex items-center justify-between px-6 h-full">
          {/* Left - Page Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#0A4E5A]">{getPageTitle()}</h1>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-[#E8ECEF] rounded-xl transition-all"
                aria-label="Notificaciones"
              >
                <Bell size={20} className="text-[#0A4E5A]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E0312D] rounded-full text-xs flex items-center justify-center font-semibold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-xl shadow-lg border border-[#E8ECEF] z-50 overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-[#E8ECEF] bg-gradient-to-r from-[#0A4E5A]/5 to-[#7CC4E0]/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#0A4E5A]">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            notifications.forEach(n => {
                              if (!n.read) markAsRead(n.id)
                            })
                          }}
                          className="text-xs text-[#7CC4E0] hover:text-[#0A4E5A] transition-colors"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#7CC4E0]">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tienes notificaciones</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-[#E8ECEF] hover:bg-[#E8ECEF] transition-colors cursor-pointer ${
                            !notification.read ? 'bg-[#0A4E5A]/2' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium ${!notification.read ? 'text-[#0A4E5A]' : 'text-[#7CC4E0]'}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-[#0A4E5A] rounded-full mt-1 flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-[#7CC4E0] mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-[#7CC4E0]/60 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#E8ECEF] rounded-xl transition-all"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-[#0A4E5A]" />
              ) : (
                <Menu size={20} className="text-[#0A4E5A]" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
