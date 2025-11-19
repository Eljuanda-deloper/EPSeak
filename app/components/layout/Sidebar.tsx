'use client'

import { useState, useEffect } from 'react'
import { Home, BookOpen, Settings, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/utils/supabase/client'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    id: 'modules',
    label: 'Modules',
    icon: <BookOpen className="w-5 h-5" />,
    href: '/dashboard/modules',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/dashboard/settings',
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userInitials, setUserInitials] = useState('U')
  const [userAvatar, setUserAvatar] = useState('')

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

  // Load user avatar from profiles table
  useEffect(() => {
    const loadUserAvatar = async () => {
      if (!user?.id) return
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()
        if (data?.avatar_url) {
          setUserAvatar(data.avatar_url)
        }
      } catch (error) {
        console.error('Error loading avatar:', error)
      }
    }
    loadUserAvatar()
  }, [user?.id])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button - Floating */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#1a4d5c] to-[#5da6b8] hover:shadow-lg text-white rounded-xl shadow-lg transition-all active:scale-95"
        aria-label="Toggle menu"
        style={{ minWidth: '48px', minHeight: '48px' }}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobileOpen
            ? 'w-64 translate-x-0 fixed inset-y-0 left-0 z-40'
            : 'hidden md:flex md:relative md:w-64'
        } bg-white border-r border-[#E8ECEF] flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-8 border-b border-[#E8ECEF] flex-shrink-0 flex items-center justify-center">
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <Image
              src="/logoEspeak.png"
              alt="ESPeak Logo"
              width={100}
              height={100}
              className="rounded-lg w-auto h-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-[#0A4E5A]/10 to-[#7CC4E0]/10 border border-[#0A4E5A]/30 text-[#0A4E5A]'
                  : 'text-[#0A4E5A] hover:bg-[#E8ECEF] hover:text-[#0A4E5A]'
              }`}
              style={{ minHeight: '44px' }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Avatar - Bottom */}
        <div className="p-4 border-t border-[#E8ECEF] flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#E8ECEF] hover:bg-[#7CC4E0]/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white text-sm flex-shrink-0 bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0]">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-[#0A4E5A] truncate">{userName}</p>
                <p className="text-xs text-[#7CC4E0] truncate">Level B2</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-[#E8ECEF] z-50 overflow-hidden">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-[#0A4E5A] hover:bg-[#E8ECEF] text-sm border-b border-[#E8ECEF] transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#E0312D] hover:bg-[#E8ECEF] text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

