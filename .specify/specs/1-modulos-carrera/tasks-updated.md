# Tasks: Módulos de Carrera con Contenido Multimedia

**Feature**: Implementación de 2 módulos de carrera (Inglés General + Inglés Específico para Automatización) con contenido multimedia (texto, audios, imágenes, videos) y evaluaciones.

**Módulos**:
1. **Inglés General** (10h, 8 lecciones, Quiz - 20 preguntas, 70% para pasar)
2. **Inglés Específico para Automatización** (15h, 10 lecciones, Exam - 25 preguntas, 75% para pasar)

**Tecnología**: Next.js 13+, TypeScript, Supabase, Framer Motion, TailwindCSS

---

## Phase 1: Setup & Infrastructure (Database & Types)

**Purpose**: Configurar base de datos, migraciones y tipos TypeScript

- [ ] T001 Crear tabla `lesson_assets` para audios, imágenes y videos en `supabase/migrations/`
- [ ] T002 Crear tabla `student_lesson_progress` para rastrear progreso en `supabase/migrations/`
- [ ] T003 Crear tabla `assessment_questions` con preguntas de evaluación en `supabase/migrations/`
- [ ] T004 [P] Crear índices en `module_id`, `lesson_id`, `student_id` para optimizar queries
- [ ] T005 [P] Implementar RLS policies para `lesson_assets` table - solo estudiantes inscritos
- [ ] T006 [P] Implementar RLS policies para `student_lesson_progress` - usuarios pueden ver su propio progreso
- [ ] T007 Configurar storage bucket `lesson-assets` en Supabase con carpetas audio/, images/, videos/
- [ ] T008 [P] Configurar RLS policies para storage bucket `lesson-assets`
- [ ] T009 Generar tipos TypeScript en `types/database.ts` con `supabase gen types` 
- [ ] T010 [P] Crear tipos custom en `types/lesson.ts`: `LessonAsset`, `StudentProgress`, `AssessmentQuestion`
- [ ] T011 [P] Crear tipos custom en `types/assessment.ts`: `Assessment`, `StudentAssessment`

**Checkpoint**: Base de datos estructurada, RLS activo, tipos generados ✅

---

## Phase 2: API Endpoints (RESTful)

**Purpose**: Implementar 5 endpoints principales con autenticación Supabase

### Endpoints a implementar:

1. **GET `/api/modules/[id]`** - Obtener módulo con todas sus lecciones
2. **GET `/api/lessons/[id]`** - Obtener lección con assets (audios, imágenes, videos)
3. **POST `/api/lessons/[id]/complete`** - Marcar lección como completada
4. **POST `/api/lessons/upload`** - Subir assets multimedia (audio, imagen, video)
5. **GET `/api/progress/[moduleId]`** - Obtener progreso del estudiante en un módulo

### Implementación:

- [ ] T012 Crear ruta `/api/modules/[id].ts` con query a DB y cache
- [ ] T013 Implementar autenticación Supabase en middleware `/middleware.ts`
- [ ] T014 [P] Crear ruta `/api/lessons/[id].ts` con relación a assets
- [ ] T015 [P] Crear ruta `/api/lessons/[id]/complete.ts` con validación y timestamp
- [ ] T016 Crear ruta `/api/lessons/upload.ts` con validación de tipo de archivo
- [ ] T017 Implementar limpieza de archivos inválidos en `/api/lessons/upload.ts`
- [ ] T018 [P] Crear ruta `/api/progress/[moduleId].ts` - agregar lesson completion tracking
- [ ] T019 [P] Crear ruta `/api/assessments/[assessmentId].ts` para obtener preguntas
- [ ] T020 [P] Crear ruta `/api/assessments/[assessmentId]/submit.ts` para enviar respuestas
- [ ] T021 Implementar error handling y logging en todas las rutas en `app/utils/api-errors.ts`
- [ ] T022 Crear tests de contratos en `__tests__/api/` para cada endpoint

**Checkpoint**: Todos los endpoints funcionales y testados ✅

---

## Phase 3: UI Components - Module & Lesson Views

**Purpose**: Componentes base para mostrar módulos y lecciones

- [ ] T023 [P] Crear `app/components/modules/ModuleView.tsx` - layout principal del módulo
- [ ] T024 [P] Crear `app/components/modules/LessonSidebar.tsx` - navegación de lecciones
- [ ] T025 [P] Crear `app/components/modules/LessonHeader.tsx` - título, progreso, navegación prev/next
- [ ] T026 Crear `app/components/modules/LessonContent.tsx` - contenedor del contenido
- [ ] T027 [P] Crear `app/components/shared/ProgressTracker.tsx` - barra de progreso visual
- [ ] T028 [P] Crear `app/components/modules/CompleteButton.tsx` - botón para marcar completo
- [ ] T029 Implementar animaciones Framer Motion en `ModuleView.tsx` - entrada, transiciones

