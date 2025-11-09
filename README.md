# EPSeak - English for Specific Purpose

Landing page profesional para EPSeak, construida con Next.js, React y TailwindCSS.

## 🎨 Características

- ✅ Diseño responsive y moderno
- ✅ Animaciones suaves con Framer Motion
- ✅ Componentes reutilizables
- ✅ Paleta de colores personalizada
- ✅ Formulario de contacto funcional
- ✅ Botón flotante de WhatsApp
- ✅ SEO optimizado

## 🎨 Paleta de Colores

```css
--azul-petroleo: #0A4E5A
--azul-celeste: #7CC4E0
--rojo-brillante: #E0312D
--blanco: #FFFFFF
--gris-suave: #E8ECEF
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
# Crear build optimizado
npm run build

# Ejecutar build de producción
npm start
```

## 📁 Estructura del Proyecto

```
epseak/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Reasons.tsx
│   │   │   ├── Companies.tsx
│   │   │   └── Contact.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       └── WhatsAppFloat.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
└── package.json
```

## 🛠️ Tecnologías

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** TailwindCSS 4
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Language:** TypeScript

## 📝 Secciones

1. **Hero** - Sección principal con llamado a la acción
2. **Testimonios** - Experiencias de estudiantes
3. **Quiénes Somos** - Información sobre EPSeak
4. **Razones** - 6 razones para elegir EPSeak
5. **Empresas** - Empresas que confían en EPSeak
6. **Contacto** - Formulario de contacto
7. **Footer** - Enlaces y redes sociales

## 🔧 Personalización

Para personalizar los colores, edita las variables CSS en `app/globals.css`:

```css
:root {
  --azul-petroleo: #0A4E5A;
  --azul-celeste: #7CC4E0;
  --rojo-brillante: #E0312D;
  --blanco: #FFFFFF;
  --gris-suave: #E8ECEF;
}
```

## 📱 WhatsApp

Para configurar el número de WhatsApp, edita `app/components/shared/WhatsAppFloat.tsx`:

```typescript
const whatsappNumber = '573113678555'; // Formato: 573113678555
```

## 📄 Licencia

© 2025 EPSeak. Todos los derechos reservados.
# EPSeak
