'use client'

import { useState, useEffect } from 'react'
import { Home, BookOpen, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/app/utils/supabase/client'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userInitials, setUserInitials] = useState('U')
  const [userAvatar, setUserAvatar] = useState('')

  const links: Links[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <Home className="text-slate-600 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: "Modules",
      href: "/dashboard/modules",
      icon: (
        <BookOpen className="text-slate-600 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <Settings className="text-slate-600 h-6 w-6 flex-shrink-0" />
      ),
    },
  ]

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

  const Logo = () => {
    return (
      <Link
        href="/dashboard"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <Image
          src="/logoEspeak.png"
          alt="ESPeak Logo"
          width={50}
          height={50}
          className="rounded-lg"
          style={{ height: 'auto' }}
        />
        <span className="font-medium text-black dark:text-white whitespace-pre">
          ESPeak
        </span>
      </Link>
    );
  };

  const LogoIcon = () => {
    return (
      <Link
        href="/dashboard"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <Image
          src="/logoEspeak.png"
          alt="ESPeak Logo"
          width={30}
          height={30}
          className="rounded-lg"
          style={{ height: 'auto' }}
        />
      </Link>
    );
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className={cn(
                  pathname === link.href && "bg-slate-200 shadow-sm border-l-4 border-blue-500"
                )}
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: userName,
              href: "/profile",
              icon: userAvatar ? (
                <Image
                  src={userAvatar}
                  className={cn("flex-shrink-0 rounded-full shadow-md border-2 border-white object-cover", open ? "h-9 w-9" : "h-10 w-10")}
                  width={open ? 36 : 40}
                  height={open ? 36 : 40}
                  alt="Avatar"
                />
              ) : (
                <div className={cn("rounded-full bg-gradient-to-br from-[#0A4E5A] to-[#7CC4E0] flex items-center justify-center text-white text-sm font-semibold shadow-md border-2 border-white", open ? "h-9 w-9" : "h-10 w-10")}>
                  {userInitials}
                </div>
              ),
            }}
          />
          <button
            onClick={signOut}
            className="flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-lg hover:bg-slate-100 hover:shadow-sm transition-all duration-200 w-full"
          >
            <LogOut className="text-slate-600 h-6 w-6 flex-shrink-0" />
            <span className="text-slate-700 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 font-medium">
              Logout
            </span>
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

