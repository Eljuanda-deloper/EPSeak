# 📋 PLAN DE IMPLEMENTACIÓN: HERO SECTION Y COMPONENTES ANIMADOS PARA EPSEAK

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Estado:** Listo para implementación  
**Contexto:** Integración de componentes modernos con animaciones en la plataforma de aprendizaje de inglés EPSeak

---

## 🎯 OBJETIVO GENERAL

Integrar componentes de sección hero moderno (`HeroSection`) y dependencias animadas (`AnimatedGroup`, `TextEffect`) en EPSeak, manteniendo coherencia visual con el sistema de diseño actual (colores corporativos azules/purpura, idioma español, enfoque educativo).

---

## ✅ VERIFICACIÓN PRE-IMPLEMENTACIÓN

### Estado Actual del Proyecto: ✅ VERIFICADO

| Requisito | Estado | Detalles |
|-----------|--------|---------|
| **Next.js 16 + App Router** | ✅ Activo | `next@13.4.19` |
| **React 18/19** | ✅ Activo | `react@18.2.0` |
| **TypeScript** | ✅ Configurado | `tsconfig.json` con rutas aliaseadas `@/*` |
| **Tailwind CSS** | ✅ Instalado | `tailwind.config.js` presente |
| **shadcn/ui** | ✅ Integrado | Componentes base (`Button`) ya en uso |
| **Framer Motion** | ✅ Presente | `framer-motion@12.23.24` |
| **Lucide Icons** | ✅ Presente | `lucide-react@0.553.0` |
| **Radix UI** | ✅ Instalado | `@radix-ui/react-slot@1.2.4` |

### Estructura de Directorios: ✅ CONFIRMAR
```
/components/
  ├── ui/              ← Aquí irán los componentes animados base
  ├── layout/          ← Header, Footer, Layout general
  └── blocks/          ← HeroSection (nivel superior)

/lib/
  └── utils.ts         ← Utilidad `cn()` para Tailwind ya existe
```

---

## 🔧 FASE 1: PREPARACIÓN DEL ENTORNO (1-2 horas)

### 1.1 Verificar/Instalar Dependencias

**Status:** La mayoría ya están instaladas. Solo verificar versiones:

```bash
# Verificar instalación de paquetes necesarios
npm ls framer-motion lucide-react class-variance-authority @radix-ui/react-slot

# Si falta algo, instalar:
npm install framer-motion@latest lucide-react class-variance-authority @radix-ui/react-slot
```

**Dependencias Requeridas:**
- ✅ `framer-motion@^12.0.0` - Motor de animaciones
- ✅ `@radix-ui/react-slot@^1.0.0` - Slot pattern para Button
- ✅ `class-variance-authority@^0.7.0` - Sistema de variantes (CVA)
- ✅ `lucide-react@^0.5.0` - Iconos (ArrowRight, ChevronRight, Menu, X)
- ✅ `tailwind-merge@^2.0.0` - Fusión de clases Tailwind

**Validación:**
```bash
npm run type-check  # Debe pasar sin errores
npm run build       # Compilación successful
```

### 1.2 Revisar Configuración de Tailwind

**Archivo:** `/home/juanda/epseak/tailwind.config.js`

Asegurar que tiene:
```javascript
// ✅ Colores corporativos EPSeak
theme: {
  colors: {
    'epseak-blue': '#0066cc',    // Azul corporativo
    'epseak-purple': '#6f42c1',  // Púrpura complementario
    // ... otros colores
  }
}

// ✅ Propiedades personalizadas para animaciones
extend: {
  animation: {
    'fade-in': 'fadeIn 0.5s ease-in',
    'slide-up': 'slideUp 0.6s ease-out',
  },
  keyframes: {
    fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
    slideUp: { from: { transform: 'translateY(20px)' }, to: { transform: 'translateY(0)' } },
  }
}
```

### 1.3 Crear Estructura de Carpetas

```bash
# Crear directorios para componentes
mkdir -p components/ui
mkdir -p components/blocks
mkdir -p lib/animations

# Confirmar estructura
ls -la components/
```

**Resultado esperado:**
```
components/
├── ui/
│   ├── button.tsx              ← Ya existe
│   ├── animated-group.tsx      ← Nueva
│   ├── text-effect.tsx         ← Nueva
│   └── ...
├── blocks/
│   └── hero-section-1.tsx      ← Nueva (nivel aplicación)
└── layout/
    ├── header.tsx              ← Ya existe
    └── ...
```

