'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSwipeable } from 'react-swipeable'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  {
    id: 'courses',
    label: 'My Courses',
    icon: <BookOpen className="w-12 h-12" />,
    href: '/dashboard/courses',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-12 h-12" />,
    href: '/dashboard/settings',
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }
    handleOrientationChange()
    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  const isActive = (href: string) => pathname === href

  const hapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (window.innerWidth < 768) {
        setIsMobileOpen(false)
        hapticFeedback()
      }
    },
    onSwipedRight: () => {
      if (window.innerWidth < 768) {
        setIsMobileOpen(true)
        hapticFeedback()
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  return (
    <>
      {/* Mobile Menu Button - Floating Bottom Right */}
      <button
        onClick={() => {
          setIsMobileOpen(!isMobileOpen)
          hapticFeedback()
        }}
        className="fixed bottom-4 right-4 z-50 md:hidden w-11 h-11 flex items-center justify-center bg-blue-400 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
        aria-label="Toggle menu"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
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
        {...swipeHandlers}
        className={`${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } bg-blue-600 border-r border-gray-200/20 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 overflow-hidden ${
          isMobileOpen
            ? 'w-64 translate-x-0 fixed inset-y-0 left-0 z-40'
            : 'hidden md:flex md:relative md:w-auto'
        }`}
      >
        {/* Logo */}
        <div className="p-2 md:p-3 border-b border-gray-200/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-bold text-white whitespace-nowrap">ESPeak</h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 md:px-3 py-2 md:py-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setIsMobileOpen(false)
                hapticFeedback()
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap text-sm ${
                isActive(item.href)
                  ? 'bg-blue-400 text-white shadow-md'
                  : 'text-white hover:bg-gray-200/20'
              }`}
              title={item.label}
              style={{ minHeight: '44px' }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200/20 p-2 md:p-3 flex-shrink-0">
          <button
            onClick={() => {
              const form = document.createElement('form')
              form.method = 'POST'
              form.action = '/api/auth/logout'
              document.body.appendChild(form)
              form.submit()
              hapticFeedback()
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-red-600/30 hover:text-white transition-colors duration-200 whitespace-nowrap text-sm"
            title="Logout"
            style={{ minHeight: '44px' }}
          >
            <LogOut className="w-12 h-12 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>

        {/* Collapse Button - Desktop only */}
        <div className="p-2 md:p-3 border-t border-gray-200/20 flex-shrink-0 hidden md:block">
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed)
              hapticFeedback()
            }}
            className="w-full flex items-center justify-center px-3 py-2 text-xs text-white hover:text-white hover:bg-gray-200/20 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
            style={{ minHeight: '44px' }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
