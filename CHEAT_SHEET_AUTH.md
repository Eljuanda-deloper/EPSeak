# 📋 CHEAT SHEET: Implementación Auth Routing

## 🎯 1 Página de Referencia Rápida

### Problemas (¿Por qué está roto?)

```
❌ ANTES (Actual)              ✅ DESPUÉS (Objetivo)
─────────────────────────────  ─────────────────────────────
Timeout 100ms              →   Redirección instant
window.location.href       →   router.replace()
AuthContext en cliente     →   Server Component + getUser()
Sin middleware token       →   Middleware refresa tokens
Cookies perdidas           →   Cookies sincronizadas
```

---

## 📂 Archivos a Crear (5)

```bash
# 1. Cliente para navegador
app/utils/supabase/client.ts
→ Gestiona sesión en browser

# 2. Cliente para servidor
app/utils/supabase/server.ts
→ Valida sesión en servidor

# 3. Helper para middleware
app/utils/supabase/middleware.ts
→ Refresa tokens automáticamente

# 4. Route handler logout
app/api/auth/logout/route.ts
→ Cierra sesión segura

# 5. Tipos base de datos
types/database.ts
→ TypeScript support
```

---

## ✏️ Archivos a Modificar (6)

| Archivo | Qué cambiar | Líneas |
|---------|-----------|--------|
| `middleware.ts` | Usar `updateSession()` helper | ~10 |
| `AuthContext.tsx` | Usar cliente SSR + cleanup | ~80 |
| `login/page.tsx` | Quitar timeout + window.location | ~60 |
| `LoginForm.tsx` | Simplificar lógica | ~50 |
| `dashboard/layout.tsx` | Server Component + getUser() | ~60 |
| `supabase.ts` | ELIMINAR (reemplazado) | - |

---

## 🚀 Las 8 Fases Resumidas

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: Configuración Base (2h)                             │
│ ├─ Instalar @supabase/ssr                                   │
│ ├─ Crear app/utils/supabase/client.ts                       │
│ ├─ Crear app/utils/supabase/server.ts                       │
│ └─ Crear app/utils/supabase/middleware.ts                   │
├─────────────────────────────────────────────────────────────┤
│ FASE 2: Middleware (1h)                                     │
│ └─ Reemplazar middleware.ts                                 │
├─────────────────────────────────────────────────────────────┤
│ FASE 3: AuthContext (1.5h)                                  │
│ └─ Refactorizar app/contexts/AuthContext.tsx                │
├─────────────────────────────────────────────────────────────┤
│ FASE 4: Login (1.5h)                                        │
│ ├─ Simplificar app/auth/login/page.tsx                      │
│ └─ Simplificar app/components/auth/LoginForm.tsx            │
├─────────────────────────────────────────────────────────────┤
│ FASE 5: Dashboard (2h)                                      │
│ └─ Hacer Server Component: app/dashboard/layout.tsx         │
├─────────────────────────────────────────────────────────────┤
│ FASE 6: Route Handlers (1h)                                 │
│ └─ Crear app/api/auth/logout/route.ts                       │
├─────────────────────────────────────────────────────────────┤
│ FASE 7: Tipos (0.5h)                                        │
│ └─ Crear types/database.ts                                  │
├─────────────────────────────────────────────────────────────┤
│ FASE 8: Testing (2h)                                        │
│ └─ Validar todo funciona                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Código Mínimo por Fase

