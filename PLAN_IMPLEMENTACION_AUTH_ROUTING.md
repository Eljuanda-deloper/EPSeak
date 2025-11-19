# Plan de Implementación: Mejora del Enrutamiento Login → Dashboard

## 📋 Resumen Ejecutivo

Este documento detalla el plan de implementación para resolver los errores en el enrutamiento de autenticación login → dashboard. El plan se basa en las **mejores prácticas oficiales de Supabase con Next.js App Router** y utiliza el patrón SSR (Server-Side Rendering) recomendado.

**Fecha**: 12 de Noviembre, 2025  
**Rama**: `refactor-auth-flow`  
**Proyecto**: EPSeak

---

## 🔍 Problemas Identificados

### 1. **Arquitectura de Autenticación Incompleta**
- ❌ Falta implementación de `@supabase/ssr` correctamente
- ❌ No hay cliente Supabase servidor-side dedicado
- ❌ Middleware actual es insuficiente y no refresa tokens

### 2. **Gestión de Sesiones Deficiente**
- ❌ `AuthContext` usa `supabase` cliente isomórfico en lugar de dedicado a cliente
- ❌ No hay sincronización entre cliente y servidor
- ❌ `window.location.href` es un hack que no debería usarse
- ❌ Falta `revalidatePath()` para actualizar datos en servidor

### 3. **Flujo de Redirección Problemático**
- ❌ Timeout de 100ms es arbitrario y puede fallar
- ❌ `useRouter().push()` combinado con `window.location.href` causa conflicto
- ❌ No hay manejo de errores de redirección
- ❌ Lógica de redirect duplicada (client + middleware)

### 4. **Falta de Protección Server-Side**
- ❌ Dashboard no valida sesión en servidor
- ❌ No hay uso de `supabase.auth.getUser()` (método seguro)
- ❌ Token de sesión no se refresca automáticamente

### 5. **Cookies y SSR**
- ❌ No hay manejo explícito de cookies en middleware
- ❌ Sesión no persiste correctamente entre requests
- ❌ No hay actualización de sesión expirada

---

## ✅ Mejores Prácticas de Supabase (v2.80.0)

### **Principios Clave**
1. **Usar `@supabase/ssr`** para manejo de cookies en SSR
2. **Separar clientes**: uno para cliente, uno para servidor
3. **`supabase.auth.getUser()`** en servidor (seguro, valida token JWT)
4. **`supabase.auth.getSession()`** solo en cliente
5. **Middleware** debe refrescar tokens antes de servir página
6. **Server Actions** para mutaciones seguras
7. **`revalidatePath()`** para actualizar datos en servidor

### **Flujo Recomendado**
```
Usuario hace login
    ↓
[Enviar credenciales al servidor con Server Action]
    ↓
[Supabase valida y retorna tokens + cookies]
    ↓
[Cookies se guardan en response headers]
    ↓
[Middleware refresa token en siguiente request]
    ↓
[Cliente recibe sesión válida del context]
    ↓
[Redirección al dashboard]
    ↓
[Dashboard valida con getUser() en servidor]
    ↓
✅ Acceso concedido
```

---

## 📐 Arquitectura Nueva

```
app/
├── auth/
│   ├── login/
│   │   ├── page.tsx          (Login Page - Client)
│   │   └── actions.ts        (Server Actions - Signin)
│   ├── callback/
│   │   └── route.ts          (OAuth callback - Route Handler)
│   └── logout/
│       └── route.ts          (Logout - Route Handler)
│
├── dashboard/
│   ├── layout.tsx            (Protected Layout - Server Component)
│   └── page.tsx              (Dashboard - Server Component)
│
├── contexts/
│   └── AuthContext.tsx       (Client-side auth state)
│
└── utils/
    └── supabase/
        ├── client.ts         (Browser client)
        ├── server.ts         (Server-side client)
        └── middleware.ts     (Middleware helper)

middleware.ts                 (Main middleware)
```