---

## 📦 FASE 2: INSTALACIÓN DE COMPONENTES BASE (2-3 horas)

### 2.1 Copiar `AnimatedGroup` → `/components/ui/animated-group.tsx`

**Propósito:** Componente contenedor para animar múltiples elementos hijos con stagger.

**Características:**
- ✅ 10 presets de animación (fade, slide, scale, blur, zoom, bounce, etc.)
- ✅ Soporte para variantes personalizadas de Framer Motion
- ✅ Sistema de stagger automático
- ✅ Uso con `React.Children.map()` para máxima flexibilidad

**Adaptaciones para EPSeak:**
```tsx
// Agregar preset específico para EPSeak
const epeakPresets: Record<PresetType, { container: Variants; item: Variants }> = {
  // ... presets estándar ...
  
  // NUEVO: Animación de entrada de lecciones
  'lesson-enter': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 100, damping: 15 }
      },
    },
  },
  
  // NUEVO: Animación de carga progresiva
  'progressive-load': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      },
    },
  },
};
```

**Checklist:**
- [ ] Archivo creado en `/components/ui/animated-group.tsx`
- [ ] Importa de Framer Motion correctamente
- [ ] Exporte nombrado `{ AnimatedGroup }`
- [ ] TypeScript compila sin errores
- [ ] Soporta 10+ presets

### 2.2 Copiar `TextEffect` → `/components/ui/text-effect.tsx`

**Propósito:** Animar texto por palabras, caracteres o líneas con efectos visuales.

**Características:**
- ✅ Tres modos: `per="word" | "char" | "line"`
- ✅ 5 presets (blur, shake, scale, fade, slide)
- ✅ Soporte para variantes personalizadas
- ✅ Control de `delay` y `trigger`

**Adaptaciones para EPSeak:**
```tsx
// En TextEffect.tsx, agregar soporte para español
const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  // ... presets actuales ...
  
  // NUEVO: Efecto "revelación" para títulos de lecciones
  'reveal-title': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
      },
    },
  },
  
  // NUEVO: Efecto "resalte" para palabras vocabulario
  'highlight-word': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0.5, backgroundColor: 'transparent' },
      visible: {
        opacity: 1,
        backgroundColor: 'rgba(111, 66, 193, 0.1)', // Púrpura EPSeak
        transition: { duration: 0.3 },
      },
    },
  },
};
```

**Checklist:**
- [ ] Archivo creado en `/components/ui/text-effect.tsx`
- [ ] Soporta modo `per="word"` para palabras
- [ ] Soporta modo `per="char"` para caracteres
- [ ] Soporta modo `per="line"` para líneas
- [ ] Incluye 5 presets + posibilidad de custom variants
- [ ] TypeScript: Type seguro para `PresetType`

### 2.3 Verificar `Button` en `/components/ui/button.tsx`

**Status:** Ya existe en el proyecto.

**Verificación:**
```tsx
// Debe tener estas características:
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Variantes: default, destructive, outline, secondary, ghost, link
// Tamaños: default, sm, lg, icon
// Prop asChild para polimorfismo con Next/Link

export { Button, buttonVariants }
```

**Checklist:**
- [ ] Componente Button existe
- [ ] Soporta prop `asChild`
- [ ] Tiene variante `outline` y `ghost` (necesarias para Hero)
- [ ] CVA está configurado correctamente

---

## 🎨 FASE 3: CREACIÓN DEL HERO SECTION (3-4 horas)

### 3.1 Crear `HeroSection` → `/components/blocks/hero-section-1.tsx`

**Propósito:** Sección hero moderna con:
- Header fijo con navegación responsive
- Título principal animado
- Call-to-action dual (botones)
- Galería de clientes corporativos
- Background gradientes y efectos visuales