**Checkpoint**: Estructura visual de módulos completa ✅

---

## Phase 4: Content Renderers - Multimedia

**Purpose**: Componentes para renderizar texto, audios, imágenes y videos

### Text Renderer:
- [ ] T030 [P] Crear `app/components/renderers/TextRenderer.tsx` - parsear Markdown
- [ ] T031 [P] Implementar soporte de links clicables en TextRenderer
- [ ] T032 Agregar syntax highlighting para código en TextRenderer (si aplica)

### Audio Player:
- [ ] T033 [P] Crear `app/components/renderers/AudioPlayer.tsx` - HTML5 audio element
- [ ] T034 [P] Implementar controles: play/pause, volumen, speed (0.75x-1.5x)
- [ ] T035 [P] Agregar duración y current time en AudioPlayer
- [ ] T036 Agregar accesibilidad ARIA labels en AudioPlayer

### Image Viewer:
- [ ] T037 [P] Crear `app/components/renderers/ImageViewer.tsx` - next/image optimizada
- [ ] T038 [P] Implementar lightbox expansion al click
- [ ] T039 [P] Agregar zoom in/out con mouse wheel o botones
- [ ] T040 [P] Agregar fallback para imágenes no encontradas
- [ ] T041 Agregar alt text y ARIA labels

### Video Player:
- [ ] T042 [P] Crear `app/components/renderers/VideoPlayer.tsx` - soporte YouTube/Vimeo/HTML5
- [ ] T043 [P] Implementar fullscreen mode
- [ ] T044 [P] Implementar speed controls (0.75x-1.5x)
- [ ] T045 [P] Agregar subtítulos si disponibles
- [ ] T046 Agregar poster image y loading state

### Asset Loader:
- [ ] T047 Crear `app/components/renderers/AssetRenderer.tsx` - dispatcher por tipo
- [ ] T048 Implementar lazy loading con Intersection Observer

**Checkpoint**: Todos los tipos de contenido multimedia funcionales ✅

---

## Phase 5: Mobile Responsive Design

**Purpose**: Diseño responsive para 6+ dispositivos

### Breakpoints a soportar:
- Mobile: 320px, 375px, 425px
- Tablet: 768px, 1024px
- Desktop: 1440px+

### Implementación:

- [ ] T049 Crear layout responsive en `ModuleView.tsx` para mobile-first
- [ ] T050 [P] Crear `app/components/modules/MobileDrawer.tsx` - sidebar drawer para mobile
- [ ] T051 [P] Implementar media queries TailwindCSS en ModuleView (sm, md, lg, xl, 2xl)
- [ ] T052 Ajustar tamaños de fuente para legibilidad en mobile (14px-18px)
- [ ] T053 [P] Implementar touch-friendly buttons (min 48px de altura)
- [ ] T054 [P] Crear `app/components/modules/ResponsiveGrid.tsx` para layouts adaptativos
- [ ] T055 Optimizar AudioPlayer para móvil - controles más grandes
- [ ] T056 Optimizar VideoPlayer para móvil - fullscreen automático

**Checkpoint**: Sitio completamente responsive ✅

---

## Phase 6: Progress Tracking & Completion

**Purpose**: Sistema para rastrear progreso de estudiantes

- [ ] T057 [P] Crear `app/hooks/useProgress.ts` - hook custom para progreso
- [ ] T058 [P] Crear `app/hooks/useLessonCompletion.ts` - hook para marcar completadas
- [ ] T059 Implementar POST `/api/lessons/[id]/complete` con timestamp
- [ ] T060 [P] Crear `app/contexts/ProgressContext.tsx` - estado global de progreso
- [ ] T061 Implementar persistencia en Supabase `student_lesson_progress`
- [ ] T062 Crear visual indicator en LessonSidebar para lecciones completadas
- [ ] T063 Implementar animación confetti al completar última lección (Framer Motion)
- [ ] T064 Crear `app/components/modules/ModuleCompletionModal.tsx` - modal de felicitación

**Checkpoint**: Progreso rastreado y persistido ✅

---

## Phase 7: Assessment Integration

**Purpose**: Integración de evaluaciones (quiz/exam) en módulos

