# Guía de Troubleshooting: Autenticación Login → Dashboard

## 🐛 Errores Comunes y Soluciones

---

## 1. "Usuario no se redirige después de login exitoso"

### Síntomas
- ✋ Login parece funcionar pero no redirige a dashboard
- ✋ Página de login se queda en estado "Redirigiendo..."
- ✋ Console muestra "Timeout callback executing" repetidamente

### Causas Raíz

**Problema 1**: AuthContext no se está actualizando

```typescript
// ❌ MAL - useEffect sin dependencias se ejecuta una vez
useEffect(() => {
  supabase.auth.onAuthStateChange(...)
}, []) // Falta supabase como dependencia

// ✅ BIEN - pero hay que evitar infinite loops
useEffect(() => {
  const getSession = async () => { ... }
}, [supabase])
```

**Problema 2**: `window.location.href` causa conflicto con Next.js router

```typescript
// ❌ MAL - Mezclar dos formas de navegación
window.location.href = redirectTo  // Full page reload
router.push(redirectTo)             // SPA navigation
// Esto causa comportamiento impredecible

// ✅ BIEN - Solo una forma
router.replace('/dashboard')  // Clean SPA navigation
```

**Problema 3**: Timeout es muy corto

```typescript
// ❌ MAL - 100ms no es suficiente para actualizar context
setTimeout(() => {
  window.location.href = fullUrl
}, 100)

// ✅ BIEN - 500ms para actualización de context + redirect
setTimeout(() => {
  router.push('/dashboard')
}, 500)
```

### Solución

Seguir la **Fase 4** del plan: Refactorizar Login con código limpio.

---

## 2. "Middleware redirige infinitamente a /auth/login"

### Síntomas
- ✋ Loop infinito: `/dashboard` → `/auth/login` → `/dashboard`
- ✋ Página nunca carga
- ✋ Network tab muestra redirecciones recursivas

### Causas Raíz

**Problema 1**: Middleware no refresa tokens correctamente

```typescript
// ❌ MAL - No validar sesión
export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Redirige sin validar si hay token válido
    return redirect('/auth/login')
  }
}

// ✅ BIEN - Refrescar token primero
export async function middleware(req) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return redirect('/auth/login')
  }
}
```

**Problema 2**: Cookies no se actualizan en response

```typescript
// ❌ MAL - Response no tiene cookies actualizadas
let supabaseResponse = NextResponse.next()
const supabase = createServerClient(...) {
  cookies: {
    setAll(cookiesToSet) {
      // Cookies se pierden en NextResponse
    }
  }
}

// ✅ BIEN - Copiar cookies a response
let supabaseResponse = NextResponse.next({ request })
// ... setup createServerClient ...
cookiesToSet.forEach(({ name, value, options }) =>
  supabaseResponse.cookies.set(name, value, options)
)
```

**Problema 3**: Matcher del middleware excluye rutas que necesitan protección

```typescript
// ❌ MAL - Excluye `/dashboard`
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|dashboard).*)'
  ]
}

// ✅ BIEN - Solo excluir assets estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

### Solución

Seguir la **Fase 2** del plan: Reemplazar middleware correctamente.

---

## 3. "Sesión se pierde al refrescar la página"

### Síntomas
- ✋ Puede acceder a `/dashboard`
- ✋ Si presiona F5 (refresh), se redirige a `/auth/login`
- ✋ Cookies desaparecen después de refresh

### Causas Raíz

**Problema 1**: AuthContext no inicializa sesión al cargar

```typescript
// ❌ MAL - Solo confía en event listener
useEffect(() => {
  const { subscription } = supabase.auth.onAuthStateChange(...)
  // No se obtiene sesión inicial
}, [])

// ✅ BIEN - Obtener sesión inicial
useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
  }
  getSession()
  
  const { subscription } = supabase.auth.onAuthStateChange(...)
}, [])
```

**Problema 2**: Cliente isomórfico no maneja cookies correctamente

```typescript
// ❌ MAL - Usar cliente isomórfico en servidor
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)  // No gestiona cookies

// ✅ BIEN - Usar @supabase/ssr
import { createBrowserClient } from '@supabase/ssr'
const supabase = createBrowserClient(url, key)  // Gestiona cookies
```

**Problema 3**: Dashboard no valida sesión en servidor

```typescript
// ❌ MAL - Confiar solo en cliente
export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Redirect />
  // User podría ser null transitoriamente
}

// ✅ BIEN - Validar en servidor
export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  // User SIEMPRE existe aquí
}
```

### Solución

Seguir **Fases 1 y 5** del plan: Configurar SSR y proteger dashboard.

---

## 4. "Error: 'useAuth must be used within AuthProvider'"

### Síntomas
- ✋ Página crashea con error durante render
- ✋ Stack trace apunta a `useAuth()` hook
- ✋ Solo sucede en ciertos componentes

### Causas Raíz

**Problema 1**: AuthProvider no envuelve la aplicación

```typescript
// ❌ MAL - ClientProviders no incluye AuthProvider
export function ClientProviders({ children }) {
  return <MotionConfig>{children}</MotionConfig>
}

