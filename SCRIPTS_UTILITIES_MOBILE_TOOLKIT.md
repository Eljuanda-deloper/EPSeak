# 🛠️ Scripts & Utilities - Mobile Development Toolkit

Herramientas y scripts útiles para trabajar con mobile design.

---

## 📦 npm Scripts

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    "mobile": "NEXT_PUBLIC_DEVICE=mobile npm run dev",
    "tablet": "NEXT_PUBLIC_DEVICE=tablet npm run dev",
    "desktop": "NEXT_PUBLIC_DEVICE=desktop npm run dev",
    
    "lighthouse": "lighthouse http://localhost:3000/dashboard --view",
    "lighthouse:mobile": "lighthouse http://localhost:3000/dashboard --view --emulated-form-factor=mobile",
    
    "test:a11y": "jest --testPathPattern=a11y",
    "test:mobile": "jest --testPathPattern=mobile",
    "test:performance": "jest --testPathPattern=performance",
    
    "format": "prettier --write \"app/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"app/**/*.{ts,tsx}\"",
    
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

### Uso:
```bash
npm run dev              # Desarrollo normal
npm run mobile          # Dev con viewport móvil
npm run lighthouse      # Audit performance
npm run format          # Formatear código
```

---

## 🔍 DevTools Scripts (Console)

Copia y pega en DevTools Console para debugging rápido:

### 1. Ver viewport actual
```javascript
console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
console.log(`Is Mobile: ${window.matchMedia("(max-width: 768px)").matches}`);
console.log(`Is Tablet: ${window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches}`);
console.log(`Is Desktop: ${window.matchMedia("(min-width: 1025px)").matches}`);
```

### 2. Validar touch targets
```javascript
// Find buttons smaller than 44px
const buttons = document.querySelectorAll('button, a, [role="button"]');
const small = Array.from(buttons).filter(btn => {
  const rect = btn.getBoundingClientRect();
  return rect.width < 44 || rect.height < 44;
});
console.log(`Buttons < 44px: ${small.length}`);
small.forEach(btn => console.log(btn, btn.getBoundingClientRect()));
```

### 3. Validar contrast ratio
```javascript
// Check contrast ratios (requires extra logic, simplified version)
const elements = document.querySelectorAll('p, a, button, span');
elements.forEach(el => {
  const color = window.getComputedStyle(el).color;
  const bg = window.getComputedStyle(el).backgroundColor;
  console.log(`${el.tagName}: ${color} on ${bg}`);
});
```

### 4. Simular scroll performance
```javascript
let frameCount = 0;
let lastTime = performance.now();

function measurePerformance() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(measurePerformance);
}

measurePerformance();
```

### 5. Simular network throttling
```javascript
// En Network tab: click dropdown "No throttling"
// Selecciona "Slow 3G" o "Fast 3G"
console.log('Network throttled - observe LCP/FID improvements');
```

---

## 🏗️ Estructura de Carpetas Recomendada

```
app/
├── components/
│   ├── patterns/              [← NEW]
│   │   ├── ResponsiveCard.tsx
│   │   ├── ResponsiveGrid.tsx
│   │   ├── ResponsiveButton.tsx
│   │   ├── ResponsiveInput.tsx
│   │   └── index.ts
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── hooks/
│   ├── useResponsive.ts       [← NEW]
│   ├── useMediaQuery.ts       [← NEW]
│   └── useTouchDevice.ts      [← NEW]
│
├── utils/
│   ├── mobile.ts              [← NEW]
│   ├── breakpoints.ts         [← NEW]
│   └── validators.ts          [← NEW]
│
└── types/
    └── responsive.ts          [← NEW]
```

---

## 📝 Hooks Útiles

### `useResponsive.ts`
```typescript
import { useEffect, useState } from 'react';

export function useResponsive() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) setDevice('mobile');
      else if (width < 1024) setDevice('tablet');
      else setDevice('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { device };
}
```

### `useMediaQuery.ts`
```typescript
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Uso:
// const isMobile = useMediaQuery('(max-width: 768px)');
```

### `useTouchDevice.ts`
```typescript
import { useEffect, useState } from 'react';

export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const hasTouch = () => {
      return (
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0 ||
        'ontouchstart' in window
      );
    };

    setIsTouch(hasTouch());
  }, []);

  return isTouch;
}
```

---

## 🎨 Utility Functions

### `breakpoints.ts`
```typescript
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function getBreakpoint(width: number): keyof typeof breakpoints {
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
}

// Uso:
// const breakpoint = getBreakpoint(window.innerWidth);
```

### `mobile.ts`
```typescript
export const mobileConfig = {
  minTouchTarget: 44,        // WCAG AA
  minFontSize: 12,           // Readable
  minContrast: 4.5,          // WCAG AA
  maxLayoutWidth: 1280,      // Max container width
  gapMobile: 12,             // Gap en móvil
  gapTablet: 16,
  gapDesktop: 24,
};

export function isMobileViewport(width: number): boolean {
  return width < 640;
}

export function isTabletViewport(width: number): boolean {
  return width >= 640 && width < 1024;
}

export function isDesktopViewport(width: number): boolean {
  return width >= 1024;
}
```

---

## 🧪 Testing Utilities

### `setupMobile.ts` - Para tests
```typescript
export function setupMobileViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  });

  window.dispatchEvent(new Event('resize'));
}

export function setupTabletViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  window.dispatchEvent(new Event('resize'));
}

export function setupDesktopViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1440,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 900,
  });

  window.dispatchEvent(new Event('resize'));
}
```

### Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { setupMobileViewport } from '@/__tests__/utils/setupMobile';
import Dashboard from '@/app/dashboard/page';

describe('Dashboard - Mobile', () => {
  beforeEach(() => {
    setupMobileViewport();
  });

  it('renders on mobile without horizontal scroll', () => {
    render(<Dashboard />);
    const container = screen.getByRole('main');
    
    expect(container).toBeInTheDocument();
    expect(container.scrollWidth).toBe(container.clientWidth);
  });

  it('buttons are at least 44px', () => {
    render(<Dashboard />);
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });
});
```

---

## 📊 Monitoring Script

### `metrics.ts` - Track performance
```typescript
export function captureMetrics() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  const perfData = performance.getEntriesByType('navigation')[0];
  
  const metrics = {
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    lcp: 0, // Use Web Vitals library for accurate LCP
    cls: 0, // Use Web Vitals library for accurate CLS
    
    domInteractive: perfData?.domInteractive,
    domComplete: perfData?.domComplete,
    loadComplete: perfData?.loadEventEnd,
    
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    isMobile: window.innerWidth < 768,
  };

  console.table(metrics);
  return metrics;
}

// Llama al cargar la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', captureMetrics);
}
```

---

## 🚀 Automated Testing Script

### `run-mobile-tests.sh`
```bash
#!/bin/bash

echo "🚀 Running Mobile Testing Suite..."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Build Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build successful"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Linting Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi
echo "✅ Linting passed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Type Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi
echo "✅ Type check passed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Mobile Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run test:mobile
if [ $? -ne 0 ]; then
  echo "❌ Mobile tests failed"
  exit 1
fi
echo "✅ Mobile tests passed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All checks passed! Ready for deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

### Ejecutar:
```bash
chmod +x run-mobile-tests.sh
./run-mobile-tests.sh
```

---

## 🔧 GitHub Actions Workflow

### `.github/workflows/mobile-check.yml`
```yaml
name: Mobile Check

on: [push, pull_request]

jobs:
  mobile-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
      
      - name: Mobile Tests
        run: npm run test:mobile
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouse.config.js'
          uploadArtifacts: true
```

---

## 📈 Lighthouse Config

### `lighthouse.config.js`
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/dashboard'],
      numberOfRuns: 1,
      settings: {
        configPath: './lighthouse.config.json',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## 🎯 Environment Variables

### `.env.local`
```bash
# Mobile Development
NEXT_PUBLIC_DEVICE_DEBUG=true
NEXT_PUBLIC_ENABLE_MOBILE_LOG=true
NEXT_PUBLIC_MOCK_SLOW_NETWORK=false

# Lighthouse
LIGHTHOUSE_API_KEY=your_key_here

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

---

## 📋 Pre-Commit Hook

### `.git/hooks/pre-commit`
```bash
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Lint
echo "Linting..."
npm run lint:fix
git add -u

# Type check
echo "Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# Mobile tests
echo "Running mobile tests..."
npm run test:mobile
if [ $? -ne 0 ]; then
  echo "❌ Mobile tests failed"
  exit 1
fi

echo "✅ All checks passed!"
```

### Setup:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 🎨 VS Code Settings

### `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "classList",
    "ngClass"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "search.exclude": {
    "**/node_modules": true,
    ".next": true
  }
}
```

### `.vscode/extensions.json`
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-playwright.playwright",
    "firefox-devtools.vscode-firefox-debug"
  ]
}
```

---

## 🚦 Quick Commands

### Development
```bash
npm run dev                 # Start dev
npm run mobile              # Dev con móvil
npm run format              # Auto-format
npm run type-check:watch    # Type check en watch
```

### Building
```bash
npm run build              # Build para producción
npm run start              # Start producción local
```

### Testing
```bash
npm run lint               # Lint check
npm run test:mobile        # Mobile tests
npm run lighthouse         # Lighthouse audit
npm run test:a11y          # Accesibilidad tests
```

### Utilities
```bash
npm run format:check       # Verificar formatting
./run-mobile-tests.sh      # Suite completa
```

---

## 💾 Backup & Recovery

### Backup de cambios
```bash
git stash save "mobile-wip"
git stash list
```

### Recuperar cambios
```bash
git stash pop
```

### Ver cambios no commiteados
```bash
git diff
git diff --cached
```

---

## 📊 Performance Budgets

Mantén estos límites:

```javascript
// performance-budget.json
[
  {
    "type": "bundle",
    "name": "main",
    "size": "200kb",
    "priority": "high"
  },
  {
    "type": "bundle",
    "name": "styles",
    "size": "50kb",
    "priority": "high"
  },
  {
    "type": "bundle",
    "name": "images",
    "size": "100kb",
    "priority": "medium"
  }
]
```

---

## ✅ Checklist Final

Antes de cada commit:

```
[ ] npm run lint → 0 errors
[ ] npm run type-check → 0 errors
[ ] npm run build → exitoso
[ ] npm run test:mobile → passing
[ ] DevTools → no errors
[ ] Lighthouse → > 90
[ ] Mobile tested → OK
[ ] Commit message: descriptivo
```

---

**Este toolkit te ayuda a mantener calidad consistente durante el desarrollo mobile.**

Última actualización: 2024

