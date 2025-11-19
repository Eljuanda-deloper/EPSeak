# 🛠️ Snippets de Código - Patrones Correctos

Este archivo contiene snippets de código que puedes reutilizar para evitar estos errores en futuros componentes.

---

## ✅ Patrón 1: Componente con Hooks Condicionales

### ❌ MALO
```tsx
const MyComponent = ({ showFeature }: { showFeature: boolean }) => {
  const [state, setState] = useState(0);
  
  // ❌ MALO: Hook después de lógica
  if (showFeature) {
    const { scrollY } = useScroll();  // ¡NO!
  }
  
  return <div>...</div>;
};
```

### ✅ BUENO
```tsx
const MyComponent = ({ showFeature }: { showFeature: boolean }) => {
  const [state, setState] = useState(0);
  
  // ✅ BUENO: Todos los hooks al inicio
  const { scrollY } = useScroll();
  
  useEffect(() => {
    if (!showFeature) {
      return;  // Condicional DENTRO del effect
    }
    
    // Lógica que depende del hook
    console.log(scrollY);
  }, [showFeature, scrollY]);
  
  if (!showFeature) {
    return null;  // Early return DESPUÉS de todos los hooks
  }
  
  return <div>...</div>;
};
```

---

## ✅ Patrón 2: Provider con Inicialización Expensive

### ❌ MALO
```tsx
const MyProvider = ({ children }: { children: React.ReactNode }) => {
  // ❌ MALO: Se crea en cada render
  const expensiveResource = expensiveFunction();
  
  useEffect(() => {
    // expensiveResource cambió → effect se ejecuta infinitamente
    setupResource(expensiveResource);
  }, [expensiveResource]);
  
  return (
    <Context.Provider value={expensiveResource}>
      {children}
    </Context.Provider>
  );
};
```

### ✅ BUENO
```tsx
const MyProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ BUENO: Se crea solo una vez
  const [expensiveResource] = useState(() => expensiveFunction());
  
  useEffect(() => {
    // expensiveResource nunca cambia → effect se ejecuta una vez
    setupResource(expensiveResource);
    
    return () => cleanupResource(expensiveResource);
  }, [expensiveResource]);
  
  return (
    <Context.Provider value={expensiveResource}>
      {children}
    </Context.Provider>
  );
};
```

---

## ✅ Patrón 3: Componente con useScroll

### ❌ MALO
```tsx
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isInDashboard = pathname.startsWith('/dashboard');
  
  // ❌ MALO: Hook después de lógica
  const { scrollY } = useScroll();
  
  if (isInDashboard) {
    return null;  // ❌ Early return antes del hook
  }
  
  return <header>...</header>;
};
```

### ✅ BUENO
```tsx
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // ✅ BUENO: Hook al inicio
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  
  const isInDashboard = pathname.startsWith('/dashboard');
  
  // ✅ BUENO: Condicional dentro del effect
  useEffect(() => {
    if (isInDashboard) return;
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInDashboard]);
  
  // ✅ BUENO: Early return después de hooks
  if (isInDashboard) {
    return null;
  }
  
  return (
    <motion.header style={{ opacity: headerOpacity }}>
      {/* content */}
    </motion.header>
  );
};
```

---

## ✅ Patrón 4: Context Provider Completo

### ✅ CORRECTO
```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/app/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 1️⃣ Estados
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 2️⃣ Recurso expensive - inicialización lazy
  const [supabase] = useState(() => createClient());

  // 3️⃣ useEffect - setup
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // 4️⃣ Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]); // ✅ Dependencia correcta (nunca cambia)

  // 5️⃣ Funciones
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Error desconocido durante el login' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // 6️⃣ Valor del contexto
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
  };

  // 7️⃣ Provider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 8️⃣ Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

---

## ✅ Patrón 5: Validación de Hooks en ESLint

### Configuración `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals"
  ],
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```

### Esto te alertará sobre:
```tsx
// ❌ ADVERTENCIA: Hook dentro de condicional
if (condition) {
  const { scrollY } = useScroll();  // ESLint te lo dirá
}

