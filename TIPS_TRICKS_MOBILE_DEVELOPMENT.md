# 💡 Tips & Tricks - Mobile Development

Consejos prácticos para mantener y mejorar el diseño móvil de la plataforma.

---

## 🎯 Mejores Prácticas

### 1. Mobile-First Approach
```tsx
// ✅ CORRECTO: Empezar por móvil
<div className="p-2 md:p-4 lg:p-8">
  {/* Base móvil, luego ampliar */}
</div>

// ❌ INCORRECTO: Pensar en desktop primero
<div className="p-8 md:p-4 lg:p-2">
  {/* Va en reversa */}
</div>
```

### 2. Viewport Meta Tag
```html
<!-- En app/layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 3. Touch-Friendly Espaciado
```tsx
// Mínimos WCAG:
- Botones: 44x44px
- Links: 44x44px
- Inputs: 40px alto mínimo

// Cómodo en móvil:
- Padding: 12-16px
- Gaps: 12-16px
- Margins: 16-24px
```

---

## 🔍 Debugging Mobile

### DevTools Chrome
```
1. F12 → Device Toolbar (Ctrl+Shift+M)
2. Selecciona dispositivo
3. Abre Console tab
4. Busca errores/warnings rojos
5. Usa Console API para debug
```

### Console API Útil
```javascript
// Ver viewport actual
console.log(window.innerWidth, window.innerHeight);

// Ver media query match
console.log(window.matchMedia("(max-width: 768px)").matches);

// Simular touch
const touch = new TouchEvent("touchstart", {
  bubbles: true,
  cancelable: true,
  touches: [{clientX: 100, clientY: 100}]
});
element.dispatchEvent(touch);
```

### React DevTools
```
1. Instala extensión React DevTools
2. DevTools → Components tab
3. Selecciona componente
4. Mira props en panel derecho
5. Usa $r para acceder al componente
```

---

## ⚡ Performance Tips

### 1. Lazy Load Imágenes
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  loading="lazy"  // ← Clave
  width={400}
  height={300}
/>
```

### 2. Código Splitting
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/Heavy'),
  { loading: () => <Skeleton /> }
);
```

### 3. Optimizar Animaciones
```tsx
// ✅ BUENO: GPU accelerated
<motion.div style={{ y: 10 }} />

// ❌ MALO: CPU intensive
<motion.div style={{ top: 10 }} />
```

### 4. Memoización
```tsx
import { memo } from 'react';

const Card = memo(function Card({ data }) {
  return <div>{data}</div>;
});
```

---

## 🎨 Tailwind Tips

### Usar CSS Variables
```tailwind
<!-- En globals.css -->
@layer components {
  .card {
    @apply rounded-lg shadow-sm border border-gray-100 p-4 md:p-6;
  }
}

<!-- En componente -->
<div className="card">...</div>
```

### Breakpoints Custom
```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    }
  }
}
```

### Space Scale
```tailwind
<!-- Usa escala consistente -->
p-1 p-2 p-3 p-4 p-5 p-6 p-7 p-8
<!-- NO uses p-5.5 p-10.2 etc -->
```

---

## 🔧 Testing Rápido

### Verificar Responsive
```bash
# En terminal, durante npm run dev
# Abre: http://localhost:3000/dashboard

# DevTools:
1. F12 → Device Toolbar
2. Selecciona "iPhone SE"
3. Scroll → no debe haber horizontal
4. Click botones → debe funcionar
```

### Verificar Accesibilidad
```bash
# Instala Lighthouse
# En DevTools → Lighthouse
# Genera reporte
# Verifica Accessibility score >= 90
```

### Verificar Performance
```bash
# DevTools → Performance tab
# Graba interacción
# Busca frame rate >= 60 fps
# No debe haber jank/stuttering
```

---

## 📐 Medidas de Referencia

### Font Sizes
```css
text-xs   = 12px  (mínimo para móvil)
text-sm   = 14px  (normal small)
text-base = 16px  (normal)
text-lg   = 18px  (grande)
text-xl   = 20px  (muy grande)
text-2xl  = 24px  (extra grande)
text-4xl  = 36px  (heading)
```

### Touch Targets
```css
min-height: 44px  (WCAG AA)
min-height: 48px  (WCAG AAA)
min-width: 44px   (WCAG AA)
```

### Spacing Scale
```css
gap-1 = 4px
gap-2 = 8px
gap-3 = 12px   ← Common
gap-4 = 16px   ← Common
gap-6 = 24px   ← Common
gap-8 = 32px   ← Common
```

---

## 🎯 Checklist de Calidad

### Para Cada Nueva Página

```markdown
## [ ] Mobile Check