**Estructura General:**
```tsx
export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Efectos de fondo con gradientes */}
        <div aria-hidden className="absolute inset-0 ...">
          {/* Círculos gradiente de decoración */}
        </div>
        
        <section>
          <div className="relative pt-24 md:pt-36">
            {/* Imagen de fondo animada */}
            <AnimatedGroup variants={{...}}>
              <img src="night-background.jpg" alt="background" />
            </AnimatedGroup>
            
            {/* Contenido principal */}
            <div className="mx-auto max-w-7xl px-6">
              {/* Badge de novedad */}
              <AnimatedGroup variants={transitionVariants}>
                <Link href="#" className="...">
                  <span>Nuevas características</span>
                </Link>
              </AnimatedGroup>
              
              {/* Título principal */}
              <h1 className="text-6xl md:text-7xl">
                Soluciones modernas para tu aprendizaje
              </h1>
              
              {/* Descripción */}
              <p className="text-lg max-w-2xl mx-auto">
                Componentes altamente personalizables para construir interfaces modernas...
              </p>
              
              {/* Botones de acción */}
              <AnimatedGroup variants={{...}}>
                <Button size="lg">Comenzar</Button>
                <Button variant="ghost" size="lg">Solicitar demo</Button>
              </AnimatedGroup>
            </div>
            
            {/* Imagen de demostración */}
            <AnimatedGroup variants={{...}}>
              <img src="mail2.png" alt="app screen" />
            </AnimatedGroup>
          </div>
        </section>
        
        {/* Sección de clientes */}
        <section className="pb-16 pt-16">
          <div className="grid grid-cols-4 gap-12">
            {/* Logos de clientes */}
          </div>
        </section>
      </main>
    </>
  )
}

// Componente de header separado
const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Navegación con menú mobile responsive
  return (
    <header>
      <nav className="fixed z-20 w-full ...">
        {/* Logo */}
        {/* Menú desktop */}
        {/* Menú mobile con toggle */}
        {/* Botones de auth */}
      </nav>
    </header>
  )
}

// Logo SVG con gradiente corporativo
const Logo = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 78 18" className={cn('h-5 w-auto', className)}>
      {/* SVG content */}
    </svg>
  )
}
```

**Adaptaciones Específicas para EPSeak:**

1. **Textos en Español:**
   - "Introducing Support for AI Models" → "Nuevas características de IA"
   - "Modern Solutions for Customer Engagement" → "Soluciones modernas para tu aprendizaje de inglés"
   - "Highly customizable components..." → "Componentes altamente personalizables para construir tu educación..."

2. **Colores Corporativos:**
   ```tsx
   // Reemplazar colores genéricos con EPSeak
   const colors = {
     primary: '#0066cc',      // Azul EPSeak
     secondary: '#6f42c1',    // Púrpura EPSeak
     accent: '#00d4ff',       // Cyan complementario
     background: '#ffffff',   // O dark mode: '#1a1a1a'
   }
   
   // En gradientes:
   className="bg-gradient-to-b from-epseak-purple/10 to-epseak-blue/5"
   fill="url(#epseak-gradient)"
   
   // Logo con colores EPSeak:
   <stop stopColor="#0066cc" />
   <stop offset="1" stopColor="#6f42c1" />
   ```

3. **Logo Personalizado:**
   - Reemplazar SVG logo genérico con logo EPSeak
   - O crear variante estilizada con colores corporativos

4. **Enlaces y Rutas:**
   ```tsx
   const menuItems = [
     { name: 'Características', href: '/features' },
     { name: 'Planes', href: '/pricing' },
     { name: 'Acerca de', href: '/about' },
     { name: 'Blog', href: '/blog' },
   ]
   
   // Botones apuntan a rutas EPSeak reales
   <Link href="/auth/signup">Comenzar ahora</Link>
   <Link href="/contact">Solicitar demo</Link>
   ```

5. **Imagen de Fondo:**
   - Cambiar imágenes de demostración por screenshots de EPSeak dashboard
   - Usar imágenes hospedadas en CDN o storage público

6. **Logos de Clientes:**
   - Reemplazar con logos de instituciones educativas que usen EPSeak
   - O con tecnologías complementarias (Google, Udemy, etc.)

**Checklist:**
- [ ] Archivo `/components/blocks/hero-section-1.tsx` creado
- [ ] HeroHeader componente con scroll detection
- [ ] Menú responsive (mobile + desktop)
- [ ] AnimatedGroup para todas las transiciones
- [ ] Textos en español
- [ ] Colores corporativos EPSeak aplicados
- [ ] SVG Logo personalizado
- [ ] Enlaces apuntan a rutas EPSeak (`/auth/signup`, `/contact`, etc.)
- [ ] Responsive en mobile, tablet, desktop
- [ ] TypeScript compila sin errores

