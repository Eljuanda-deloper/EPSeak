'use client'

import { useState, useEffect } from 'react'
import { Bell, User, Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const [notifications] = useState(3)
  const [userName, setUserName] = useState('User')
  const [userInitials, setUserInitials] = useState('U')

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      const fullName = user.user_metadata.full_name
      setUserName(fullName)
      const initials = fullName
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
      setUserInitials(initials)
    } else if (user?.email) {
      setUserName(user.email.split('@')[0])
      setUserInitials(user.email[0].toUpperCase())
    }
  }, [user])

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-12">
        <div className="flex items-center justify-between px-6 h-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Dashboard</span>
            <ChevronRight size={16} />
            <span className="text-gray-900">Home</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search - Hidden on mobile */}
            <div className="hidden sm:block relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5da6b8] transition-all w-64 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all" aria-label="Notifications">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4757] rounded-full text-xs flex items-center justify-center font-semibold text-white">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-800/50 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a4d5c] to-[#ff4757] flex items-center justify-center font-semibold text-sm text-white">
                  {userInitials}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline">{userName}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-800/50 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-[#5da6b8] hover:bg-gray-800/50 transition-colors text-sm border-b border-gray-800/50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-[#ff4757] hover:bg-gray-800/50 transition-colors text-sm"
                  >
                    <span className="text-sm">Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
