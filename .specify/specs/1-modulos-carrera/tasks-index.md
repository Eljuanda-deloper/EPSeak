# Task Index by User Story

**Purpose**: Quick reference for tasks organized by user story priority

---

## 📋 User Story 1: Acceso a Módulo (P1)
**Goal**: Estudiante puede acceder a módulo de carrera y ver contenido

**Tasks**: T026, T027, T028, T087, T088, T089, T090, T069, T070
**Timeline**: 3-4 horas
**Dependencies**: Phase 1, Phase 2 API endpoints
**Test**: `npm run test -- ModuleView`

---

## 📋 User Story 2: Consumido de Texto (P1)
**Goal**: Estudiante lee contenido Markdown con buena legibilidad

**Tasks**: T041, T042, T043, T044, T045, T072, T091, T092, T093
**Timeline**: 2-3 horas
**Dependencies**: Phase 4 (TextContent component), Phase 1 markdown utility
**Test**: `npm run test -- TextContent`

---

## 📋 User Story 3: Escuchar Audio (P1)
**Goal**: Reproductor de audio funcional con controles completos

**Tasks**: T046, T047, T048, T049, T050, T104, T105, T106, T148, T155, T161
**Timeline**: 2.5-3.5 horas
**Dependencies**: Phase 4 (AudioPlayer), Phase 8 (lazy loading)
**Test**: `npm run test -- AudioPlayer`

---

## 📋 User Story 4: Ver Imágenes (P1)
**Goal**: Imágenes optimizadas con lightbox y zoom

**Tasks**: T051, T052, T053, T054, T055, T056, T100, T101, T102, T103, T128, T129, T149, T157
**Timeline**: 2-3 horas
**Dependencies**: Phase 4 (ImageGallery, ImageLightbox), Phase 8 (optimization)
**Test**: `npm run test -- ImageGallery`

---

## 📋 User Story 5: Ver Videos (P1)
**Goal**: Reproductor de videos (YouTube, Vimeo, HTML5) funcional

**Tasks**: T057, T058, T059, T060, T061, T062, T063, T064, T104, T105, T106, T150, T156
**Timeline**: 3-4 horas
**Dependencies**: Phase 4 (VideoPlayer)
**Test**: `npm run test -- VideoPlayer`

---

## 📋 User Story 6: Marcar Completado (P2)
**Goal**: Botón para marcar lección completada + actualización progreso

**Tasks**: T029, T036, T037, T038, T077, T078, T079, T080, T081, T082, T083, T084, T085, T086, T152
**Timeline**: 2-2.5 horas
**Dependencies**: Phase 6 (useLessonProgress hook), T019-T020 (API endpoint)
**Test**: `npm run test -- useLessonProgress`

---

## 📋 User Story 7: Navegación entre Lecciones (P1)
**Goal**: Botones anterior/siguiente + sidebar con lista de lecciones

**Tasks**: T029, T030, T031, T032, T039, T040, T065, T066, T067, T068, T121, T122, T123, T124, T151
**Timeline**: 2-3 horas
**Dependencies**: Phase 3 (LessonSidebar, LessonNavigation, LessonDrawer)
**Test**: `npm run test -- LessonNavigation`

---

## 📋 User Story 8: Gestión de Contenido Admin (P2)
**Goal**: Panel admin para crear/editar módulos y subir contenido

**Tasks**: T131, T132, T133, T134, T135, T136, T137, T138, T139, T140, T141, T142, T143, T144, T145, T146
**Timeline**: 4-5 horas
**Dependencies**: Phase 10 (admin components), Phase 2 (API endpoints)
**Test**: `npm run test -- LessonForm`

---

## 📊 Tareas Transversales (No asignadas a User Story)

### Infrastructure & Setup (Phase 1)
**T001-T013**: Database, migrations, RLS, types, utilities
**Timeline**: 2-3 horas
**Status**: Foundational - complete first

### API Endpoints (Phase 2)
**T014-T025**: All 5 endpoints + authentication
**Timeline**: 3.5-4 horas
**Status**: Foundational - complete after Phase 1

### Mobile Responsiveness (Phase 5)
**T065-T076**: Mobile layout, drawer, media queries
**Timeline**: 2-3 horas
**Status**: Applicable to all user stories

### Performance (Phase 8)
**T100-T114**: Lighthouse optimization, caching
**Timeline**: 3-4 horas
**Status**: Post-development, before QA

### Accessibility (Phase 9)
**T115-T130**: WCAG 2.1 AA compliance
**Timeline**: 2-3 horas
**Status**: Post-development, before QA

### QA & Testing (Phase 11)
**T147-T164**: Manual testing, browser compatibility
**Timeline**: 3-4 horas
**Status**: Before deployment

### Documentation & Deployment (Phase 12)
**T165-T177**: Docs, release notes, production
**Timeline**: 2-3 horas
**Status**: Final phase

---

## 🎯 Implementation Suggestions

### Minimum Viable Product (MVP)
**Target**: Deployable in ~8-10 hours

1. **Essential (Phase 1)**: T001-T009 (database, RLS, storage)
2. **Essential (Phase 2)**: T014-T025 (API endpoints)
3. **Essential (Phase 3-4)**: 
   - T026-T035 (layout, sidebar, content)
   - T041-T049 (text, audio renderers)
4. **Essential (Phase 5)**: T065-T072 (mobile layout)
5. **Essential (Phase 7)**: T087-T093 (integration)

**Result**: MVP with text + audio, working on mobile, no admin UI

### Phase 2 (Enhanced)
Add:
- T051-T063 (images + videos)
- T077-T084 (progress tracking)
- T100-T114 (performance optimization)

**Result**: Full multimedia support, meets Lighthouse ≥90

### Phase 3 (Complete)
Add:
- T115-T130 (accessibility)
- T131-T146 (admin panel)
- T147-T177 (QA, deployment)

**Result**: Production-ready with admin interface

---

## 📈 Progress Tracking

```
Phase 1 (Setup):        [#########-] 90% → 100%
Phase 2 (API):          [##########] 100% ✅
Phase 3 (Components):   [--------] 0%
Phase 4 (Renderers):    [--------] 0%
Phase 5 (Mobile):       [--------] 0%
Phase 6 (Progress):     [--------] 0%
Phase 7 (Integration):  [--------] 0%
Phase 8 (Performance):  [--------] 0%
Phase 9 (A11y):         [--------] 0%
Phase 10 (Admin):       [--------] 0%
Phase 11 (QA):          [--------] 0%
Phase 12 (Deploy):      [--------] 0%

Overall: [##--------] 12% (Tasks: 0/177 complete)
```

---

## 🔗 Related Documents

- **Full Specification**: `/specs/1-modulos-carrera/spec.md`
- **Quick Start**: `/specs/1-modulos-carrera/QUICKSTART.md`
- **Requirements**: `/specs/1-modulos-carrera/checklists/requirements.md`
- **Branch**: `1-modulos-carrera`

