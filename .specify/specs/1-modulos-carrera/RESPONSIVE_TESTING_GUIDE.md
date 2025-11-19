# 📱 Responsive Design Breakpoints Testing Guide

## Tailwind CSS Breakpoints

```
sm: 640px   (iPhone 12/13/14)
md: 768px   (iPad Mini)
lg: 1024px  (iPad / Small Laptop)
xl: 1280px  (Laptop)
2xl: 1536px (Desktop)
```

## Device Testing Checklist

### Mobile Phones (< 640px)
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 15 (393px)
- [ ] Galaxy S23 (360px)

**Testing Focus:**
- ✓ Hamburger menu visible
- ✓ Drawer slides from left
- ✓ Single column layout (no sidebar)
- ✓ Full-width buttons (Previous/Next)
- ✓ Touch targets >= 44px
- ✓ Text readable at 16px minimum
- ✓ Images scale properly

### Tablets (640px - 1023px)
- [ ] iPad Mini (768px)
- [ ] iPad Air (820px)
- [ ] Landscape mode (812px wide)

**Testing Focus:**
- ✓ Hamburger menu still visible
- ✓ Optional: 2-column layout emerging
- ✓ Buttons responsive
- ✓ Sidebar collapsed/drawer

### Desktop (1024px+)
- [ ] Laptop 1366px
- [ ] Full HD 1920px
- [ ] Ultra-wide 2560px

**Testing Focus:**
- ✓ 2-column layout (sidebar + content)
- ✓ Sidebar sticky
- ✓ No hamburger menu
- ✓ Full-width content
- ✓ Progress bar extended layout

## Component Responsive Behaviors

### MobileDrawer
| Breakpoint | Behavior |
|-----------|----------|
| < lg (1024px) | Visible, hamburger icon shown |
| >= lg (1024px) | Hidden |

### ModuleView
| Breakpoint | Layout |
|-----------|--------|
| < lg | 1 col (stacked) |
| >= lg | 3 col (1 sidebar, 2 content) |

### LessonNavigation
| Breakpoint | Layout |
|-----------|--------|
| < sm | Full-width stacked |
| sm-md | Full-width flex |
| >= lg | Flex with progress indicator |

### TextRenderer
| Breakpoint | Font Size |
|-----------|-----------|
| mobile | 14px (text-sm) |
| sm | 16px (text-base) |
| lg | 18px (text-lg) |

| Breakpoint | Padding |
|-----------|---------|
| mobile | px-4 (1rem) |
| sm | px-6 (1.5rem) |
| lg | px-8 (2rem) |

## Testing Commands

```bash
# Start dev server
npm run dev

# Test responsiveness in Chrome DevTools:
1. Press F12 to open DevTools
2. Click device toggle (Ctrl+Shift+M on Windows, Cmd+Shift+M on Mac)
3. Select device from dropdown or custom dimensions
4. Test each breakpoint

# Test real devices:
1. Build: npm run build
2. Run: npm run start
3. Access: http://<your-ip>:3000 from mobile/tablet
```

## Browser DevTools Sizes to Test

```javascript
// Add to browser console to test specific widths:

// Mobile
window.innerWidth = 375; // iPhone
window.innerWidth = 390; // Modern phone

// Tablet
window.innerWidth = 768; // iPad

// Desktop
window.innerWidth = 1366; // Common laptop
window.innerWidth = 1920; // Full HD
```

## Common Issues & Solutions

### Touch Targets Too Small
❌ Bad: `w-4 h-4` (16px)  
✓ Good: `min-w-[44px] min-h-[44px]` (mobile standard)

### Text Too Small
❌ Bad: `text-xs` everywhere  
✓ Good: `text-xs sm:text-sm lg:text-base`

### Content Overflow
❌ Bad: Fixed widths  
✓ Good: `w-full`, `max-w-prose`

### Images Not Responsive
❌ Bad: Fixed dimensions  
✓ Good: `w-full`, `h-auto`, `sizes="100vw"`

### Sidebar Overlapping
❌ Bad: Position fixed without z-index  
✓ Good: `z-40` for drawer, `z-30` for backdrop

## Accessibility Requirements

- [ ] Touch targets >= 44x44px on mobile
- [ ] Text >= 16px minimum (readability)
- [ ] Color contrast >= 4.5:1 (WCAG AA)
- [ ] Keyboard navigation working
- [ ] aria-labels on interactive elements
- [ ] Proper heading hierarchy

## Performance Considerations

- [ ] Mobile: < 3MB assets per page
- [ ] Lighthouse Mobile >= 90
- [ ] Lighthouse Desktop >= 90
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s

## Media Query Syntax

```tailwind
/* Mobile First Approach */
<div className="px-4 sm:px-6 lg:px-8">  /* 16px -> 24px -> 32px */
<div className="text-sm sm:text-base lg:text-lg">  /* 14px -> 16px -> 18px */
<div className="hidden lg:block">  /* Hidden on mobile, visible on lg+ */
<div className="lg:hidden">  /* Visible on mobile, hidden on lg+ */

/* Grid responsive */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
```

---

**Last Updated:** Phase 5 - Mobile Responsive Design  
**Status:** Testing Checklist Created
