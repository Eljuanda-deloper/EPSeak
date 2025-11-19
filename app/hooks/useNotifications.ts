'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

export interface NotificationData {
  id: string
  type: 'unlock' | 'achievement' | 'milestone' | 'info'
  title: string
  message: string
  module_id?: string
  created_at: string
  read: boolean
}

export interface Notification extends NotificationData {
  timestamp: Date
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch notifications from database with RLS
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (notificationsError) throw notificationsError

      // Transform data to include timestamp with optional chaining
      const transformedNotifications: Notification[] = (notificationsData || []).map((notification: NotificationData) => ({
        ...notification,
        timestamp: new Date(notification.created_at || new Date())
      }))

      setNotifications(transformedNotifications)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const addNotification = async (notification: Omit<NotificationData, 'id' | 'created_at' | 'read'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          ...notification,
          read: false
        })
        .select()
        .single()

      if (error) throw error

      // Add to local state
      const newNotification: Notification = {
        ...data,
        timestamp: new Date(data.created_at)
      }
      setNotifications(prev => [newNotification, ...prev])
    } catch (err) {
      console.error('Error adding notification:', err)
      throw err
    }
  }

  const dismissNotification = async (id: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error dismissing notification:', err)
      // Still update local state even if database update fails
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error clearing notifications:', err)
    }
  }

  // Note: Notifications are now generated automatically by database triggers
  // when modules are unlocked or achievements are reached

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  return {
    notifications,
    loading,
    error,
    addNotification,
    dismissNotification,
    markAsRead,
    clearAll,
    refetch: fetchNotifications
  }
}