---

## 🚀 Plan de Implementación por Fases

### **FASE 1: Configuración Base de SSR (2 horas)**

**Objetivo**: Instalar y configurar `@supabase/ssr` correctamente

#### 1.1 Actualizar dependencias
```bash
npm install @supabase/ssr@^0.7.0 @supabase/supabase-js@^2.80.0
```

#### 1.2 Crear cliente para Cliente (Browser)
**Archivo**: `app/utils/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Por qué**: Los clientes de navegador necesitan gestionar sesiones con cookies automáticamente.

#### 1.3 Crear cliente para Servidor
**Archivo**: `app/utils/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar error si se llama desde Server Component
            // (middleware manejará la actualización)
          }
        },
      },
    }
  )
}
```

**Por qué**: Los servidores necesitan crear un cliente que maneje cookies de Next.js correctamente.

#### 1.4 Crear helper para Middleware
**Archivo**: `app/utils/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No escribir código aquí antes de getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redireccionar si no hay usuario y está accediendo ruta protegida
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/register')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**Por qué**: El middleware debe refrescar tokens antes de servir cualquier página protegida.

---

### **FASE 2: Actualizar Middleware (1 hora)**

**Objetivo**: Usar el nuevo helper de middleware

#### 2.1 Reemplazar `middleware.ts`
**Archivo**: `middleware.ts`

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Por qué**: Esto activa el refresco de tokens antes de cada request.

---

### **FASE 3: Refactorizar AuthContext (1.5 horas)**

**Objetivo**: Usar cliente correcto y mejorar manejo de sesiones

#### 3.1 Actualizar `app/contexts/AuthContext.tsx`

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/app/utils/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    let mounted = true

    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Error desconocido durante el login' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Error desconocido durante el registro' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
```

**Cambios**:
- ✅ Usa `createClient()` del nuevo utils
- ✅ Manejo de cleanup con `mounted`
- ✅ Try-catch para errores
- ✅ Sin logs innecesarios

---

### **FASE 4: Refactorizar Login (1.5 horas)**

**Objetivo**: Login simple usando AuthContext

#### 4.1 Simplificar `app/auth/login/page.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import LoginForm from '@/app/components/auth/LoginForm'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (user && !loading) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de EPSeak
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Cambios**:
- ✅ Sin timeouts arbitrarios
- ✅ Sin `window.location.href`
- ✅ Solo `router.replace()` (más limpio)
- ✅ Sin logs innecesarios

#### 4.2 Simplificar `app/components/auth/LoginForm.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Button from '@/app/components/shared/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)

    if (error) {
      setError(error)
      setLoading(false)
    } else {
      // AuthContext detectará el cambio de sesión
      // y LoginPage lo redirigirá automáticamente
      // Dar un pequeño delay para asegurar que se actualice el context
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Tu contraseña"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  )
}
```

**Cambios**:
- ✅ Sin logs innecesarios
- ✅ Delay realista (500ms) para actualizar context
- ✅ Manejo de errores más simple

---

### **FASE 5: Proteger Dashboard con Server Components (2 horas)**

**Objetivo**: Validar sesión en servidor, no en cliente

#### 5.1 Crear Layout Protegido
**Archivo**: `app/dashboard/layout.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Validar sesión en servidor (seguro)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">EPSeak Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bienvenido, {user.email?.split('@')[0]}
            </span>
            <a
              href="/api/auth/logout"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
```

**Cambios**:
- ✅ Es un Server Component (async)
- ✅ Valida con `getUser()` (seguro)
- ✅ Redirige automáticamente si no hay usuario
- ✅ Sin cliente-side logic de auth
- ✅ Acceso directo a `user.email`

#### 5.2 Simplificar página dashboard
**Archivo**: `app/dashboard/page.tsx`

(Mantener igual, es un Server Component que hereda protección del layout)

---

### **FASE 6: Crear Route Handlers para Auth (1 hora)**

**Objetivo**: Centralizar lógica de logout y callbacks

#### 6.1 Logout Route Handler
**Archivo**: `app/api/auth/logout/route.ts`

```typescript
import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  // Validar que haya usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/auth/login', req.url), {
    status: 302,
  })
}