- [ ] T065 [P] Crear `app/components/assessments/AssessmentView.tsx` - vista principal
- [ ] T066 [P] Crear `app/components/assessments/QuestionCard.tsx` - tarjeta de pregunta
- [ ] T067 [P] Crear `app/components/assessments/AnswerOption.tsx` - opción múltiple
- [ ] T068 Crear `app/components/assessments/Timer.tsx` - contador regresivo
- [ ] T069 Implementar lógica de calificación en `/api/assessments/[assessmentId]/submit.ts`
- [ ] T070 Crear `app/components/assessments/ResultsView.tsx` - mostrar puntaje y retroalimentación
- [ ] T071 Implementar desbloqueo condicional de módulo siguiente tras pasar evaluación
- [ ] T072 [P] Crear visualización de resultados en `/api/progress/[moduleId].ts`

**Checkpoint**: Evaluaciones funcionales y puntuación implementada ✅

---

## Phase 8: Performance & Optimization

**Purpose**: Optimizar performance para Lighthouse ≥90

- [ ] T073 Implementar Image Optimization con `next/image` en todas las imágenes
- [ ] T074 Implementar lazy loading en VideoPlayer y AssetRenderer
- [ ] T075 Crear cache strategy en `/api/modules/[id].ts` (ISR 1 hora)
- [ ] T076 Optimizar bundle size: code splitting en renderers
- [ ] T077 Implementar CDN caching headers en storage bucket
- [ ] T078 Auditar performance con Lighthouse en desktop y mobile
- [ ] T079 Optimizar Core Web Vitals: LCP <2.5s, FCP <1.5s, CLS <0.1
- [ ] T080 Implementar preload de assets críticos en LessonView
- [ ] T081 Crear service worker para offline-first (opcional pero recomendado)

**Checkpoint**: Lighthouse ≥90 en desktop y mobile ✅

---

## Phase 9: Accessibility (WCAG 2.1 AA)

**Purpose**: Cumplir con estándares de accesibilidad

- [ ] T082 Agregar alt text a todas las imágenes en ImageViewer
- [ ] T083 [P] Implementar ARIA labels en AudioPlayer (play, pause, volume, speed)
- [ ] T084 [P] Implementar ARIA labels en VideoPlayer
- [ ] T085 [P] Implementar ARIA labels en AssessmentView (timer, question, options)
- [ ] T086 Verificar contraste de color (4.5:1 en textos) con axe DevTools
- [ ] T087 Implementar keyboard navigation en VideoPlayer (arrows, space)
- [ ] T088 Implementar keyboard navigation en AssessmentView (tab, enter)
- [ ] T089 Agregar focus visible styles en todos los botones
- [ ] T090 Validar heading hierarchy (h1, h2, h3) en ModuleView
- [ ] T091 Probar con screen reader (NVDA/JAWS) - AudioPlayer, VideoPlayer

**Checkpoint**: WCAG 2.1 AA verificado ✅

---

## Phase 10: Data Integration & Testing

**Purpose**: Integración con API y testing

- [ ] T092 [P] Crear integration test para flujo completo: cargar módulo → lección → completar
- [ ] T093 [P] Crear test para progreso: verificar que se persiste y actualiza
- [ ] T094 [P] Crear test para evaluación: enviar respuestas y validar puntaje
- [ ] T095 Crear e2e test con Playwright para flujo de estudiante completo
- [ ] T096 Crear mock data en seed.sql para testing (audios, imágenes, videos de ejemplo)
- [ ] T097 Implementar error boundaries en ModuleView y LessonView
- [ ] T098 Crear fallback UI para errores de carga de assets

**Checkpoint**: Todos los tests pasando ✅

---

## Phase 11: Admin/Professor Panel

**Purpose**: Interfaz para crear y editar contenido (opcional para MVP)

- [ ] T099 [P] Crear `app/dashboard/modules/[id]/edit.tsx` - editor de módulo
- [ ] T100 [P] Crear `app/dashboard/lessons/[id]/edit.tsx` - editor de lección
- [ ] T101 Crear `app/dashboard/lessons/[id]/assets/upload.tsx` - gestor de assets
- [ ] T102 [P] Crear tabla para revisar envíos de assets (validar antes de publicar)
- [ ] T103 Implementar permisos: solo profesores/admins pueden editar
- [ ] T104 Crear vista de analytics: estudiantes completados, tiempo promedio, puntajes

**Checkpoint**: Panel de administración funcional (opcional)

---

## Phase 12: Documentation & Deployment

**Purpose**: Documentación y preparación para producción

- [ ] T105 Crear `docs/MODULES_GUIDE.md` - guía para estudiantes
- [ ] T106 Crear `docs/ADMIN_GUIDE.md` - guía para profesores
- [ ] T107 Crear `docs/API_REFERENCE.md` - documentación de endpoints
- [ ] T108 Crear `DEPLOYMENT.md` - instrucciones para deploy a producción
- [ ] T109 Crear `TROUBLESHOOTING.md` - solución de problemas comunes
- [ ] T110 Actualizar `README.md` con guía de setup local
- [ ] T111 Validar checklist de seguridad: RLS policies, auth, validaciones
- [ ] T112 Ejecutar `npm run build` y validar sin errores
- [ ] T113 Deploy a staging environment y validar en móvil/desktop