// ✅ BIEN - AuthProvider incluido
export function ClientProviders({ children }) {
  return (
    <MotionConfig>
      <AuthProvider>{children}</AuthProvider>
    </MotionConfig>
  )
}
```

**Problema 2**: useAuth se usa en componente servidor

```typescript
// ❌ MAL - Client hook en Server Component
export default async function Dashboard() {
  const { user } = useAuth()  // Error!
}

// ✅ BIEN - Usar en Client Component
'use client'
export default function Dashboard() {
  const { user } = useAuth()  // OK
}
```

**Problema 3**: Componente no está bajo ClientProviders

```typescript
// ❌ MAL - Estructura
app/
├── layout.tsx (Server)
├── page.tsx (usa useAuth) ← Error!
└── providers.tsx

// ✅ BIEN - Estructura
app/
├── layout.tsx (Server)
└── [children wrapping ClientProviders]
    └── page.tsx ('use client')
```

### Solución

Asegurarse que:
1. `app/layout.tsx` usa `<ClientProviders>`
2. Componentes que usan `useAuth()` tienen `'use client'`
3. AuthProvider está en `ClientProviders`

---

## 5. "Cookies no se guardan - devTools show empty"

### Síntomas
- ✋ DevTools → Application → Cookies está vacío
- ✋ Después de login, no hay `sb-auth-token`
- ✋ Sesión se pierde al cerrar navegador

### Causas Raíz

**Problema 1**: Cliente no usa @supabase/ssr

```typescript
// ❌ MAL - Cliente isomórfico no maneja cookies
import { createClient } from '@supabase/supabase-js'

// ✅ BIEN - Cliente SSR maneja cookies
import { createBrowserClient } from '@supabase/ssr'
```

**Problema 2**: Respuesta del servidor no retorna cookies

```typescript
// ❌ MAL - NextResponse sin cookies
return NextResponse.next()

// ✅ BIEN - Incluir cookies de Supabase
let response = NextResponse.next()
response.cookies.set('sb-auth-token', token, options)
return response
```

**Problema 3**: SameSite policy demasiado restrictiva

```typescript
// ❌ MAL - SameSite demasiado estricto
response.cookies.set('sb-auth-token', token, {
  sameSite: 'Strict'  // No se guarda en cross-site
})

// ✅ BIEN - SameSite Lax por defecto en Supabase
// (Supabase maneja esto automáticamente)
```

### Solución

1. Verificar que se usa `createBrowserClient` en cliente
2. Verificar que middleware actualiza cookies correctamente
3. Abrir DevTools → Application → Cookies → localhost:3000
4. Después de login, debe aparecer `sb-auth-token` y `sb-refresh-token`

---

## 6. "Error: 'createClient is not a function'"

### Síntomas
- ✋ RuntimeError durante build o ejecución
- ✋ Stack trace: `createClient is not a function`
- ✋ Sucede en archivo de utils/supabase

### Causas Raíz

**Problema 1**: Importación incorrecta

```typescript
// ❌ MAL - Importar defecto sin ser default export
import createClient from '@supabase/supabase-js'

// ✅ BIEN - Importar específico
import { createClient } from '@supabase/supabase-js'

// ✅ BIEN - Usar @supabase/ssr
import { createBrowserClient } from '@supabase/ssr'
```

**Problema 2**: Archivo utils/supabase.ts viejo todavía en uso

```typescript
// ❌ MAL - Seguir usando archivo viejo
import { supabase } from '@/app/utils/supabase'

// ✅ BIEN - Usar nuevos archivos
import { createClient } from '@/app/utils/supabase/client'
import { createClient } from '@/app/utils/supabase/server'
```

**Problema 3**: Path incorrecto

```typescript
// ❌ MAL - Path relativo confuso
import { createClient } from './supabase'

// ✅ BIEN - Path absoluto
import { createClient } from '@/app/utils/supabase/client'
```

### Solución

1. Eliminar `app/utils/supabase.ts` viejo
2. Usar paths absolutos con `@/`
3. Verificar que archivos en `app/utils/supabase/` existen

---

## 7. "CORS Error: Access to XMLHttpRequest blocked"

### Síntomas
- ✋ Error en DevTools Console
- ✋ Red tab muestra request bloqueado
- ✋ Status: Blocked by CORS policy

### Causas Raíz

**Problema 1**: Environment variables no están configuradas

```typescript
// ❌ MAL - Variables undefined
process.env.NEXT_PUBLIC_SUPABASE_URL  // undefined
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // undefined

// ✅ BIEN - Verificar .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Problema 2**: URL de Supabase mal configurada

```typescript
// ❌ MAL - URL sin trailing slash (a veces)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co/

// ✅ BIEN - URL completa y correcta
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

**Problema 3**: Proyect Supabase no existe o está apagado

- Verificar que proyecto existe en dashboard.supabase.com
- Verificar que no está suspendido
- Verificar que anon key es válida

### Solución

1. Copiar URL y Anon Key de Supabase Dashboard
2. Pegar en `.env.local`
3. Reiniciar servidor: `npm run dev`
4. Verificar que variables se cargan: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`

---

