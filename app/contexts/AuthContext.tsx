'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/app/utils/supabase'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // ✅ CRÍTICO: Bandera para evitar múltiples redirecciones
  const redirectingRef = useRef(false)

  useEffect(() => {
    let isSubscribed = true;

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!isSubscribed) return;

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // ✅ NO redirigir desde AuthContext - dejar que los componentes manejen sus redirecciones
      console.log('🔄 Session loaded:', !!session, 'Path:', pathname)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          currentPath: pathname,
          urlParams: searchParams.toString()
        })

        if (!isSubscribed) return;

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // ✅ NO redirigir desde AuthContext - dejar que el componente maneje la redirección
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in successfully - letting component handle redirect')
        }

        // ✅ Redirigir al login después del logout
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out, redirecting to login')
          redirectingRef.current = false
          router.replace('/auth/login')
        }

        // ✅ Manejar token refresh fallido (sesión expirada)
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('⏰ Session expired, redirecting to login')
          redirectingRef.current = false
          router.replace('/auth/login')
        }
      }
    )

    return () => {
      isSubscribed = false
      subscription.unsubscribe()
    }
  }, [router, pathname, searchParams])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Calling Supabase signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Supabase response:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        error: error?.message
      })

      if (error) {
        console.error('❌ Supabase signIn error:', error)
        return { error: error.message }
      }

      if (data?.session) {
        console.log('✅ Session created successfully')
        // El onAuthStateChange manejará la redirección
      } else {
        console.warn('⚠️ No session in response')
      }

      return { error: undefined }
    } catch (err) {
      console.error('💥 Exception in signIn:', err)
      return { error: 'Error de conexión. Verifica tu conexión a internet.' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error: error?.message }
    } catch (err) {
      return { error: 'Error de conexión. Verifica tu conexión a internet.' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // El redirect será manejado por onAuthStateChange
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}