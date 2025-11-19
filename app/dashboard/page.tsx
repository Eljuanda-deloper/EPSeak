'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ProgressTracker from '@/app/components/dashboard/ProgressTracker'
import { useModules } from '@/app/hooks/useModules'
import { useStudentStats } from '@/app/hooks/useStudentStats'
import { useCareers } from '@/app/hooks/useCareers'
import { BookOpen, TrendingUp, Award, Clock, Target, Flame, Trophy, Star, CheckCircle, GraduationCap } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState('Estudiante')
  const { modules, loading: modulesLoading } = useModules()
  const { stats, loading: statsLoading } = useStudentStats()
  const { careers, loading: careersLoading } = useCareers()

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name.split(' ')[0])
    } else if (user?.email) {
      setUserName(user.email.split('@')[0])
    }
  }, [user])

  const handleModuleClick = (module: any) => {
    router.push(`/dashboard/modules/${module.id}`)
  }

  const achievements = stats?.achievements || []

  const quickStats = [
    {
      icon: Clock,
      label: 'Hours studied',
      value: `${stats?.totalHours || 0}h`,
      color: 'from-[#0A4E5A] to-[#7CC4E0]'
    },
    {
      icon: Target,
      label: 'Lessons completed',
      value: (stats?.completedLessons || 0).toString(),
      color: 'from-[#7CC4E0] to-[#0A4E5A]'
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-[#E8ECEF]">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A4E5A]/10 to-[#7CC4E0]/10 border border-[#0A4E5A]/20 p-4 md:p-6 mt-0">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#0A4E5A]">Hello, {userName}! 👋</h1>
              <p className="text-[#7CC4E0] mb-4 text-sm md:text-base">Continue your professional English learning journey</p>

              {/* Interactive Stats Row */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Streak Card */}
                <div className="flex items-center gap-3 bg-white border border-[#E8ECEF] px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="relative">
                    <Flame className={`text-orange-500 transition-transform group-hover:scale-110 ${(stats?.currentStreak ?? 0) > 0 ? 'animate-pulse' : ''}`} size={24} />
                    {(stats?.currentStreak ?? 0) >= 7 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0A4E5A]">{stats?.currentStreak ?? 0}</p>
                    <p className="text-xs text-[#7CC4E0] font-medium">day streak</p>
                  </div>
                </div>

                {/* Level Indicator */}
                <div className="flex items-center gap-3 bg-white border border-[#E8ECEF] px-4 py-3 rounded-xl shadow-sm">
                  <Star className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-lg font-bold text-[#0A4E5A]">B2</p>
                    <p className="text-xs text-[#7CC4E0] font-medium">Current level</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/dashboard/modules')}
                    className="flex items-center gap-2 bg-[#0A4E5A] text-white px-4 py-3 rounded-xl hover:bg-[#7CC4E0] transition-colors shadow-sm hover:shadow-md"
                  >
                    <BookOpen size={18} />
                    <span className="hidden sm:inline font-medium">Continue Learning</span>
                    <span className="sm:hidden font-medium">Learn</span>
                  </button>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-sm text-[#0A4E5A] italic font-medium">
                  "{(stats?.currentStreak ?? 0) >= 7
                    ? "Amazing consistency! You're building strong habits."
                    : (stats?.currentStreak ?? 0) >= 3
                    ? "Great momentum! Keep the streak going."
                    : "Every lesson brings you closer to fluency. You've got this!"
                  }"
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#7CC4E0]">Daily motivation</span>
                  <button
                    onClick={() => {
                      // Could cycle through different quotes
                      console.log('Next quote')
                    }}
                    className="text-[#7CC4E0] hover:text-[#0A4E5A] transition-colors"
                  >
                    <Star size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Summary Card */}
            <div className="lg:w-80 bg-white border border-[#E8ECEF] rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-[#0A4E5A] mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Today's Progress
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7CC4E0]">Lessons completed</span>
                  <span className="font-semibold text-[#0A4E5A]">{stats?.completedLessons || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7CC4E0]">Study time</span>
                  <span className="font-semibold text-[#0A4E5A]">{stats?.totalHours || 0}h</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7CC4E0]">Modules unlocked</span>
                  <span className="font-semibold text-[#0A4E5A]">{stats?.unlockedModules || 0}</span>
                </div>

                <div className="pt-2 border-t border-[#E8ECEF]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#0A4E5A]">Next milestone</span>
                    <span className="text-xs text-[#7CC4E0]">
                      {(stats?.completedLessons ?? 0) >= 25 ? 'Advanced level!' :
                       (stats?.completedLessons ?? 0) >= 10 ? '15 more lessons' :
                       `${10 - (stats?.completedLessons ?? 0)} to go`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0] opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Career Card */}
      {!careersLoading && careers.length > 0 && (
        <div className="bg-white border border-[#7CC4E0]/20 rounded-2xl p-6 hover:border-[#0A4E5A] hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#0A4E5A] mb-1">{careers[0].title}</h3>
              <p className="text-[#7CC4E0] text-sm mb-2">{careers[0].description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#0A4E5A] font-medium">{careers[0].modules?.length || 0} modules</span>
                <span className="text-[#7CC4E0]">{careers[0].total_duration_hours}h total</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">{careers[0].icon}</div>
              <p className="text-xs text-[#7CC4E0]">{careers[0].target_role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      <ProgressTracker
        modules={modules.filter(m => ['english', 'automation'].includes(m.area_of_interest))}
        onModuleClick={handleModuleClick}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white border border-[#7CC4E0]/20 rounded-2xl p-4 hover:border-[#0A4E5A] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A4E5A]">{stat.value}</p>
                  <p className="text-xs text-[#7CC4E0]">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-[#0A4E5A]">
            <Award className="text-yellow-400" size={20} />
            Recent achievements
          </h2>
          <button className="text-sm text-[#7CC4E0] hover:text-[#0A4E5A] transition-colors">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon
            return (
              <div key={i} className="bg-white border border-[#E8ECEF] rounded-2xl p-4 hover:scale-105 hover:shadow-md transition-all cursor-pointer group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className="text-white" />
                </div>
                <p className="text-sm font-medium text-[#0A4E5A] text-center">{achievement.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