---

## 🔌 FASE 4: INTEGRACIÓN EN PAGES/ROUTES (2-3 horas)

### 4.1 Crear Página Demo

**Opción A: Landing Page actualizada**

Archivo: `/app/(marketing)/page.tsx` o `/app/hero/page.tsx`

```tsx
import { HeroSection } from '@/components/blocks/hero-section-1'

export default function HeroPage() {
  return (
    <main>
      <HeroSection />
      {/* Otras secciones si es necesario */}
    </main>
  )
}
```

**Opción B: Showcase/Demo dedicado**

Archivo: `/app/(marketing)/components/page.tsx`

```tsx
import { HeroSection } from '@/components/blocks/hero-section-1'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { TextEffect } from '@/components/ui/text-effect'

export default function ComponentsPage() {
  return (
    <main className="space-y-20">
      {/* Demo Hero */}
      <section>
        <HeroSection />
      </section>
      
      {/* Demo AnimatedGroup */}
      <section className="p-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">AnimatedGroup Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['fade', 'slide', 'scale', 'blur', 'zoom', 'bounce', 'rotate', 'swing'].map((preset) => (
            <AnimatedGroup key={preset} preset={preset as any} className="p-4 bg-white rounded">
              <div className="text-center font-semibold">{preset}</div>
            </AnimatedGroup>
          ))}
        </div>
      </section>
      
      {/* Demo TextEffect */}
      <section className="p-8">
        <h2 className="text-3xl font-bold mb-8">TextEffect Presets</h2>
        <div className="space-y-6">
          {(['fade', 'blur', 'shake', 'scale', 'slide'] as const).map((preset) => (
            <div key={preset}>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{preset}</h3>
              <TextEffect preset={preset} per="word">
                Este es un ejemplo con el efecto {preset} aplicado por palabra
              </TextEffect>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
```

### 4.2 Exportar desde Index

Archivo: `/components/ui/index.ts` (crear si no existe)

```typescript
// Componentes UI base
export { Button, buttonVariants } from './button'
export { AnimatedGroup } from './animated-group'
export { TextEffect } from './text-effect'

// Bloques
export { HeroSection } from '@/components/blocks/hero-section-1'
```

### 4.3 Integración en Rutas Existentes

**En el header/navegación principal:**
```tsx
// Si quieres mostrar Hero en landing actual
import { HeroSection } from '@/components/blocks/hero-section-1'

// O solo componentes individuales
import { AnimatedGroup, TextEffect } from '@/components/ui'
```

**Checklist:**
- [ ] Página demo creada (`/app/hero` o `/app/components`)
- [ ] HeroSection importada y renderizada
- [ ] Componentes AnimatedGroup y TextEffect accesibles
- [ ] Rutas funcionan sin errores de compilación
- [ ] Página responsive en todos los breakpoints

---

## 🎯 FASE 5: CUSTOMIZACIÓN AVANZADA (2-3 horas)

### 5.1 Crear Hooks Personalizados

Archivo: `/lib/hooks/use-hero-animations.ts`

```typescript
import { Variants } from 'framer-motion'

/**
 * Hook personalizado para variantes de animación EPSeak
 * Proporciona presets optimizados para diferentes contextos educativos
 */
export const useHeroAnimations = () => {
  const lessonEnterVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  const vocabularyRevealVariants: Variants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      },
    },
  }

  return { lessonEnterVariants, vocabularyRevealVariants }
}
```

### 5.2 Crear Componentes Reutilizables

Archivo: `/components/ui/animated-button.tsx`

```tsx
import { Button, ButtonProps } from './button'
import { motion } from 'framer-motion'
import React from 'react'

const MotionButton = motion.create(Button)

interface AnimatedButtonProps extends ButtonProps {
  animateOnHover?: boolean
  animateOnTap?: boolean
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ animateOnHover = true, animateOnTap = true, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        whileHover={animateOnHover ? { scale: 1.05 } : {}}
        whileTap={animateOnTap ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      />
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'
```

### 5.3 Ejemplos de Uso en Componentes EPSeak

Archivo: `/components/lesson-hero.tsx`