// ❌ ADVERTENCIA: Dependencia faltante
useEffect(() => {
  doSomething(variable);
}, []);  // ESLint te dirá que "variable" falta
```

---

## ✅ Patrón 6: Componente con Multiple useEffect

### ✅ CORRECTO
```tsx
const ComplexComponent = () => {
  // 1️⃣ Estados
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2️⃣ Hooks de librerías
  const { scrollY } = useScroll();

  // 3️⃣ Effects (múltiples es OK si tienen propósitos diferentes)
  
  // Effect 1: Setup inicial
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  // Effect 2: Cuando scrollY cambia
  useEffect(() => {
    console.log('Scroll Y:', scrollY);
  }, [scrollY]);

  // Effect 3: Cuando count cambia
  useEffect(() => {
    setData(null);
    setIsLoading(true);
    
    // Fetch data based on count
    fetchData(count).then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, [count]);

  // 4️⃣ Lógica
  const handleIncrement = () => setCount(count + 1);

  // 5️⃣ JSX
  return (
    <div>
      <button onClick={handleIncrement}>Count: {count}</button>
      {isLoading ? <p>Loading...</p> : <p>Data: {data}</p>}
    </div>
  );
};
```

---

## ✅ Patrón 7: Layout con Posicionamiento Correcto

### ✅ CORRECTO
```tsx
// layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="relative">  {/* ✅ Posición base */}
        <ClientProviders>
          <div className="relative flex flex-col min-h-screen">  {/* ✅ Contenedor relativo */}
            <Header />
            
            {/* ✅ Main con position: relative para Framer Motion */}
            <main className="relative flex-1 pt-16">
              {children}
            </main>
            
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
```

### CSS Tailwind equivalente
```css
body {
  position: relative;
}

main {
  position: relative;
  flex: 1;
  padding-top: 4rem; /* pt-16 */
}
```

---

## ✅ Patrón 8: Custom Hook con Reglas de Hooks

### ✅ CORRECTO
```tsx
// hooks/useCustomScroll.ts
import { useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';

export function useCustomScroll() {
  // ✅ Todos los hooks del hook personalizado
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsAtTop(latest < 50);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return { scrollY, isAtTop };
}

// En componente:
const Header = () => {
  const { scrollY, isAtTop } = useCustomScroll();  // ✅ Un hook que retorna varios valores
  
  return (
    <header className={isAtTop ? 'transparent' : 'solid'}>
      {/* content */}
    </header>
  );
};
```

---

## ✅ Patrón 9: Conditional Rendering Correcto

### ❌ MALO
```tsx
const Component = ({ showModal }: { showModal: boolean }) => {
  if (showModal) {
    const { scrollY } = useScroll();  // ❌ Condicional en hook
  }
  
  return <div>...</div>;
};
```

### ✅ BUENO - Opción 1: Renderizar componente separado
```tsx
const Component = ({ showModal }: { showModal: boolean }) => {
  return (
    <>
      <MainContent />
      {showModal && <Modal />}  {/* ✅ Componente separado */}
    </>
  );
};

// Modal.tsx - tiene sus propios hooks
const Modal = () => {
  const { scrollY } = useScroll();
  return <div>...</div>;
};
```

### ✅ BUENO - Opción 2: Condicional dentro de useEffect
```tsx
const Component = ({ showModal }: { showModal: boolean }) => {
  const { scrollY } = useScroll();  // ✅ Hook siempre se ejecuta
  
  useEffect(() => {
    if (!showModal) {
      return;  // ✅ Condicional dentro del effect
    }
    
    // Lógica que solo aplica cuando showModal es true
    console.log('Modal is shown, scrollY:', scrollY);
  }, [showModal, scrollY]);
  
  return <div>...</div>;
};
```

---

## ✅ Patrón 10: Testing de Hooks

### ✅ CORRECTO
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCustomScroll } from './useCustomScroll';

describe('useCustomScroll', () => {
  it('should initialize with isAtTop = true', () => {
    const { result } = renderHook(() => useCustomScroll());
    
    // ✅ Verificar que el hook no falla
    expect(result.current.isAtTop).toBe(true);
  });

  it('should handle scroll events', () => {
    const { result } = renderHook(() => useCustomScroll());
    
    act(() => {
      // Simular scroll
      window.scrollY = 100;
    });
    
    expect(result.current.scrollY).toBeDefined();
  });
});
```

---

## 📚 Resumen de Reglas

| Regla | Correcto ✅ | Incorrecto ❌ |
|-------|----------|------------|
| Ubicación de hooks | Inicio del componente | Dentro de condicionales |
| Early returns | Después de todos los hooks | Antes de los hooks |
| Dependencias useEffect | Incluir todas las variables | Dejar vacío [] sin razón |
| createClient() | `useState(() => createClient())` | `createClient()` directo |
| Condicionales | Dentro de useEffect | En nivel superior |
| Múltiples effects | OK con propósitos distintos | Combinarlos todos |
| Custom hooks | Pueden usar otros hooks | Deben seguir reglas también |
| Position CSS | relative/fixed/absolute | static (por defecto) |

---

## 🎯 Checklist para Revisar tu Código

Cuando escribas un nuevo componente:

- [ ] ¿Todos los hooks están al inicio?
- [ ] ¿No hay hooks dentro de condicionales?
- [ ] ¿El early return está al final?
- [ ] ¿useEffect tiene todas sus dependencias?
- [ ] ¿Usas `useState(() => value)` para recursos expensive?
- [ ] ¿Si es un Provider, wraps correctamente a los children?
- [ ] ¿Hay posición CSS si usas Framer Motion?
- [ ] ¿ESLint no reporta errores de hooks?
- [ ] ¿React DevTools muestra estructura limpia?