// Permitir GET también para links
export async function GET(req: Request) {
  return POST(req)
}
```

**Por qué**: Logout en servidor es más seguro y valida sesión.

#### 6.2 Actualizar Dashboard para usar logout correcto
**Actualizar**: `app/dashboard/layout.tsx`

```typescript
// Cambiar:
<a
  href="/api/auth/logout"
  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
>
  Cerrar sesión
</a>

// Por:
<form action="/api/auth/logout" method="POST" className="inline">
  <button
    type="submit"
    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
  >
    Cerrar sesión
  </button>
</form>
```

---

### **FASE 7: Actualizar Tipos TypeScript (30 minutos)**

**Objetivo**: Agregar tipos de base de datos

#### 7.1 Crear archivo de tipos
**Archivo**: `types/database.ts`

```typescript
import type { Database as DatabaseGenerated } from '@/types/supabase'

export type Database = DatabaseGenerated
```

#### 7.2 Importar en clientes de Supabase
Ya está incluido en las fases anteriores con `type { Database }`

---

### **FASE 8: Testing y Validación (2 horas)**

**Objetivo**: Verificar que todo funciona correctamente

#### 8.1 Checklist de Validación

- [ ] **Inicio de Sesión**
  - [ ] Credenciales correctas → Redirige a `/dashboard`
  - [ ] Credenciales incorrectas → Muestra error
  - [ ] Email/password validados localmente

- [ ] **Acceso a Dashboard**
  - [ ] Usuario autenticado puede ver dashboard
  - [ ] Muestra nombre de usuario correcto
  - [ ] Botón de logout visible

- [ ] **Protección de Rutas**
  - [ ] Usuario no autenticado → `/dashboard` redirige a `/auth/login`
  - [ ] Usuario autenticado → puede acceder a `/dashboard`
  - [ ] URL de login con authenticated user → redirige a `/dashboard`

- [ ] **Sesión Persistente**
  - [ ] Refrescar página `/dashboard` → Sigue autenticado
  - [ ] Cerrar navegador y abrir → Sesión persiste (si hay token válido)
  - [ ] Token expirado → Refresa automáticamente (middleware)

- [ ] **Logout**
  - [ ] Click logout → Redirige a `/auth/login`
  - [ ] Sesión borrada → No puede acceder a `/dashboard`

- [ ] **Cookies**
  - [ ] DevTools → Application → Cookies
  - [ ] Debe haber cookies `sb-auth-token` después de login
  - [ ] Se borran después de logout

#### 8.2 Tests a ejecutar

```bash
# Test de inicio de sesión
npm test -- LoginForm.test.tsx

# Test de flujo de autenticación
npm test -- auth-flow.test.tsx