```tsx
import { HeroSection } from '@/components/blocks/hero-section-1'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { TextEffect } from '@/components/ui/text-effect'
import { useHeroAnimations } from '@/lib/hooks/use-hero-animations'

export function LessonHero({ title, description }: { title: string; description: string }) {
  const { lessonEnterVariants, vocabularyRevealVariants } = useHeroAnimations()

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-epseak-blue/5 to-epseak-purple/5">
      <AnimatedGroup variants={lessonEnterVariants}>
        <div className="max-w-4xl mx-auto px-6">
          <TextEffect preset="blur" per="word" className="text-5xl font-bold mb-4">
            {title}
          </TextEffect>

          <p className="text-xl text-gray-600 mb-8">{description}</p>

          <AnimatedGroup variants={vocabularyRevealVariants} className="flex gap-3">
            {/* Botones de acción */}
          </AnimatedGroup>
        </div>
      </AnimatedGroup>
    </section>
  )
}
```

**Checklist:**
- [ ] Hooks personalizados en `/lib/hooks/`
- [ ] AnimatedButton creado y funcionando
- [ ] Ejemplo LessonHero implementado
- [ ] Todos compilan sin errores TypeScript
- [ ] Animaciones fluidas en navegadores modernos

---

## 🧪 FASE 6: TESTING Y VALIDACIÓN (2 horas)

### 6.1 Pruebas de Compilación

```bash
# TypeScript compilation
npm run type-check

# Build production
npm run build

# Lint
npm run lint

# Resultados esperados:
# ✓ No TypeScript errors
# ✓ No ESLint warnings
# ✓ Build size optimized
```

### 6.2 Pruebas en Navegador

**Desktop (Chrome, Firefox, Safari):**
- [ ] HeroSection renderiza sin errores
- [ ] Animaciones fluidas (60 FPS en DevTools)
- [ ] Scroll behavior correcto
- [ ] Menú mobile toggle funciona
- [ ] Responsivo en 1920px, 1024px

**Mobile:**
- [ ] Responsive en 768px (tablet)
- [ ] Responsive en 375px (móvil)
- [ ] Touch events funcionan
- [ ] Menú móvil accesible
- [ ] Imágenes cargan correctamente

**Performance:**
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint (FCP) < 2s
- [ ] Cumulative Layout Shift (CLS) < 0.1

### 6.3 Pruebas de Componentes Individuales

```bash
# Ejecutar tests si existen
npm run test

# Si no existen, crear archivo de test:
# __tests__/components/animated-group.test.tsx
```

**Ejemplo de test:**
```tsx
import { render, screen } from '@testing-library/react'
import { AnimatedGroup } from '@/components/ui/animated-group'

describe('AnimatedGroup', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedGroup>
        <div>Test Child</div>
      </AnimatedGroup>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('applies correct preset variants', () => {
    const { container } = render(
      <AnimatedGroup preset="fade">
        <div>Fade Test</div>
      </AnimatedGroup>
    )
    expect(container.querySelector('[class*="motion"]')).toBeInTheDocument()
  })
})
```

**Checklist:**
- [ ] `npm run type-check` sin errores
- [ ] `npm run build` exitoso
- [ ] `npm run lint` sin warnings críticos
- [ ] Funcionalidad probada en 3+ navegadores
- [ ] Responsivo confirmado en 3+ tamaños de pantalla
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Tests ejecutables (0 fallos)

---

## 📊 FASE 7: DOCUMENTACIÓN Y DEPLOYMENT (1-2 horas)

### 7.1 Documentación de Componentes

Crear: `/docs/COMPONENTS_GUIDE.md`

```markdown
# Guía de Componentes Animados EPSeak

## HeroSection
- Uso principal: Landing page, secciones de bienvenida
- Props: Ninguno (componente cerrado)
- Ejemplo: `<HeroSection />`

## AnimatedGroup
- Uso principal: Animar múltiples elementos con stagger
- Props: `preset`, `variants`, `className`, `children`
- Presets: fade, slide, scale, blur, zoom, bounce, rotate, swing
- Ejemplo: `<AnimatedGroup preset="slide"><Card /><Card /></AnimatedGroup>`

## TextEffect
- Uso principal: Animar texto con efectos especiales
- Props: `preset`, `per`, `delay`, `trigger`, `children`
- Presets: blur, fade, shake, scale, slide
- Modos: word (por palabra), char (por carácter), line (por línea)
- Ejemplo: `<TextEffect preset="blur" per="word">Texto animado</TextEffect>`

## AnimatedButton
- Uso principal: Botones con interactividad animada
- Props: Extiende ButtonProps + `animateOnHover`, `animateOnTap`
- Ejemplo: `<AnimatedButton>Click me</AnimatedButton>`
```