**Checkpoint**: Listo para producción ✅

---

## Dependencies & Execution Order

### Critical Path:
1. **Phase 1** → Phase 2 (bloquea todo)
2. **Phase 2** → Phases 3-7 (pueden paralelizarse después)
3. **Phases 3-7** → Phase 8 (performance después de features)
4. **Phase 8** → Phase 9 (accessibility después de performance)
5. **Phases 8-9** → Phase 10 (testing después de features completos)
6. **All Phases** → Phase 11-12 (documentación y deploy final)

### Parallelization Opportunities:

**Después de Phase 2 completa, puedes trabajar en paralelo:**
- Developer A: Phase 3 (UI Components) + Phase 5 (Responsive)
- Developer B: Phase 4 (Renderers) 
- Developer C: Phase 6 (Progress) + Phase 7 (Assessment)

Luego secuencial:
- Phase 8 (Performance)
- Phase 9 (Accessibility)
- Phase 10 (Testing)
- Phase 11-12 (Admin + Docs)

---

## Implementation Strategies

### MVP First (Fastest Path - 8-10 horas)
1. ✅ Phase 1 (1h)
2. ✅ Phase 2 (2h)
3. ✅ Phase 3 (1.5h)
4. ✅ Phase 4 - Solo TextRenderer + AudioPlayer (2h)
5. ✅ Phase 5 - Responsive básico (1h)
6. ✅ Phase 6 - Progress básico (0.5h)
7. Phase 8 - Quick audit (0.5h)

**Resultado**: MVP funcional con Inglés General completable

### Incremental (Recomendado - 15-18 horas)
Agregar a MVP:
- [ ] Phase 4 completo (todos los renderers)
- [ ] Phase 5 completo (todos los breakpoints)
- [ ] Phase 7 (Assessments)
- [ ] Phase 8 (Performance optimization)

**Resultado**: Feature completo con 2 módulos multimedia

### Production (Completo - 40-50 horas)
- [ ] Todas las fases incluidas
- [ ] Fase 11 (Admin panel)
- [ ] Testing exhaustivo
- [ ] Documentación completa

---

## Checklist de Validación

### Phase 1 Validation ✅
- [ ] Tablas creadas sin errores
- [ ] RLS policies activas
- [ ] Tipos generados sin errors

### Phase 2 Validation ✅
- [ ] Todos los 5 endpoints responden
- [ ] Autenticación requiere user_id válido
- [ ] Endpoints manejan errores gracefully

### Phase 3 Validation ✅
- [ ] ModuleView renderiza sin errores
- [ ] LessonSidebar navega correctamente
- [ ] ProgressTracker muestra estado actual

### Phase 4 Validation ✅
- [ ] TextRenderer parsea Markdown
- [ ] AudioPlayer reproducible, controles funcionales
- [ ] ImageViewer lightbox abre/cierra
- [ ] VideoPlayer fullscreen funciona

### Phase 5 Validation ✅
- [ ] 320px: Drawer lateral funciona
- [ ] 768px: Layout 2 columnas
- [ ] 1440px: Sidebar fijo, contenido expandido

### Phase 6 Validation ✅
- [ ] Click "Complete" → estado persiste
- [ ] Recarga página → progreso se mantiene
- [ ] ProgressBar actualiza visualmente

### Phase 7 Validation ✅
- [ ] Evaluación carga preguntas
- [ ] Respuestas se almacenan
- [ ] Puntaje se calcula correctamente (>75% = pasa)

### Phase 8 Validation ✅
- [ ] Lighthouse desktop ≥90
- [ ] Lighthouse mobile ≥90
- [ ] LCP <2.5s, FCP <1.5s, CLS <0.1

### Phase 9 Validation ✅
- [ ] axe DevTools sin violations
- [ ] WCAG 2.1 AA level passed
- [ ] Screen reader funciona en audios/videos

### Final Validation
- [ ] npm run build sin errores
- [ ] No console errors en dev tools
- [ ] Deploy a staging exitoso
- [ ] Mobile testing (iPhone, Android)

---

## Notes

- Commit después de cada fase o punto crítico
- Usar feature branches: `1-modulos-carrera` (ya existe)
- Validar visualmente en múltiples dispositivos
- Solicitar feedback antes de Phase 8
- Documentación inline con JSDoc comentarios
- Logs para debugging: `console.info()` no `console.log()`

