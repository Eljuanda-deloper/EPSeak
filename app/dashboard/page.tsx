'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Home, BookOpen, TrendingUp, FolderOpen, Users, Settings, Play, Calendar, Award, Clock, Target, Flame, ChevronRight, Trophy, Star, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [notifications] = useState(3)
  const [userName, setUserName] = useState('Guest')

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name.split(' ')[0])
    } else if (user?.email) {
      setUserName(user.email.split('@')[0])
    }
  }, [user])

  const upcomingClasses = [
    { title: 'Advanced Business English', instructor: 'Prof. Sarah Johnson', date: 'Today', time: '18:00', status: 'live' },
    { title: 'Technical Writing Workshop', instructor: 'Prof. Michael Brown', date: 'Tomorrow', time: '19:30', status: 'upcoming' },
    { title: 'IELTS Speaking Practice', instructor: 'Prof. Emma Davis', date: 'Wednesday', time: '17:00', status: 'upcoming' }
  ]

  const achievements = [
    { icon: Flame, title: '7 days streak', color: 'from-orange-500 to-red-500' },
    { icon: Trophy, title: '50 lessons', color: 'from-yellow-400 to-orange-500' },
    { icon: Star, title: 'B2 Level achieved', color: 'from-[#5da6b8] to-[#1a4d5c]' },
    { icon: CheckCircle, title: 'Course completed', color: 'from-green-400 to-teal-500' }
  ]

  const recommendations = [
    { title: 'Business English', level: 'Intermediate', lessons: 24, image: '💼' },
    { title: 'Medical English', level: 'Advanced', lessons: 18, image: '🏥' },
    { title: 'IT & Tech Vocabulary', level: 'All levels', lessons: 32, image: '💻' }
  ]

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 bg-gray-50">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a4d5c]/10 to-[#ff4757]/10 border border-[#1a4d5c]/20 p-6 mt-0">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Hello, {userName}! 👋</h1>
          <p className="text-gray-600 mb-4">Let's continue your English learning journey</p>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl">
              <Flame className="text-orange-500" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-600">day streak</p>
              </div>
            </div>
            <div className="flex-1 min-w-[300px]">
              <p className="text-sm text-gray-700 italic">"Consistency is the key to success. Keep going!"</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1a4d5c] to-[#ff4757] opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Progress - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#5da6b8] hover:shadow-md transition-all">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Play className="text-[#5da6b8]" size={20} />
            Continue where you left off
          </h2>
          <div className="flex gap-4 flex-wrap lg:flex-nowrap">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#1a4d5c] to-[#ff4757] flex items-center justify-center text-4xl flex-shrink-0">
              📚
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Intermediate English - Module 3</h3>
              <p className="text-sm text-gray-600 mb-4">Business Communication & Professional Skills</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-[#5da6b8]">68%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1a4d5c] to-[#5da6b8] rounded-full transition-all duration-500" style={{width: '68%'}}></div>
                </div>
                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>~2h 30min remaining</span>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#1a4d5c] to-[#5da6b8] rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {[
            { icon: Clock, label: 'Hours this week', value: '8.5h', color: 'from-[#1a4d5c] to-[#5da6b8]' },
            { icon: Target, label: 'Lessons completed', value: '24', color: 'from-[#5da6b8] to-[#1a4d5c]' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#5da6b8] hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
          <Calendar className="text-[#ff4757]" size={20} />
          Upcoming live classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingClasses.map((cls, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#ff4757] hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-[#ff4757] transition-colors text-gray-900">{cls.title}</h3>
                  <p className="text-sm text-gray-600">{cls.instructor}</p>
                </div>
                {cls.status === 'live' && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg border border-red-200">
                    Live now
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm text-gray-600">
                  <p>{cls.date} • {cls.time}</p>
                </div>
                <button className="px-4 py-1.5 bg-[#ff4757]/10 hover:bg-[#ff4757] text-[#ff4757] hover:text-white rounded-lg text-sm font-medium transition-all border border-[#ff4757]/30">
                  {cls.status === 'live' ? 'Join now' : 'Set reminder'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Award className="text-yellow-400" size={20} />
              Recent achievements
            </h2>
            <button className="text-sm text-[#5da6b8] hover:text-[#ff4757] transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, i) => {
              const Icon = achievement.icon
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 hover:scale-105 hover:shadow-md transition-all cursor-pointer group">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Star className="text-[#5da6b8]" size={20} />
            Recommended for you
          </h2>
          <div className="space-y-3">
            {recommendations.map((course, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#5da6b8] hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1a4d5c]/10 to-[#ff4757]/10 flex items-center justify-center text-3xl flex-shrink-0">
                    {course.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 group-hover:text-[#5da6b8] transition-colors text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-[#5da6b8] transition-colors flex-shrink-0" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