## 8. "Error: invalid_grant - Invalid email or password"

### Síntomas
- ✋ Login muestra error "Invalid email or password"
- ✋ Credenciales son correctas en DB
- ✋ Error sucede después de actualizar AuthContext

### Causas Raíz

**Problema 1**: Cliente Supabase no configurado para sign in

```typescript
// ❌ MAL - Cliente sin persistSession
const supabase = createClient(url, key)

// ✅ BIEN - Cliente con auth options
const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

**Problema 2**: Usuario no existe en Supabase Auth

- Verificar en Supabase Dashboard → Authentication → Users
- Crear usuario de prueba si no existe
- Usar mismo email y password para login

**Problema 3**: Contraseña demasiado simple

Supabase requiere:
- Mínimo 6 caracteres
- Mix de mayúsculas y minúsculas recomendado
- Caracteres especiales ayudan

### Solución

1. Ir a Supabase Dashboard
2. Crear usuario con email fuerte y password >6 caracteres
3. Intentar login con esas credenciales
4. Si error persiste, revisar console para más detalles

---

## 9. "Memory Leak: Can't perform React state update on unmounted component"

### Síntomas
- ✋ Warning en console durante desarrollo
- ✋ "Cannot update a component while rendering a different component"
- ✋ State updates en useEffect sin cleanup

### Causas Raíz

**Problema 1**: useEffect sin cleanup adecuado

```typescript
// ❌ MAL - Sin tracking de mount status
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setUser(data.user)  // Puede ejecutarse después de unmount
  })
}, [])

// ✅ BIEN - Con tracking de mount
useEffect(() => {
  let mounted = true

  supabase.auth.getSession().then(({ data }) => {
    if (mounted) {
      setUser(data.user)
    }
  })

  return () => { mounted = false }
}, [])
```

**Problema 2**: Subscription no se desuscribe

```typescript
// ❌ MAL - Sin cleanup de subscription
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  // Falta unsubscribe
}, [])

// ✅ BIEN - Con cleanup
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  return () => subscription.unsubscribe()
}, [])
```

### Solución

Ver **Fase 3** del plan: Refactorizar AuthContext con cleanup adecuado.

---

## 10. "Network Error: Failed to fetch"

### Síntomas
- ✋ Red tab muestra requests fallando
- ✋ Console: "Failed to fetch"
- ✋ Sucede en producción pero no en desarrollo

### Causas Raíz

**Problema 1**: API de Supabase no accesible desde cliente

- Firewall bloqueando requests
- VPN/Proxy interferencia
- ISP bloqueando supabase.co

**Problema 2**: Network timeout por conexión lenta

```typescript
// ✅ BIEN - Añadir timeout personalizado si necesario
const response = await Promise.race([
  supabase.auth.signInWithPassword({ email, password }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
])
```

**Problema 3**: Proyecto Supabase apagado por inactividad

- Supabase pausa proyectos free después de 1 semana sin actividad
- Ir a dashboard.supabase.com y reactivar

### Solución

1. Verificar conexión a internet
2. Intentar desde otra red/dispositivo
3. Verificar que proyecto en Supabase está activo
4. Revisar logs de Supabase Dashboard

---

## 🔍 Debug Tools

### Verificar Sesión

```typescript
// En console del navegador
const { data: { session } } = await supabase.auth.getSession()
console.log(session)
```

### Verificar User

```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log(user)
```

### Verificar Cookies

```javascript
// En console del navegador
document.cookie  // Mostrar todas las cookies
```

### Logs de Middleware

```typescript
// En middleware.ts, añadir logs
console.log('[Middleware] Request:', request.nextUrl.pathname)
console.log('[Middleware] User:', user?.email || 'null')
```

### Monitorear Network

1. DevTools → Network tab
2. Hacer login
3. Ver requests a `https://{project}.supabase.co/auth/...`
4. Revisar status code (200 OK = éxito, 401 = no autorizado)

---

## 📞 Cuando Nada Funciona

### Pasos Nucleares

1. **Limpiar caché**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

2. **Revisar .env.local**
   ```bash
   cat .env.local
   # Debe tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Revisar que proyecto Supabase existe**
   - Ir a dashboard.supabase.com
   - Verificar que proyecto está activo

4. **Revertir a versión funcionante**
   ```bash
   git log --oneline | head -20
   git checkout <commit-que-funcionaba>
   npm run dev
   ```

5. **Crear usuario de prueba en Supabase**
   - Dashboard → Authentication → Users → Add User
   - Email: test@example.com
   - Password: TestPassword123!

6. **Probar con curl**
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPassword123!"}' \
     https://{project}.supabase.co/auth/v1/token?grant_type=password
   ```

---

## 📝 Reporte de Bug

Si ninguno de estos pasos funciona, reportar bug con:

```markdown
## Bug: [Descripción]

### Versiones
- Next.js: [versión]
- @supabase/supabase-js: [versión]
- @supabase/ssr: [versión]
- Node: [versión]

### Pasos para reproducir
1. ...
2. ...
3. ...

### Error en console
[Stack trace completo]

### .env.local (sin valores sensibles)
```

---

**Última actualización**: 12 Nov, 2025
