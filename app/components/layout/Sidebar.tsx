'use client'

import { useState } from 'react'
import { BookOpen, BookMarked, Users, Zap, Settings, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    icon: <BookOpen className="w-5 h-5" />,
    href: '/dashboard/courses',
  },
  {
    id: 'library',
    label: 'Library',
    icon: <BookMarked className="w-5 h-5" />,
    href: '/dashboard/library',
  },
  {
    id: 'community',
    label: 'Community',
    icon: <Users className="w-5 h-5" />,
    href: '/dashboard/community',
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    icon: <Zap className="w-5 h-5" />,
    href: '/dashboard/ai',
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 overflow-hidden md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">EPSeak</h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 whitespace-nowrap"
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </form>
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 hidden md:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-4 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
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
