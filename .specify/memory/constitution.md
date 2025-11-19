<!--
SYNC IMPACT REPORT - Constitution Version 1.0.0 (2025-11-19)
===============================================================

VERSION CHANGE:
- Previous version: None (initial creation)
- New version: 1.0.0
- Bump type: Initial Release

PRINCIPLES DEFINED (8 core principles):
1. Mobile-First & Responsive Design
2. TypeScript Strict Mode & Type Safety
3. Accessibility First (WCAG 2.1 AA)
4. Component Reusability & Documentation
5. Security & Authentication (Supabase RLS)
6. Performance & Lighthouse Standards
7. Documentation as Code
8. Testing & Quality Gates

ADDITIONAL SECTIONS:
- Development Standards (Code Quality, API Design, Styling, Component Organization, Database Practices)
- Quality Gates (Before Commit, Before Merge/Deploy, Performance Targets)
- Governance (Amendment Process, Versioning, Runtime Guidance)

TEMPLATES ALIGNMENT:
✅ plan-template.md - Already includes "Constitution Check" gate (line ~29)
✅ spec-template.md - User stories align with accessibility and testing principles
✅ tasks-template.md - Task organization aligns with quality gates and phases
⚠ No breaking changes to existing templates required

DEPENDENT DOCUMENTATION:
✅ PUNTO_DE_PARTIDA_EMPIEZA_AQUI.md - Aligns with mobile-first principle
✅ QUICK_REFERENCE_MOBILE_DESIGN.md - Implements responsive design principle
✅ COMPONENTES_PATRONES_RESPONSIVOS.md - Supports reusability principle
✅ CHECKLIST_TESTING_MOVIL.md - Implements testing principle
✅ TIPS_TRICKS_MOBILE_DEVELOPMENT.md - Supports performance principle

GUIDANCE FILES REFERENCED:
- PUNTO_DE_PARTIDA_EMPIEZA_AQUI.md (getting started)
- QUICK_REFERENCE_MOBILE_DESIGN.md (mobile reference)
- COMPONENTES_PATRONES_RESPONSIVOS.md (patterns)
- TIPS_TRICKS_MOBILE_DEVELOPMENT.md (best practices)

FOLLOW-UP TODOS:
- None at this time. All principles are concrete and actionable.

RATIFICATION NOTES:
- Constitution created based on established project practices
- All 8 principles derived from successful project outcomes
- Lighthouse score 94+ achieved
- Mobile design on 6+ device sizes validated
- Security with Supabase RLS implemented
- Testing framework in place (Jest)
- Documentation comprehensive (25+ files)

-->

# EPSeak Constitution

## Core Principles

### I. Mobile-First & Responsive Design
Every component MUST be designed and tested for mobile devices first, then scaled to desktop. Responsive breakpoints (sm, md, lg, xl) are mandatory. All components must support 6+ device sizes (iPhone SE, iPhone 12, iPhone 15, iPad, Desktop 1366px, Desktop 1920px). Tailwind CSS responsive prefixes are non-negotiable.

### II. TypeScript Strict Mode & Type Safety
All code MUST use TypeScript with strict mode enabled. No `any` types permitted without explicit justification. Interfaces and types must be documented. Client components clearly marked with `"use client"`. Server components used when appropriate for performance and security.

### III. Accessibility First (WCAG 2.1 AA)
Components MUST meet WCAG 2.1 AA standards minimum. All interactive elements must have proper ARIA labels. Form inputs require explicit labels. Color contrast ratios must exceed 4.5:1. Keyboard navigation must be fully supported. Semantic HTML required.

### IV. Component Reusability & Documentation
Reusable components live in `app/components/shared/` or `app/components/[feature]/`. Each component requires JSDoc comments explaining props, usage, and examples. Complex components documented in `COMPONENTES_PATRONES_RESPONSIVOS.md`. No copy-paste code across multiple files.

