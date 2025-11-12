'use client'

import { useState } from 'react'
import { Bell, User } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-azul-petroleo hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Mobile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 text-gray-600 hover:text-azul-petroleo rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">JD</span>
                </div>
              </button>

              {/* Profile Menu Mobile */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block bg-white border-b border-gray-200 z-30 h-16">
        <div className="flex items-center justify-between h-full px-8">
          {/* Left Side - Title */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-azul-petroleo hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-azul-petroleo hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-azul-petroleo to-azul-celeste rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">JD</span>
                </div>
              </button>

              {/* Profile Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
                  >
                    <span className="text-sm">Logout</span>
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