### Layout
- [ ] No scroll horizontal
- [ ] Padding > 12px
- [ ] Gaps > 12px
- [ ] Max-width = 1280px

### Typography
- [ ] Font size >= 12px
- [ ] Line height >= 1.5
- [ ] Contrast >= 4.5:1
- [ ] Font weight visible

### Interactivity
- [ ] Buttons >= 44px
- [ ] Inputs >= 40px
- [ ] Click/Tap works
- [ ] No lag/jank

### Accessibility
- [ ] All inputs labeled
- [ ] Keyboard nav works
- [ ] Screen reader ok
- [ ] Focus visible

### Performance
- [ ] Load < 3sec
- [ ] FPS > 60
- [ ] No console errors
- [ ] Images lazy loaded
```

---

## 🐛 Problemas Comunes & Soluciones

### Problema: Zoom de texto en inputs
```tsx
// ❌ Problema: Zoom en iOS
<input className="text-sm" />

// ✅ Solución
<input className="text-base" />
// iOS auto-zoom en inputs < 16px
```

### Problema: 100vh en mobile
```tsx
// ❌ Problema: 100vh incluye URL bar
<div className="h-screen">

// ✅ Solución
<div className="min-h-screen md:h-screen">
// O usar dvh (dynamic viewport height)
<div className="h-dvh">
```

### Problema: Hover en mobile
```tsx
// ❌ Problema: Hover no existe en touch
<div className="hover:bg-blue-500">

// ✅ Solución
<div className="hover:bg-blue-500 active:bg-blue-700">
// Usa active para touch feedback
```

### Problema: Overflow horizontal
```tsx
// ❌ Problema
<div className="flex gap-4 w-full">
  <div className="w-96">...</div>
  <div className="w-96">...</div>
</div>

// ✅ Solución
<div className="overflow-x-auto">
  <div className="flex gap-4 w-full">
    <div className="w-96 flex-shrink-0">...</div>
    <div className="w-96 flex-shrink-0">...</div>
  </div>
</div>
```

### Problema: Images distortionadas
```tsx
// ❌ Problema
<img src="..." className="w-full h-32" />

// ✅ Solución
<img src="..." className="w-full h-32 object-cover" />
```

---

## 📱 Testing Tools

### Online Tools
- **Responsively** - Multi-device testing
- **Google Mobile Friendly Test** - SEO check
- **Lighthouse** - Performance audit
- **WAVE** - Accesibilidad

### Browser Extensions
- **React DevTools** - Debug React
- **Tailwind CSS IntelliSense** - Autocomplete
- **Lighthouse** - Built-in Chrome

### Command Line
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://example.com --view

# Tailwind CSS validate
npx tailwindcss-jit
```

---

## 💼 Workflow Recomendado

### Development
```bash
1. npm run dev
2. DevTools (F12)
3. Device Toolbar (Ctrl+Shift+M)
4. iPhone SE (375px)
5. Code → Refresh → Test loop
```

### Testing
```bash
1. iPhone SE (375px)   ✅ Verify
2. iPhone 14 (390px)   ✅ Verify
3. iPad (768px)        ✅ Verify
4. Desktop (1440px)    ✅ Verify
```

### Antes de Commit
```bash
1. npm run build     # Build check
2. npm run lint      # Lint check
3. DevTools Audit    # Lighthouse
4. Device test       # Mobile check
5. Git commit        # Ready to go
```

---

## 🚀 Performance Budget

Mantén estos límites en móvil:

```
JavaScript: < 200KB (gzipped)
CSS: < 50KB (gzipped)
Images: < 100KB cada una
Total: < 500KB gzipped

FCP: < 1.5 segundos
LCP: < 2.5 segundos
CLS: < 0.1 segundos
```

---

## 📚 Recursos

### Documentación
- [MDN Mobile](https://developer.mozilla.org/en-US/docs/Mobile)
- [Tailwind Responsive](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Can I Use](https://caniuse.com/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

### Learning
- [Mobile UX Patterns](https://mobbin.com/)
- [Material Design Mobile](https://m3.material.io/)
- [iOS Design Guidelines](https://developer.apple.com/design/)

---

## ✅ Final Checklist

Antes de marcar como "DONE":

- [ ] Funciona en 5+ dispositivos
- [ ] Sin scroll horizontal
- [ ] Botones >= 44px
- [ ] Texto legible (12-16px)
- [ ] Contraste >= 4.5:1
- [ ] Keyboard navigation
- [ ] Screen reader ok
- [ ] FPS > 60
- [ ] Load time < 3sec
- [ ] Lighthouse >= 90

**Status**: ✅ MOBILE READY