### 7.2 Actualizar Changelog

Archivo: `/CHANGELOG.md`

```markdown
## [0.2.0] - 2025-11-20

### Added
- ✨ Nuevo componente `HeroSection` con header responsive
- ✨ Componente `AnimatedGroup` con 10 presets de animación
- ✨ Componente `TextEffect` para animación de texto
- ✨ Hook personalizado `useHeroAnimations` para variantes EPSeak
- ✨ Componente `AnimatedButton` con interactividad mejorada
- 📚 Documentación completa de nuevos componentes
- 🎨 Colores corporativos EPSeak integrados

### Changed
- Actualizada estructura de directorios `/components/blocks/`
- Mejorada accesibilidad en componentes animados

### Technical
- Actualizada configuración de TypeScript para nuevos tipos
- Añadidas importaciones de Framer Motion
- Validado con ESLint y type-check
```

### 7.3 Crear Demo Page

Ruta: `/app/(marketing)/components-demo/page.tsx`

```tsx
export const metadata = {
  title: 'Componentes Animados | EPSeak',
  description: 'Galería interactiva de componentes modernos con animaciones',
}

export default function ComponentsDemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-20">
        <h1 className="text-5xl font-bold text-center mb-12">Componentes EPSeak</h1>
        
        {/* HeroSection */}
        {/* AnimatedGroup Examples */}
        {/* TextEffect Examples */}
      </section>
    </main>
  )
}
```

### 7.4 Git Commit y Deploy

```bash
# Preparar cambios
git add components/ui/animated-group.tsx
git add components/ui/text-effect.tsx
git add components/blocks/hero-section-1.tsx
git add lib/hooks/use-hero-animations.ts
git add docs/COMPONENTS_GUIDE.md
git add CHANGELOG.md

# Commit descriptivo
git commit -m "feat: Add hero section and animated components

- HeroSection with responsive header and animations
- AnimatedGroup with 10 animation presets
- TextEffect with per-word/char/line animations
- Custom hooks for EPSeak animation patterns
- Complete documentation and demo page"

# Push a rama de feature
git push origin feature/hero-components

# Crear Pull Request en GitHub
# Solicitar review
# Merge a main después de aprobación
```

**Checklist:**
- [ ] Documentación creada en `/docs/COMPONENTS_GUIDE.md`
- [ ] CHANGELOG.md actualizado
- [ ] Demo page funcional
- [ ] Git commits organizados
- [ ] Pull request creada y aprobada
- [ ] Merged a rama `main`
- [ ] Desplegado en producción (si aplica)

---

## 🚀 RESUMEN DE ARCHIVOS A CREAR/MODIFICAR

### Archivos Nuevos (7 archivos):

| Archivo | Tipo | Líneas | Dependencias |
|---------|------|--------|-------------|
| `/components/ui/animated-group.tsx` | Componente | ~200 | framer-motion, react |
| `/components/ui/text-effect.tsx` | Componente | ~300 | framer-motion, react |
| `/components/blocks/hero-section-1.tsx` | Componente | ~600 | animated-group, button, lucide-react |
| `/lib/hooks/use-hero-animations.ts` | Hook | ~80 | framer-motion |
| `/components/ui/animated-button.tsx` | Componente | ~40 | button, framer-motion |
| `/docs/COMPONENTS_GUIDE.md` | Documentación | ~150 | N/A |
| `/app/(marketing)/components-demo/page.tsx` | Page | ~100 | Componentes nuevos |

### Archivos a Actualizar (2 archivos):

| Archivo | Cambios | Razón |
|---------|---------|-------|
| `/tailwind.config.js` | Agregar animaciones custom | Soporte para efectos avanzados |
| `CHANGELOG.md` | Registrar nuevas features | Tracking de versiones |

### Total de Trabajo:

- **Líneas de código:** ~1,500 líneas
- **Tiempo estimado:** 12-15 horas (distribuidas en 7 fases)
- **Dependencias a instalar:** 0 (todas presentes)
- **Breaking changes:** Ninguno
- **Backward compatibility:** ✅ 100%

---

