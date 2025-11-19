'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'
import { Trophy, CheckCircle, Flame } from 'lucide-react'

export interface StudentStats {
  totalModules: number
  completedModules: number
  unlockedModules: number
  totalLessons: number
  completedLessons: number
  totalHours: number
  currentStreak: number
  longestStreak: number
  joinDate: string
  areas: Array<{
    name: string
    completed: number
    total: number
    progress: number
  }>
  achievements: Array<{
    icon: React.ComponentType<any>
    title: string
    description: string
    color: string
  }>
}

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Get user profile for join date
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Get all modules with lessons and student modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          area_of_interest,
          lessons (
            id,
            duration_minutes
          ),
          student_modules (
            progress_percentage,
            is_unlocked
          )
        `)
        .eq('is_active', true)

      if (modulesError) throw modulesError

      // Get student progress for lessons
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('lesson_id')
        .eq('student_id', user.id)

      if (progressError) throw progressError

      // Create a set of completed lesson IDs for quick lookup
      const completedLessonIds = new Set(progressData?.map(p => p.lesson_id) || [])

      // Calculate statistics
      let totalModules = modulesData.length
      let completedModules = 0
      let unlockedModules = 0
      let totalLessons = 0
      let completedLessons = 0
      let totalHours = 0

      const areaStats: Record<string, { completed: number; total: number }> = {}

      modulesData.forEach((module: any) => {
        const studentModule = module.student_modules?.[0]
        const moduleLessons = module.lessons || []

        // Count modules
        if (studentModule?.is_unlocked) unlockedModules++
        if (studentModule?.progress_percentage === 100) completedModules++

        // Count lessons
        totalLessons += moduleLessons.length
        completedLessons += moduleLessons.filter((lesson: any) => completedLessonIds.has(lesson.id)).length

        // Calculate hours
        totalHours += moduleLessons.reduce((acc: number, lesson: any) => acc + (lesson.duration_minutes || 0), 0)

        // Area statistics
        const area = module.area_of_interest
        if (!areaStats[area]) {
          areaStats[area] = { completed: 0, total: 0 }
        }
        areaStats[area].total++
        if (studentModule?.progress_percentage === 100) {
          areaStats[area].completed++
        }
      })

      // Convert area stats to array
      const areas = Object.entries(areaStats).map(([name, stats]) => ({
        name,
        completed: stats.completed,
        total: stats.total,
        progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      }))

      // Calculate streak based on recent activity (simplified - counts days with progress in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: recentProgress, error: streakError } = await supabase
        .from('student_progress')
        .select('completed_at')
        .eq('student_id', user.id)
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false })

      let currentStreak = 0
      let longestStreak = 0

      if (!streakError && recentProgress) {
        // Calculate current streak (consecutive days with activity)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const activityDates = recentProgress.map(p => {
          const date = new Date(p.completed_at)
          date.setHours(0, 0, 0, 0)
          return date.getTime()
        }).filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates

        activityDates.sort((a, b) => b - a) // Most recent first

        // Calculate current streak
        let streakCount = 0
        let checkDate = today.getTime()

        for (const activityDate of activityDates) {
          if (activityDate === checkDate) {
            streakCount++
            checkDate -= 24 * 60 * 60 * 1000 // Previous day
          } else if (activityDate < checkDate) {
            break // Gap in streak
          }
        }

        currentStreak = streakCount

        // Calculate longest streak (simplified - max consecutive days in the period)
        let tempStreak = 1
        longestStreak = 1

        for (let i = 1; i < activityDates.length; i++) {
          const diff = (activityDates[i-1] - activityDates[i]) / (24 * 60 * 60 * 1000)
          if (diff === 1) {
            tempStreak++
            longestStreak = Math.max(longestStreak, tempStreak)
          } else {
            tempStreak = 1
          }
        }
      }

      // Generate achievements based on real progress
      const achievements = []
      if (completedModules >= 1) {
        achievements.push({
          icon: Trophy,
          title: 'First module completed',
          description: 'Excellent start!',
          color: 'from-yellow-400 to-orange-500'
        })
      }
      if (completedLessons >= 8) {
        achievements.push({
          icon: CheckCircle,
          title: `${completedLessons} lessons completed`,
          description: 'You are on the right track!',
          color: 'from-green-400 to-teal-500'
        })
      }
      if (currentStreak >= 7) {
        achievements.push({
          icon: Flame,
          title: `${currentStreak} day streak`,
          description: 'Keep learning!',
          color: 'from-orange-500 to-red-500'
        })
      }
      if (completedLessons >= 25) {
        achievements.push({
          icon: Trophy,
          title: 'Dedicated learner',
          description: '25 lessons completed!',
          color: 'from-purple-400 to-pink-500'
        })
      }

      const studentStats: StudentStats = {
        totalModules,
        completedModules,
        unlockedModules,
        totalLessons,
        completedLessons,
        totalHours: Math.round(totalHours / 60), // Convert to hours
        currentStreak,
        longestStreak,
        joinDate: profile.updated_at,
        areas,
        achievements
      }

      setStats(studentStats)
    } catch (err) {
      console.error('Error fetching student stats:', err)
      setError(err instanceof Error ? err.message : 'Error loading statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}