### FASE 1.1: client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### FASE 1.2: server.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
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
          } catch {}
        },
      },
    }
  )
}
```

### FASE 2: middleware.ts (Simplificado)
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

### FASE 3: AuthContext (Cambios clave)
```typescript
'use client'
import { createClient } from '@/app/utils/supabase/client'  // ← CAMBIO

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()  // ← CAMBIO

  useEffect(() => {
    let mounted = true  // ← CAMBIO: Cleanup flag

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) setUser(session?.user ?? null)  // ← CAMBIO
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setUser(session?.user ?? null)  // ← CAMBIO
      }
    )

    return () => {  // ← CAMBIO: Cleanup
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])  // ← CAMBIO: Dependencia

  // ... resto igual ...
}
```

### FASE 4: Login Page (Cambios clave)
```typescript
'use client'
export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.replace('/dashboard')  // ← CAMBIO: Limpio
    }
  }, [user, loading, router])

  // ← CAMBIO: QUITAR setTimeout y window.location.href
  // ← CAMBIO: El resto es igual
}
```

### FASE 5: Dashboard Layout (Cambios clave)
```typescript
// ← CAMBIO: Sin 'use client', es Server Component
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export default async function DashboardLayout({ children }) {  // ← CAMBIO: async
  const supabase = await createClient()  // ← CAMBIO: server client
  
  // ← CAMBIO: Validación en servidor (segura)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')  // ← CAMBIO: redirect() de Next.js
  }

  return (
    <div>
      <header>
        <span>{user.email}</span>
        <form action="/api/auth/logout" method="POST">  {/* ← CAMBIO */}
          <button type="submit">Logout</button>
        </form>
      </header>
      {children}
    </div>
  )
}
```

---

## ✅ Testing por Fase

```bash
# Después de Fase 1
npm run dev
# Ir a http://localhost:3000/dashboard
# Debe redirigir a /login (middleware funciona)

# Después de Fase 3-4
npm run dev
# 1. Login con credenciales correctas
# 2. Debe ir a /dashboard
# 3. F5 (refresh)
# 4. Debe seguir autenticado

# Después de Fase 5
npm run dev
# 1. Sin login: /dashboard → /login (OK)
# 2. Con login: /dashboard → carga (OK)
# 3. Logout button visible

# Después de Fase 8
npm test
npm run build
# No errores
```

---

## 🐛 Errores Más Comunes (Soluciones Rápidas)

| Error | Solución |
|-------|----------|
| `createClient is not a function` | Revisar imports, usar `@/app/utils/supabase/client` |
| `useAuth must be within provider` | Verificar AuthProvider en layout.tsx |
| Infinite redirect loop | Revisar middleware Phase 2, debe tener `getUser()` |
| Cookies vacías | Usar `createBrowserClient` en client.ts |
| Sesión se pierde en F5 | Dashboard debe validar en servidor |
| Login no redirige | Revisar LoginForm timeout, usar 500ms mín |

---

## 📊 Métricas de Éxito

```
✅ Checklist Post-Implementación

Login Exitoso:
  ✓ Credenciales correctas → Dashboard
  ✓ Credenciales incorrectas → Error
  ✓ Sin timeout arbitrario
  ✓ SPA navigation (no reload)

Dashboard Protegido:
  ✓ Sin login → Redirige a /login
  ✓ Con login → Accesible
  ✓ F5 (refresh) → Sigue autenticado
  ✓ Logout funciona

Calidad:
  ✓ Console limpia (sin errores)
  ✓ Cookies con sb-auth-token
  ✓ 0 timeouts arbitrarios
  ✓ 0 window.location.href hacks
```

---

## ⏱️ Timeline Realista

```
SEMANA 1:
├─ Lunes: Leer documentos (2-3h)
├─ Martes: Fases 1-3 (5h)
├─ Miércoles: Fases 4-5 (5h)
└─ Jueves: Fases 6-8 (3h)

TOTAL: 11.5 horas de trabajo
```

---

## 🎯 Decisiones Clave

```
¿Tengo tiempo ahora?                    → SÍ: Empieza Fase 1
                                          NO: Planifica mañana

¿Hay errores críticos?                  → SÍ: TROUBLESHOOTING_AUTH.md
                                          NO: Plan normal

¿Soy nuevo en Supabase?                 → SÍ: Lee PLAN completo
                                          NO: Usa QUICK_START

¿Algo no funciona en Fase X?            → STOP, no continúes
                                          Revisa, arregla, test
