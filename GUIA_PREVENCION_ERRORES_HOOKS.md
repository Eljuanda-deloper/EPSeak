# 🛡️ Guía Preventiva: Errores de React Hooks

## 1. Reglas de Oro de React Hooks

### ✅ Las Dos Reglas Fundamentales

```
Regla 1: Solo llamar Hooks en el Top Level
Regla 2: Solo llamar Hooks desde componentes React
```

### ✅ El Orden Importa

React usa un **contador interno** para rastrear hooks:

```tsx
// Render 1: Home page
function Header() {
  const state1 = useState();      // Hook #1
  const state2 = useState();      // Hook #2
  useEffect(() => {}, []);        // Hook #3
  useEffect(() => {}, [open]);    // Hook #4
  // Total: 4 hooks
}

// Render 2: Dashboard page
function Header() {
  if (pathname === '/dashboard') {
    return null;  // ❌ NUNCA llama los hooks
  }
  // Total: 0 hooks ← CONFLICTO CON RENDER 1 ❌
}
```

---

## 2. Early Returns: Cómo Hacerlo Correctamente

### ❌ INCORRECTO: Return ANTES de hooks

```tsx
function MyComponent() {
  // ❌ MAL: Early return antes de hooks
  if (!user) {
    return <LoginForm />;
  }
  
  const [state] = useState();     // ❌ Nunca se ejecuta si no hay user
  useEffect(() => {}, []);        // ❌ Nunca se ejecuta si no hay user
  
  return <Dashboard />;
}
```

### ✅ CORRECTO: Return DESPUÉS de todos los hooks

```tsx
function MyComponent() {
  // ✅ BIEN: Todos los hooks primero
  const [state] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, []);
  useEffect(() => {}, [state]);
  const memoized = useCallback(() => {}, []);
  
  // ✅ BIEN: Early return DESPUÉS
  if (!user) {
    return <LoginForm />;
  }
  
  if (loading) {
    return <Skeleton />;
  }
  
  return <Dashboard />;
}
```

---

## 3. Patrones Comunes Correctos

### Patrón 1: Cargar Datos Condicionalmente

```tsx
// ✅ CORRECTO
function UserProfile() {
  const { user } = useAuth();           // Hook 1
  const [profile, setProfile] = useState(null);  // Hook 2
  
  useEffect(() => {
    // Este code DENTRO del effect puede tener returns
    if (!user?.id) return;              // ✅ OK aquí
    
    const loadProfile = async () => {
      const data = await fetch(`/api/profile/${user.id}`);
      setProfile(await data.json());
    };
    
    loadProfile();
  }, [user?.id]);
  
  // ✅ Early returns DESPUÉS de todos los hooks
  if (!user) return <LoginRequired />;
  if (!profile) return <Loading />;
  
  return <Profile data={profile} />;
}
```

### Patrón 2: Validación de Props

