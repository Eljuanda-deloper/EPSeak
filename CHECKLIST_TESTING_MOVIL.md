# ✅ Checklist de Testing Móvil - Dashboard

Usa este checklist para validar que todas las páginas funcionen correctamente en dispositivos móviles.

---

## 📱 Dispositivos a Probar

Abre DevTools (F12) y selecciona estos dispositivos en modo responsive:

| Dispositivo | Resolución | Breakpoint |
|-------------|-----------|-----------|
| iPhone SE | 375×667 | mobile |
| iPhone 12 | 390×844 | mobile |
| iPhone 14 Pro Max | 430×932 | mobile |
| iPad (7th gen) | 768×1024 | tablet |
| iPad Pro 11" | 834×1194 | tablet/lg |
| Desktop | 1440×900 | desktop |

---

## 🎨 Página: Dashboard Principal

### Layout & Spacing
- [ ] No hay scroll horizontal en móvil
- [ ] Padding es consistente (3-4px en móvil, 8px en desktop)
- [ ] Gaps entre secciones son proporcionales
- [ ] Contenido no se superpone
- [ ] Márgenes del bottom (pb-16 en móvil)

### Tipografía
- [ ] Heading es legible sin zoom (16px mín en móvil)
- [ ] Descripción es visible (12px mín)
- [ ] Contraste texto/fondo >= 4.5:1
- [ ] No se corta texto por falta de espacio

### Componentes
- [ ] Continue Learning cards: 1 columna en móvil, 2 en desktop
- [ ] Recommended courses: 2x2 en móvil, 4 en desktop
- [ ] Progress bars muestran correctamente
- [ ] Emojis se ven en todos los tamaños
- [ ] Botones son clickeables (min 44px)

### Interactividad
- [ ] Hover effects no rompen en mobile (usa touch)
- [ ] Animaciones son suaves (60 fps)
- [ ] Transiciones no son muy lentas (< 300ms)
- [ ] No hay delay al hacer scroll

---

## 🎓 Página: Cursos

### Layout
- [ ] Stats en grid 2x2 en móvil, 3 en desktop
- [ ] Course cards son 1 columna en móvil, 2 en desktop
- [ ] Cards no se cortan en los bordes
- [ ] Padding interno es consistente

### Stats Cards
- [ ] Icono + Número + Etiqueta caben en tarjeta
- [ ] Icono es visible (16-24px)
- [ ] Números son grandes (18-24px)
- [ ] Etiquetas son legibles (12px)

### Course Cards
- [ ] Imagen de header escala bien (80px móvil, 96px tablet)
- [ ] Título se trunca en 2 líneas
- [ ] Descripción se trunca en 2 líneas
- [ ] Progress bar es visible (2px alto)
- [ ] Meta info (duración, estudiantes) caben
- [ ] Dificultad badge es pequeño pero visible
- [ ] Botón CTA es full-width con min-height 44px

### Interactions
- [ ] Click/Tap en card funciona
- [ ] Ripple effect es visible en mobile
- [ ] Haptic feedback si está disponible

---

## 📚 Página: Módulos

### Hero Section
- [ ] Título es legible en móvil (18-20px)
- [ ] Descripción se entiende (14px)
- [ ] Stats se apilan verticalmente en móvil
- [ ] Stats números son grandes (24px)

### Filtros
- [ ] Search bar ocupa full width con padding
- [ ] Select dropdowns son un por línea en móvil
- [ ] Dropdowns son full-width
- [ ] Abiertos dropdowns no se salen de pantalla
- [ ] Resultado count es visible

### Module Cards
- [ ] Header con gradiente y area icon es visible
- [ ] Nivel badge está visible en top-right
- [ ] Título es claro (16-18px)
- [ ] Descripción se trunca en 3 líneas
- [ ] Stats grid: 2 columnas en móvil
- [ ] Icons en stats son pequeños (16px)
- [ ] Botón CTA es full-width con 44px min
- [ ] Cards no tienen overflow

### Empty State
- [ ] Icon centrado (48px)
- [ ] Título es claro (20px)
- [ ] Descripción es legible
- [ ] Botón "Limpiar Filtros" es visible

---

## ⚙️ Página: Configuración

### Tabs
- [ ] Tabs están en horizontal scroll en móvil
- [ ] Tabs text es legible (12px)
- [ ] Icons están visibles (16px)
- [ ] Active tab underline es visible (4px)
- [ ] No hay overflow horizontal

### Perfil Tab
- [ ] Avatar es grande (64px móvil, 96px desktop)
- [ ] "Cambiar Foto" botón es visible
- [ ] Campos en 1 columna en móvil
- [ ] Campos en 2 columnas en tablet+
- [ ] Labels son claros (12-14px)
- [ ] Inputs son tall (36-40px) para fácil typing
- [ ] Bio textarea es expandible
- [ ] Save button está al bottom

### Seguridad Tab
- [ ] "Cambiar Contraseña" section es claro
- [ ] Campos tienen buen tamaño
- [ ] Eye icon para mostrar/ocultar contraseña
- [ ] "Opciones de Seguridad" cards son clickeables
- [ ] Logout section está en rojo y visible
- [ ] Logout button es prominente

### Notificaciones Tab
- [ ] Toggles son grandes (32px mín alto)
- [ ] Labels son claros
- [ ] Descripción es visible en todas las opciones
- [ ] Toggle animation es suave
- [ ] Save button está al bottom

### General
- [ ] Success message toast es visible
- [ ] X para cerrar toast está clickeable
- [ ] Loading state muestra spinner
- [ ] No hay buttons con overlapping

---

## 🔌 Headers & Footers

