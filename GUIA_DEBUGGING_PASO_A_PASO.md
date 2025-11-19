# 🐛 Guía de Debugging Paso a Paso

## Problema 1: "Rendered fewer hooks than expected"

### ¿Qué significa?
React esperaba ejecutar X hooks, pero ejecutó Y (donde Y < X). Esto causa inconsistencia en el árbol de renderizado.

### ¿Dónde buscar?
```
Error stack trace menciona:
  - updateFunctionComponent (react-dom.development.js)
  - renderWithHooks (react-dom.development.js:10717)
  
Esto significa: Un componente funcional tiene un problema con sus hooks
```

### Checklist de Debugging:

#### ✅ Paso 1: Identifica el componente problemático
En el stack trace, busca líneas como:
```
at Header (webpack-internal:///(app-pages-browser)/./app/components/layout/Header.tsx:31:82)
at AuthProvider (webpack-internal:///(app-pages-browser)/./app/contexts/AuthContext.tsx:16:11)
```

**Componentes afectados en tu caso**:
- `Header.tsx` ← Principal culpable
- `AuthProvider` ← Secundario
- `HotReload` ← Síntoma, no causa

#### ✅ Paso 2: Revisa si hay hooks condicionales
En `Header.tsx`, busca patrones como:

```tsx
// ❌ MALO: Hook dentro de condicional
if (isInDashboard) {
  const { scrollY } = useScroll();  // ¡NO!
}

// ❌ MALO: Hook después de return temprano
if (condition) return null;
const { scrollY } = useScroll();  // ¡NO!

// ✅ BUENO: Todos los hooks al inicio
const { scrollY } = useScroll();
if (condition) return null;  // Return después
```

#### ✅ Paso 3: Revisa el orden de ejecución
```tsx
// Orden correcto:
const Header = () => {
  // 1. PRIMERO: Estados
  const [state1] = useState();
  const [state2] = useState();
  
  // 2. SEGUNDO: Hooks de framer-motion/otros
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, ...);
  
  // 3. TERCERO: Lógica (sin hooks)
  const isInDashboard = pathname.startsWith('/dashboard');
  
  // 4. CUARTO: useEffect
  useEffect(() => {
    if (isInDashboard) return;
    // ...
  }, [isInDashboard]);
  
  // 5. ÚLTIMO: Early returns
  if (isInDashboard) return null;
  
  // JSX
  return (...)
};
```

#### ✅ Paso 4: Verifica dependencias de useEffect
```tsx
// ❌ MALO: Dependencia faltante
useEffect(() => {
  if (isInDashboard) return;
  // isInDashboard cambió pero no está en dependencias
}, []);  // Vacío - MALO

// ✅ BUENO: Incluye todas las dependencias
useEffect(() => {
  if (isInDashboard) return;
  // ...
}, [isInDashboard]);  // Incluido - BIEN
```

---

## Problema 2: "Cannot update a component while rendering a different component"

### ¿Qué significa?
Componente A está actualizando su estado mientras Componente B está siendo renderizado. Esto causa que React pierda sincronización.

### ¿Dónde buscar?
```
Error menciona:
  - HotReload (está actualizando)
  - Header (mientras se renderiza)
```

### Checklist de Debugging:

#### ✅ Paso 1: Busca `createClient()` llamadas
```tsx
// ❌ MALO en AuthContext
const AuthProvider = ({ children }) => {
  const supabase = createClient();  // Nueva instancia CADA render
  
  useEffect(() => {
    // useEffect depende de supabase
    // supabase cambió → useEffect se ejecuta
    // setUser() causa re-render de componentes que usan useAuth()
    // Mientras Header está renderizando → ¡ERROR!
  }, [supabase]);  // supabase siempre diferente
};
```

#### ✅ Paso 2: Revisa inicialización de valores expensive
```tsx
// ❌ MALO: Se crea en cada render
const supabase = createClient();

// ✅ BUENO: Se crea solo una vez
const [supabase] = useState(() => createClient());
```