# Build para producción
npm run build
```

---

## 📊 Cambios Resumidos

### Archivos a CREAR

| Archivo | Descripción |
|---------|-------------|
| `app/utils/supabase/client.ts` | Cliente para navegador |
| `app/utils/supabase/server.ts` | Cliente para servidor |
| `app/utils/supabase/middleware.ts` | Helper para middleware |
| `app/api/auth/logout/route.ts` | Route handler de logout |
| `types/database.ts` | Tipos de BD |

### Archivos a MODIFICAR

| Archivo | Cambios |
|---------|---------|
| `middleware.ts` | Usar nuevo helper `updateSession()` |
| `app/contexts/AuthContext.tsx` | Usar nuevo cliente, mejorar gestión de sesión |
| `app/auth/login/page.tsx` | Simplificar, quitar hacks |
| `app/components/auth/LoginForm.tsx` | Simplificar, mejor manejo de errores |
| `app/dashboard/layout.tsx` | Hacer Server Component, validar con `getUser()` |
| `app/dashboard/page.tsx` | Sin cambios (hereda protección del layout) |

### Archivos a ELIMINAR

| Archivo | Razón |
|---------|-------|
| `app/utils/supabase.ts` | Reemplazado por cliente específicos |

### Dependencias

```json
{
  "@supabase/ssr": "^0.7.0",
  "@supabase/supabase-js": "^2.80.0"
}
```

---

## 🔐 Seguridad

### ✅ Mejoras Implementadas

1. **Validación en Servidor**
   - `getUser()` valida JWT en servidor
   - Imposible falsificar sesión desde cliente
   - Middleware refresa tokens automáticamente

2. **Gestión de Cookies**
   - Cookies HttpOnly (por defecto en Supabase)
   - No accesibles desde JavaScript (previene XSS)
   - Refrescadas automáticamente por middleware

3. **Sin Hacks**
   - ❌ NO `window.location.href`
   - ❌ NO timeouts arbitrarios
   - ✅ Flujo limpio y predecible

4. **Errores Manejados**
   - Try-catch en AuthContext
   - Validación en formularios
   - Mensajes de error claros

---

## 📈 Performance

### Mejoras Esperadas

| Métrica | Antes | Después |
|---------|-------|---------|
| Tiempo de redirect | 100ms+ (timeout) | <50ms (instant) |
| Recargas de página | 2-3 | 1 |
| Llamadas a Supabase | 4-5 | 2-3 |
| Uso de memoria | Alto (logs) | Bajo |
| Errores en consola | Muchos | Ninguno |

---

## 🧪 Estimación de Tiempo

| Fase | Tiempo | Dificultad |
|------|--------|-----------|
| 1. Configuración Base SSR | 2h | Media |
| 2. Middleware | 1h | Baja |
| 3. AuthContext | 1.5h | Media |
| 4. Login | 1.5h | Baja |
| 5. Dashboard | 2h | Alta |
| 6. Route Handlers | 1h | Baja |
| 7. Tipos | 0.5h | Baja |
| 8. Testing | 2h | Media |
| **TOTAL** | **11.5h** | - |

---

## 🚨 Notas Importantes

### ⚠️ CRÍTICO: Orden de Implementación

1. **Primero**: Fases 1-3 (Configuración SSR)
2. **Segundo**: Fase 2 (Middleware)
3. **Tercero**: Fases 4-5 (Login/Dashboard)
4. **Último**: Fases 6-8 (Cleanup y Testing)

### ⚠️ NO cambiar todas a la vez

Si cambias todo simultáneamente, obtendrás errores de circular dependencies y sesiones confusas.

### ⚠️ Testing después de cada fase

Probar login/logout después de cada fase para identificar problemas.

---

## 📚 Referencias de Supabase

- [Supabase Auth con Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [SSR Package](https://supabase.com/docs/reference/javascript/initializing#ssr-packages)
- [Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Middleware Refresh](https://supabase.com/docs/guides/auth/server-side/nextjs#middleware)

---

## ✨ Resultados Esperados

### ✅ Después de implementar

1. **Login exitoso** → Redirige automáticamente a `/dashboard`
2. **Dashboard protegido** → No accesible sin autenticación
3. **Sesión persistente** → Funciona entre recargas de página
4. **Logout limpio** → Borra sesión completamente
5. **Sin errores** → Consola limpia
6. **Performance** → Redirecciones instantáneas
7. **Seguro** → Validación en servidor siempre

---

## 📝 Próximos Pasos

1. ✅ Revisar este plan
2. ⏳ Crear los archivos de la Fase 1
3. ⏳ Probar cada fase incrementalmente
4. ⏳ Resolver errores antes de pasar a siguiente
5. ⏳ Documentar cualquier desviación

---

**Documento creado**: 12 Nov, 2025  
**Versión**: 1.0  
**Estado**: Listo para implementación