```tsx
// ✅ CORRECTO
function CardComponent({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);  // Hook 1
  
  useEffect(() => {
    // Lógica
  }, [isOpen]);
  
  // ✅ Validaciones DESPUÉS de hooks
  if (!title) {
    return <div>Error: Title requerido</div>;
  }
  
  if (!children) {
    return <div>Error: Children requerido</div>;
  }
  
  return (
    <div className="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Patrón 3: Renderizado Condicional Complejo

```tsx
// ✅ CORRECTO
function Dashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user?.id) {
      fetchData(user.id).then(setData).catch(setError);
    }
  }, [user?.id]);
  
  // ✅ Todos los returns DESPUÉS
  if (loading) return <PageSkeleton />;
  if (!user) return <RedirectToLogin />;
  if (error) return <ErrorPage error={error} />;
  if (!data) return <DataSkeleton />;
  
  return <DashboardContent data={data} />;
}
```

---

## 4. Anti-Patrones a Evitar

### ❌ Anti-Patrón 1: Hooks en Condicionales

```tsx
// ❌ NUNCA hagas esto
function Bad() {
  if (condition) {
    const [state] = useState();  // ❌ Hook dentro de if
  }
  
  useEffect(() => {}, []);
  
  return <div />;
}
```

### ❌ Anti-Patrón 2: Hooks en Loops

```tsx
// ❌ NUNCA hagas esto
function Bad({ items }) {
  items.forEach(item => {
    const [state] = useState(item);  // ❌ Hook en loop
  });
  
  return <div />;
}
```

### ❌ Anti-Patrón 3: Hooks en Funciones Anidadas

```tsx
// ❌ NUNCA hagas esto
function Bad() {
  const handleClick = () => {
    const [state] = useState();  // ❌ Hook en función
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

### ❌ Anti-Patrón 4: Early Return ANTES de Hooks

```tsx
// ❌ NUNCA hagas esto
function Bad({ shouldRender }) {
  if (!shouldRender) return null;  // ❌ Return ANTES
  
  const [state] = useState();      // ❌ Nunca se ejecuta
  useEffect(() => {}, []);         // ❌ Nunca se ejecuta
  
  return <div />;
}
```

---

## 5. Debugging: Cómo Encontrar el Problema

### Síntoma: "Rendered fewer hooks than expected"

**Paso 1**: Buscar early returns en el componente
```bash
# En VS Code: Ctrl+F
# Buscar: "if.*return"
```

**Paso 2**: Contar los hooks
```tsx
// Contar: useState, useEffect, useCallback, useMemo, etc.
function Component() {
  const [x] = useState();        // 1
  const [y] = useState();        // 2
  useEffect(() => {}, []);       // 3
  useEffect(() => {}, [x]);      // 4
  
  if (condition) return null;    // ⚠️ Antes de hook #5
  
  useCallback(() => {}, []);     // 5 ← Problema aquí
  
  return <div />;
}
```

**Paso 3**: Mover early returns al final
```tsx
function Component() {
  const [x] = useState();        // 1
  const [y] = useState();        // 2
  useEffect(() => {}, []);       // 3
  useEffect(() => {}, [x]);      // 4
  useCallback(() => {}, []);     // 5
  
  if (condition) return null;    // ✅ Después de todos
  
  return <div />;
}
```

---

## 6. Checklist de Prevención

Antes de mergear código, verifica:

- [ ] ¿Todos los useState en el top level?
- [ ] ¿Todos los useEffect en el top level?
- [ ] ¿Todos los useCallback en el top level?
- [ ] ¿Todos los useMemo en el top level?
- [ ] ¿El componente tiene early returns?
- [ ] ¿Los early returns están DESPUÉS de todos los hooks?
- [ ] ¿No hay hooks dentro de if/for/while?
- [ ] ¿No hay hooks dentro de funciones?
- [ ] ¿Ejecuté el componente sin errores?
- [ ] ¿Probé en consola: F12 → Console?

---

## 7. Tools para Detectar Problemas

### ESLint Hook Plugin
```bash
npm install --save-dev eslint-plugin-react-hooks
```

**.eslintrc.json**
```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### React DevTools
```
Chrome/Firefox: Instalar React Developer Tools extension
Permite ver: componentes, hooks, state, props
```

---

## 8. Workflow de Desarrollo Seguro

### 1️⃣ Escribir Componente
```tsx
function MyComponent() {
  // Escribir todos los hooks primero
  const [state] = useState();
  useEffect(() => {}, []);
}
```

### 2️⃣ Revisar Estructura
```
☑ Todos los hooks en top level?
☑ Early returns al final?
☑ Orden de hooks consistente?
```

### 3️⃣ Linting
```bash
npm run lint
# Debe pasar: "react-hooks/rules-of-hooks"
```

### 4️⃣ Testing
```bash
npm run dev
# F12 → Console: Sin "Rendered fewer hooks"
```

### 5️⃣ Commit
```bash
git add .
git commit -m "feat: component with correct hooks structure"
```

---

## 9. Recursos Recomendados

### Documentación Oficial
- [React Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Hooks API Reference](https://react.dev/reference/react)
- [React Hooks FAQ](https://react.dev/reference/react/hooks)

### Videos
- "React Hooks in 100 Seconds" - Fireship
- "Why React Hooks?" - Kent C. Dodds
- "React Hooks Best Practices" - WebDev Simplified

### Articles
- [Rules of Hooks - React Docs](https://react.dev/reference/rules/rules-of-hooks)
- [Hooks Pitfalls - React Docs](https://react.dev/reference/react#hooks)

---

## 10. Casos Especiales

### Caso 1: Cargar datos basado en props
```tsx
// ✅ CORRECTO
function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (!userId) return;  // ✅ Return dentro del effect
    
    const load = async () => {
      const data = await fetch(`/api/user/${userId}`);
      setUser(await data.json());
    };
    
    load();
  }, [userId]);  // ✅ userId en dependencies
  
  if (!user) return <Skeleton />;
  return <UserProfile user={user} />;
}
```

### Caso 2: Múltiples Componentes Relacionados
```tsx
// ✅ CORRECTO
function ParentComponent() {
  const [selected, setSelected] = useState(null);
  
  return (
    <div>
      <Sidebar onSelect={setSelected} />
      {selected && <Detail itemId={selected} />}
    </div>
  );
}

function Detail({ itemId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (itemId) fetchData(itemId).then(setData);
  }, [itemId]);
  
  if (!data) return <Loading />;
  return <Content data={data} />;
}
```

---

## Resumen Rápido

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| Hooks en top level | Hooks en condicionales |
| Early returns al final | Early returns antes de hooks |
| Same number each render | Different hooks count per render |
| useCallback para callbacks | Funciones nuevas cada render |
| useMemo para valores | Cálculos cada render |

---

**Última actualización**: 20/11/2025
**Versión**: 1.0
**Autor**: Sistema EPSeak
**Estado**: 📖 Referencia Viva