### Dashboard Header (Mobile)
- [ ] Header es fixed en mobile
- [ ] Title "Dashboard" es centrado/visible
- [ ] Notifications bell es visible
- [ ] Profile avatar es grande (32px)
- [ ] Dropdown menu es visible cuando abierto

### Sidebar
- [ ] FAB button (44x44px) flotante
- [ ] FAB tiene icono visible
- [ ] Sidebar se abre/cierra con animation
- [ ] Overlay oscuro es visible
- [ ] Swipe/click cierra sidebar
- [ ] Mobile menu items tienen min-height 44px
- [ ] Icons son grandes (24px)
- [ ] Logout button es visible

---

## ♿ Accesibilidad

### Touch Targets
- [ ] Todos los botones: 44x44px mínimo
- [ ] Todos los inputs: 40px mínimo de alto
- [ ] Todos los links: 44x44px mínimo

### Focus & Navigation
- [ ] Puedes navegar con tab
- [ ] Focus states son visibles (ring visible)
- [ ] Focus order es lógico
- [ ] No hay focus traps

### Color & Contrast
- [ ] Texto sobre fondo: 4.5:1 contraste
- [ ] Hover states son visibles sin color
- [ ] Error states son claros
- [ ] Success states son claros

### Forms
- [ ] Todos los inputs tienen labels
- [ ] Labels son conectados (for/id)
- [ ] Error messages son claros
- [ ] Helper text es visible
- [ ] Required fields están marcados

### Screen Reader (si usas)
- [ ] Role ARIA correctos (button, link, etc)
- [ ] Aria-labels en icons sin texto
- [ ] Aria-describedby en inputs con help text
- [ ] Alt text en imágenes

---

## 🚀 Performance

### Rendering
- [ ] No jank durante scroll (60 fps)
- [ ] Animaciones son suaves
- [ ] No hay layout shifts visibles
- [ ] Images escalan sin distorsión

### Loading
- [ ] Página carga en < 3 segundos
- [ ] Content no parpadea
- [ ] Skeleton loaders son visibles si needed
- [ ] Error states se muestran si falla

### Memory
- [ ] No hay memory leaks visibles
- [ ] App no se congela
- [ ] DevTools console sin errors rojos

---

## 🧪 Orientación de Pantalla

### Portrait (Normal)
- [ ] Todos los tests pasan arriba
- [ ] Layout es 1 columna principalmente

### Landscape
- [ ] Contenido es visible sin scroll horizontal
- [ ] Altura es suficiente
- [ ] Grid puede cambiar (ej: 2 cols)
- [ ] No hay elementos ocultos

### Rotation
- [ ] App responde al rotar
- [ ] Layout se ajusta correctamente
- [ ] No hay crash o reload
- [ ] Estado se mantiene

---

## 🌐 Navegadores

Prueba en múltiples navegadores:

### iPhone
- [ ] Safari (default)
- [ ] Chrome
- [ ] Firefox

### Android
- [ ] Chrome
- [ ] Firefox
- [ ] Samsung Internet

### Tablets
- [ ] Safari (iPad)
- [ ] Chrome (iPad/Android)

---

## 🔴 Problemas Comunes

### ❌ Scroll Horizontal Innecesario
```
Causa: Elementos más anchos que viewport
Solución: Usar overflow-hidden, max-w-full, breakpoints
```

### ❌ Botones Muy Pequeños
```
Causa: No cumplir 44x44px mínimo
Solución: min-h-11, min-w-11, padding aumentado
```

### ❌ Texto No Legible
```
Causa: Font size < 16px, contrast bajo
Solución: text-base mínimo, contrast >= 4.5:1
```

### ❌ Inputs Difíciles de Rellenar
```
Causa: Altura insuficiente, font size auto-zoom <= 16px
Solución: py-2 md:py-3, input:disabled:-webkit-autofill
```

### ❌ Imágenes Se Cortan
```
Causa: Aspect ratio fijo, no responsive
Solución: object-cover, aspect-video, max-w-full
```

### ❌ Responsive No Funciona
```
Causa: Viewport meta tag faltante
Solución: <meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## ✅ Template Checklist

Copia y pega para cada página:

```markdown
## Testing: [PÁGINA]

### Dispositivos
- [ ] iPhone 375px
- [ ] iPhone 390px
- [ ] iPad 768px
- [ ] iPad Pro 1024px
- [ ] Desktop 1440px

### Layout
- [ ] ✅ Sin scroll horizontal
- [ ] ✅ Padding consistente
- [ ] ✅ Gaps proporcionales
- [ ] ✅ Contenido no se superpone

### Componentes
- [ ] ✅ Cards responsivas
- [ ] ✅ Grids adaptativos
- [ ] ✅ Botones 44px mín
- [ ] ✅ Inputs accesibles

### Interactividad
- [ ] ✅ Click/Tap funciona
- [ ] ✅ Animaciones suaves
- [ ] ✅ Sin errores console
- [ ] ✅ Performance 60 fps

### Accesibilidad
- [ ] ✅ Keyboard navigation
- [ ] ✅ Screen reader ok
- [ ] ✅ Contrast >= 4.5:1
- [ ] ✅ Labels en inputs

Status: ✅ PASS
```

---

## 📊 Resumen

Cuando TODOS los tests pasen:

| Categoría | Status |
|-----------|--------|
| Layout | ✅ |
| Tipografía | ✅ |
| Componentes | ✅ |
| Interactividad | ✅ |
| Accesibilidad | ✅ |
| Performance | ✅ |
| Orientación | ✅ |
| Navegadores | ✅ |

**Resultado**: Dashboard es **MOBILE-READY** 🎉

