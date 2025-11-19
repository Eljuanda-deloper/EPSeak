# Quick Start: Implementación del Plan (Checklist)

## ⚡ Resumen de 1 página

Este documento es para seguimiento rápido de la implementación del plan de autenticación.

---

## 📋 FASE 1: Configuración Base SSR (2h)

### ✅ Instalar dependencias
```bash
npm install @supabase/ssr@^0.7.0 @supabase/supabase-js@^2.80.0
```

### ✅ Crear `app/utils/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### ✅ Crear `app/utils/supabase/server.ts`
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
          } catch {
            // Ignorar si se llama desde Server Component
          }
        },
      },
    }
  )
}
```

### ✅ Crear `app/utils/supabase/middleware.ts`
**[Ver archivo completo en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 1.4]**

---

## 📋 FASE 2: Middleware (1h)

### ✅ Reemplazar `middleware.ts`
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

### ✅ Probar
```bash
npm run dev
# Ir a http://localhost:3000/dashboard sin login
# Debe redirigir a /auth/login
```

---

## 📋 FASE 3: AuthContext (1.5h)

### ✅ Reemplazar `app/contexts/AuthContext.tsx`
**[Ver código completo en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 3.1]**

**Cambios clave**:
- Usar `createClient()` del nuevo utils
- Agregar `mounted` flag en useEffect
- Agregar try-catch
- Quitar logs innecesarios

### ✅ Probar
```bash
npm run dev
# Abrir DevTools → Console
# No debe haber errores de auth
```

---

## 📋 FASE 4: Login (1.5h)

### ✅ Reemplazar `app/auth/login/page.tsx`
**[Ver código en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 4.1]**

**Cambios clave**:
- Quitar timeouts de 100ms
- Quitar `window.location.href`
- Solo usar `router.replace()`
- Quitar logs innecesarios

### ✅ Reemplazar `app/components/auth/LoginForm.tsx`
**[Ver código en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 4.2]**

**Cambios clave**:
- Timeout realista de 500ms
- Manejo de errores simple
- Quitar logs innecesarios

### ✅ Probar
```bash
npm run dev
# 1. Ir a http://localhost:3000/auth/login
# 2. Ingresar credenciales correctas
# 3. Debe redirigir a /dashboard automáticamente
# 4. Ingresar credenciales incorrectas
# 5. Debe mostrar error sin redirigir
```

---

## 📋 FASE 5: Dashboard (2h)

### ✅ Reemplazar `app/dashboard/layout.tsx`
**[Ver código completo en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 5.1]**

**Cambios clave**:
- Hacer Server Component (async)
- Usar `supabase.auth.getUser()`
- Redirect si no hay usuario
- Quitar useAuth() (no es Server Component)

### ✅ Probar
```bash
npm run dev
# 1. Sin login → /dashboard redirige a /login
# 2. Con login → /dashboard carga página
# 3. F5 (refresh) → Sigue autenticado
# 4. Logout visible
```

---

## 📋 FASE 6: Route Handlers (1h)

### ✅ Crear `app/api/auth/logout/route.ts`
**[Ver código completo en PLAN_IMPLEMENTACION_AUTH_ROUTING.md - Fase 6.1]**

### ✅ Actualizar Dashboard Layout
Cambiar logout a formulario POST en lugar de link.

### ✅ Probar
```bash
npm run dev
# 1. Login
# 2. Click "Cerrar sesión"
# 3. Debe redirigir a /login
# 4. /dashboard debe ser inaccesible
```

---

## 📋 FASE 7: Tipos (0.5h)

### ✅ Crear `types/database.ts`
```typescript
import type { Database as DatabaseGenerated } from '@/types/supabase'
export type Database = DatabaseGenerated
```

### ✅ Ya está en uso en fases anteriores

---

## 📋 FASE 8: Testing (2h)

### ✅ Checklist de Validación

- [ ] Login exitoso → Dashboard
- [ ] Login fallido → Muestra error
- [ ] Dashboard sin login → Redirige a login
- [ ] Dashboard con login → Funciona
- [ ] F5 en dashboard → Sigue autenticado
- [ ] Logout → Redirige a login
- [ ] /dashboard después logout → Inaccesible
- [ ] DevTools → Cookies con sb-auth-token
- [ ] Consola sin errores

### ✅ Correr tests
```bash
npm test -- LoginForm.test.tsx
npm test -- auth-flow.test.tsx
npm run build
```

---

## 🚀 Quick Links

| Documento | Propósito |
|-----------|----------|
| `PLAN_IMPLEMENTACION_AUTH_ROUTING.md` | Plan completo con detalles |
| `TROUBLESHOOTING_AUTH.md` | Soluciones a problemas comunes |
| Este documento | Checklist rápido |

---

## ⚠️ Errores Más Comunes

### "Usuario no redirige después de login"
→ Revisar Troubleshooting #1 y Fase 4

### "Middleware redirige infinitamente"
→ Revisar Troubleshooting #2 y Fase 2

### "Sesión se pierde al refrescar"
→ Revisar Troubleshooting #3 y Fase 5

### "useAuth no funciona"
→ Revisar Troubleshooting #4 - Fase 3

### "Cookies vacías"
→ Revisar Troubleshooting #5 - Fase 1

---

## 📞 Contacto

Si algo no funciona:

1. ✅ Revisar checklist anterior
2. ✅ Buscar en TROUBLESHOOTING_AUTH.md
3. ✅ Revisar logs en console
4. ✅ Revisar archivo en PLAN_IMPLEMENTACION_AUTH_ROUTING.md
5. ❓ Preguntar

---

## ✨ Después de Completar

✅ Documento generado: 12 Nov, 2025  
✅ Basado en: Mejores prácticas de Supabase v2.80.0  
✅ Next.js: App Router  
✅ Stack: TypeScript + React 18 + Tailwind

**¡Listo para implementar!**