### V. Security & Authentication (Supabase RLS)
Row-Level Security (RLS) MUST be enforced on all database tables. AuthContext manages authentication state. Environment variables for sensitive data. Next.js middleware refreshes tokens automatically. Client-side validation for UX only; server-side validation enforced. Password stored via Supabase Auth, never in custom fields.

### VI. Performance & Lighthouse Standards
Lighthouse score minimum 90 across all metrics (Performance, Accessibility, Best Practices, SEO). Lazy loading for images. Code splitting for large components. Framer Motion animations performance-tested. Image optimization required (use `next/image`). Font loading optimized with `font-display: swap`.

### VII. Documentation as Code
Technical documentation lives in markdown files in the project root. Every major feature gets a documentation file with setup, usage examples, and troubleshooting. INDICE_COMPLETO_DOCUMENTACION.md tracks all documentation. Outdated docs marked with deprecation notices.

### VIII. Testing & Quality Gates
Unit tests for utilities and hooks. Integration tests for auth flows and API endpoints. Testing with Jest and React Testing Library. Before commit: lint check, type check, test pass. Test coverage target: 80% minimum for critical paths.

## Development Standards

### Code Quality
- ESLint strict configuration applied
- Prettier auto-formatting on save
- No console.log() in production code (use structured logging)
- Component exports at end of file
- Props destructured in component signatures

### API Design
Route handlers in `app/api/[feature]/route.ts`. All endpoints require authentication (except public endpoints like /api/auth/*). Consistent error responses with status codes. CORS headers configured for Supabase.

### Styling
- TailwindCSS utility-first approach mandatory
- Custom colors defined in `tailwind.config.js`
- No inline styles; use className only
- Consistent spacing scale: 4px increments (px-4, py-8, gap-6)
- Color palette: azul-petroleo (#0A4E5A), azul-celeste (#7CC4E0), rojo-brillante (#E0312D)

### Component Organization
```
app/components/
├── layout/           (Header, Footer, Sidebar, DashboardLayout)
├── home/            (Landing page components)
├── auth/            (Login, Register, Callback)
├── dashboard/       (Dashboard-specific)
├── careers/         (Career detail components)
├── shared/          (Button, Card, Modal, Toast)
└── providers/       (Contexts, Providers)
```

### Database Practices
- Migrations in `supabase/migrations/` with timestamp prefix
- RLS policies on every table
- Indexes on frequently queried columns
- Proper foreign key relationships
- Seed data in `supabase/seed.sql`

## Quality Gates

### Before Commit
```bash
npm run lint           # ESLint must pass
npm run type-check    # TypeScript strict mode
npm run test          # Jest tests must pass
npm run build         # Next.js build must succeed
```

### Before Merge/Deploy
- Lighthouse score ≥ 90
- Zero critical vulnerabilities
- All tests passing
- Documentation updated if feature-related
- Mobile testing on 3+ devices completed

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

## Governance

The constitution supersedes all other development practices. All PRs must verify compliance with these principles. When ambiguity arises, complexity must be justified through documented decision rationale in the PR description or a decision document.

### Amendment Process
1. Propose amendment in PR description or decision document
2. Justify change with rationale: why is the change needed?
3. Identify affected principles and update impact
4. Update all dependent artifacts (templates, docs, code patterns)
5. Record amendment in constitution with new version

### Versioning
Constitution uses semantic versioning:
- **MAJOR**: Principle removal or fundamental redefinition
- **MINOR**: New principle or material principle expansion
- **PATCH**: Clarifications, wording updates, non-semantic refinements

### Runtime Guidance
For development-time decision-making beyond this constitution, refer to:
- `PUNTO_DE_PARTIDA_EMPIEZA_AQUI.md` - Getting started guidance
- `QUICK_REFERENCE_MOBILE_DESIGN.md` - Mobile development reference
- `COMPONENTES_PATRONES_RESPONSIVOS.md` - Component patterns
- `TIPS_TRICKS_MOBILE_DEVELOPMENT.md` - Best practices and debugging

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