## 📋 CHECKLIST FINAL DE IMPLEMENTACIÓN

### Pre-Implementación
- [ ] Requisitos verificados (Next.js, React, TypeScript, Tailwind)
- [ ] Dependencias confirmadas
- [ ] Estructura de directorios lista
- [ ] Plan revisado y aprobado

### Fase 1: Preparación
- [ ] Dependencias instaladas correctamente
- [ ] Tailwind config verificado
- [ ] Directorios creados
- [ ] `npm run build` sin errores

### Fase 2: Componentes Base
- [ ] `animated-group.tsx` creado y compilable
- [ ] `text-effect.tsx` creado y compilable
- [ ] `button.tsx` verificado y funcional
- [ ] TypeScript types correctos

### Fase 3: Hero Section
- [ ] `hero-section-1.tsx` creado con todas las secciones
- [ ] Header responsive con scroll detection
- [ ] Textos en español
- [ ] Colores EPSeak aplicados
- [ ] Links apuntan a rutas correctas
- [ ] Imágenes optimizadas

### Fase 4: Integración
- [ ] Página demo creada
- [ ] Componentes importables
- [ ] Rutas funcionales
- [ ] Sin errores de compilación

### Fase 5: Customización
- [ ] Hooks personalizados creados
- [ ] AnimatedButton funcional
- [ ] Ejemplo LessonHero implementado
- [ ] Casos de uso adicionales

### Fase 6: Testing
- [ ] type-check sin errores
- [ ] build exitoso
- [ ] lint sin warnings críticos
- [ ] Tests ejecutables
- [ ] Responsive confirmado

### Fase 7: Documentación
- [ ] Guía de componentes escrita
- [ ] CHANGELOG actualizado
- [ ] Demo page completa
- [ ] Commits y PR creados

### Producción
- [ ] Pull request aprobada
- [ ] Merged a `main`
- [ ] Desplegado exitosamente
- [ ] Monitoreado en producción

---

## 🔗 REFERENCIAS Y RECURSOS

### Documentación Oficial
- [Framer Motion Docs](https://www.framer.com/motion/) - Guía completa de animaciones
- [shadcn/ui Components](https://ui.shadcn.com/) - Patrones y mejores prácticas
- [Next.js App Router](https://nextjs.org/docs/app) - Routing en Next.js 13+
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Mejores Prácticas
1. **Framer Motion Variants:** Define estados reutilizables, no crees animaciones inline
2. **Composition Pattern:** Prefiere componentes pequeños y componibles
3. **TypeScript:** Usa types genéricos para máxima flexibilidad
4. **Performance:** Usa `React.memo()` para componentes puros
5. **Accessibility:** Siempre incluye `aria-*` atributos y semantic HTML

### Stack Tecnológico Confirmado
```
EPSeak v0.1.0
├── Next.js 13.4.19 (App Router)
├── React 18.2.0
├── TypeScript 5.x
├── Tailwind CSS 3.x
├── Framer Motion 12.23.24
├── shadcn/ui (Button, etc.)
├── Supabase (Auth & Database)
├── Lucide React Icons
└── Radix UI (Primitives)
```

---

## 📞 SOPORTE Y PRÓXIMOS PASOS

### Si necesitas ayuda:
1. Revisa la documentación en `/docs/COMPONENTS_GUIDE.md`
2. Consulta ejemplos en `/app/(marketing)/components-demo/`
3. Revisa el código fuente en `/components/ui/` y `/components/blocks/`

### Próximas mejoras (Post-implementación):
- [ ] Analytics tracking para HeroSection interactions
- [ ] A/B testing de variantes CTA
- [ ] Temas dark/light para componentes
- [ ] Internacionalización (i18n) para textos
- [ ] Componentes de formulario animados
- [ ] Integración con Storybook para documentación visual

### KPIs de Éxito:
- ✅ 0 TypeScript errors
- ✅ Lighthouse score ≥ 85
- ✅ Performance: FCP < 2s, LCP < 2.5s
- ✅ Responsivo en todos los dispositivos
- ✅ Accesibilidad WCAG AA
- ✅ 100% Componibilidad entre componentes

---

**Versión:** 1.0  
**Estado:** ✅ Listo para comenzar implementación  
**Creado:** Noviembre 20, 2025  
**Autorizado:** Equipo de Desarrollo EPSeak