#### ✅ Paso 3: Busca múltiples llamadas a setState
```tsx
// En la consola, busca patrones como:
// setUser() → setLoading() → setUser() → setLoading()
// Si hay ciclos, hay un problema de dependencias
```

---

## Problema 3: "Please ensure that the container has a non-static position"

### ¿Qué significa?
Framer Motion `useScroll` intenta medir un contenedor, pero el contenedor tiene `position: static` (por defecto).

### ¿Dónde buscar?
```javascript
// En DevTools Elements, busca:
<main className="...">
  // ¿Tiene position: relative/fixed/absolute?
</main>
```

### Checklist de Debugging:

#### ✅ Paso 1: Identifica el selector con useScroll
```tsx
const { scrollY } = useScroll();  // Mide el body/documentElement
```

#### ✅ Paso 2: Verifica posición del contenedor
```tsx
// Layout.tsx
<main className="relative flex-1 ...">
  {/* Necesita "relative" */}
</main>
```

#### ✅ Paso 3: Alterna en DevTools para verificar
```javascript
// En Console:
const main = document.querySelector('main');
const style = window.getComputedStyle(main);
console.log(style.position);  // Debería ser "relative"
```

---

## 🧪 Herramientas de Debugging

### 1. React DevTools
```javascript
// En la consola, con React DevTools instalado:
$r  // Referencia del componente seleccionado en el árbol

// Ver props/estado:
$r.props
$r.state
```

### 2. Logging estratégico
```tsx
const Header = () => {
  console.log('Header: rendering');
  
  useEffect(() => {
    console.log('Header: useEffect mounted');
    return () => console.log('Header: useEffect cleanup');
  }, []);
  
  return (...)
};
```

### 3. Performance Profiler
```javascript
// DevTools → Profiler tab
// Graba un perfil y busca:
// - Componentes que se renderizan sin razón
// - useEffect que se ejecutan múltiples veces
// - Actualizaciones de estado inesperadas
```

### 4. Error Boundaries
Crear para ver exactamente dónde falla:
```tsx
class ErrorBoundary extends React.Component {
  state = { error: null };
  
  static getDerivedStateFromError(error) {
    return { error };
  }
  
  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}
```

---

## 📝 Checklist de Verificación Final

- [ ] No hay hooks dentro de condicionales
- [ ] Todos los hooks se ejecutan ANTES del early return
- [ ] useEffect tiene todas sus dependencias
- [ ] No hay `createClient()` directo (usa `useState(() => createClient())`)
- [ ] Contenedores con `useScroll` tienen `position: relative/fixed/absolute`
- [ ] Dependencias de useEffect en AuthContext están correctas
- [ ] No hay ciclos infinitos en DevTools Console
- [ ] React DevTools no muestra renders múltiples sin razón
- [ ] No hay warnings naranja en la consola
- [ ] No hay errores rojos en la consola

---

## 🆘 Si aún tienes problemas:

### 1. Reinicia completamente
```bash
# Cierra el servidor (Ctrl+C)
# Limpia caché
rm -rf .next

# Limpia node_modules si es necesario
rm -rf node_modules package-lock.json
npm install

# Reinicia
npm run dev
```

### 2. Verifica imports
```tsx
// ¿useScroll está importado?
import { useScroll } from 'framer-motion';

// ¿useAuth está importado?
import { useAuth } from '@/app/contexts/AuthContext';

// ¿Están todos los hooks importados?
import { useState, useEffect, useContext } from 'react';
```

### 3. Verifica que AuthProvider envuelve todo
```tsx
// En app/components/providers/ClientProviders.tsx
export function ClientProviders({ children }) {
  return (
    <MotionConfig>
      <AuthProvider>  {/* ¿Está aquí? */}
        {children}
      </AuthProvider>
    </MotionConfig>
  );
}
```

### 4. Última opción: Hard reload
```javascript
// En la consola:
window.location.reload(true);  // Hard refresh sin caché
```