```

---

## 📚 Documents Rápidos

```
Necesito...                             Leer...
────────────────────────────────────────────────────────────
Visión general                          RESUMEN_EJECUTIVO_AUTH.md
Plan completo                           PLAN_IMPLEMENTACION_AUTH_ROUTING.md
Checklist rápido                        QUICK_START_AUTH.md
Ver diferencias de código               COMPARATIVA_ANTES_DESPUES.md
Resolver un bug                         TROUBLESHOOTING_AUTH.md
Preguntas generales                     MATRIZ_DECISIONES_FAQ.md
Decidir qué leer                        INDICE_MAESTRO.md
```

---

## 🚀 Comando de Inicio

```bash
# 1. Prepararse
git checkout -b fix/auth-routing

# 2. Crear carpeta para Phase 1
mkdir -p app/utils/supabase

# 3. Crear archivos (ver código arriba)
# 4. Cada archivo = un commit

git add app/utils/supabase/client.ts
git commit -m "Fase 1.1: Crear cliente SSR para browser"

# 5. Testear
npm run dev

# 6. Continuar con Fase 2, etc.
```

---

## 💡 Pro Tips

1. **Haz commit después de cada fase** (no al final)
2. **Test después de cada cambio** (no esperes hasta final)
3. **Imprime QUICK_START_AUTH.md** (consulta mientras trabajas)
4. **Abre DevTools → Console** (vigila errores)
5. **Si algo falla** (revert inmediato, no intentes arreglar)

---

## ❌ ERRORES a NO COMETER

```
❌ NO: Cambiar todo de una vez
✅ SÍ: Una fase a la vez

❌ NO: Confiar en window.location.href
✅ SÍ: Usar router.push() / router.replace()

❌ NO: Validar sesión solo en cliente
✅ SÍ: Validar con getUser() en servidor

❌ NO: Usar getSession() para seguridad
✅ SÍ: Usar getUser() que valida JWT

❌ NO: Ignorar errores de console
✅ SÍ: Investigar y resolver cada uno

❌ NO: Saltar testing
✅ SÍ: Test después de cada fase
```

---

## 📞 Ayuda Rápida

```
¿Qué leer primero?              → INDICE_MAESTRO.md
¿Cómo hacer Fase X?             → PLAN_IMPLEMENTACION_AUTH_ROUTING.md
¿Cómo arreglar Error Y?         → TROUBLESHOOTING_AUTH.md
¿Cuánto tiempo toma?            → MATRIZ_DECISIONES_FAQ.md #1
¿Tengo riesgo?                  → MATRIZ_DECISIONES_FAQ.md #7
¿Cómo sé si está bien?          → QUICK_START_AUTH.md Testing
¿Qué cambió en código?          → COMPARATIVA_ANTES_DESPUES.md
```

---

## ✨ Bonus: Estructura Post-Implementación

```
app/
├── api/
│   └── auth/
│       └── logout/
│           └── route.ts          ✅ Route handler
├── contexts/
│   └── AuthContext.tsx           ✅ Refactorizado
├── dashboard/
│   └── layout.tsx                ✅ Server Component
├── auth/
│   └── login/
│       └── page.tsx              ✅ Simplificado
├── components/auth/
│   └── LoginForm.tsx             ✅ Simplificado
└── utils/
    └── supabase/
        ├── client.ts             ✅ NUEVO
        ├── server.ts             ✅ NUEVO
        └── middleware.ts         ✅ NUEVO

middleware.ts                     ✅ Actualizado
types/
└── database.ts                   ✅ NUEVO

# ELIMINADO:
# app/utils/supabase.ts (reemplazado por 3 archivos específicos)
```

---

**Fecha**: 12 Nov, 2025  
**Version**: 1.0  
**Tipo**: Cheat Sheet (Referencia Rápida)

---

**👉 Siguiente**: Abre PLAN_IMPLEMENTACION_AUTH_ROUTING.md Fase 1 y empieza

**¡Adelante! 🚀**
