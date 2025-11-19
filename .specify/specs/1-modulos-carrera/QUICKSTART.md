# 🚀 QUICK START: Módulos de Carrera con Contenido Multimedia

**Branch**: `1-modulos-carrera`  
**Status**: ✅ Specification Ready  
**Spec File**: `.specify/specs/1-modulos-carrera/spec.md`

---

## 📋 Checklist de Implementación

### Phase 1: Setup & Database (2-3h)

- [ ] Crear tablas: `lessons`, `lesson_assets`, `student_lesson_progress`
- [ ] Implementar RLS policies en las tablas
- [ ] Crear Storage bucket `lesson_assets` con RLS
- [ ] Crear índices en columnas frecuentes (lesson_id, student_id, module_id)

### Phase 2: API Endpoints (3-4h)

- [ ] `GET /api/careers/:careerSlug/modules/:moduleId` - obtener módulo + lecciones
- [ ] `GET /api/careers/:careerSlug/modules/:moduleId/lessons/:lessonId` - contenido completo
- [ ] `POST /api/.../lessons/:lessonId/complete` - marcar como completada
- [ ] `POST /api/upload/lesson-asset` - subir archivos multimedia
- [ ] `GET /api/careers/:careerSlug/progress` - progreso general

### Phase 3: Components (4-5h)

**Desktop Layout**:
- [ ] `ModuleView.tsx` - contenedor principal
- [ ] `LessonSidebar.tsx` - panel lateral con lista de lecciones
- [ ] `LessonContent.tsx` - contenido principal (texto + media)
- [ ] `AudioPlayer.tsx` - reproductor de audio personalizado
- [ ] `VideoPlayer.tsx` - reproductor de video
- [ ] `ImageGallery.tsx` - galería con lightbox
- [ ] `ProgressBar.tsx` - barra de progreso del módulo

**Mobile Layout**:
- [ ] `LessonDrawer.tsx` - drawer collapsible con lecciones
- [ ] Responsive breakpoints para componentes desktop

### Phase 4: Content Rendering (2-3h)

- [ ] Markdown renderer para contenido de texto
- [ ] Audio player funcional con controles completos
- [ ] Image optimization con `next/image`
- [ ] Video embeds (YouTube, Vimeo, HTML5)
- [ ] Lightbox para imágenes expandidas

### Phase 5: Progress Tracking (2-3h)

- [ ] Marcar lección completada
- [ ] Actualizar barra de progreso
- [ ] Persistencia en BD
- [ ] Cache de progreso en cliente

### Phase 6: Testing & Optimization (3-4h)

- [ ] Unit tests para funciones críticas
- [ ] Integration tests para flows de estudiante
- [ ] Lighthouse audit (target: ≥90)
- [ ] Performance optimizations
- [ ] Accesibilidad WCAG 2.1 AA

### Phase 7: Mobile Polish & QA (2-3h)

- [ ] Testing en 6+ dispositivos
- [ ] Optimizar media queries
- [ ] Touchscreen interactions
- [ ] Offline fallbacks

---

## 🎯 Success Criteria (Quick Reference)

| Criterio | Target | Status |
|----------|--------|--------|
| Lighthouse Score | ≥ 90 | ⏳ |
| Load Time (3G) | < 2.5s | ⏳ |
| WCAG 2.1 AA | 100% | ⏳ |
| Mobile Support | 6+ devices | ⏳ |
| Test Coverage | ≥ 80% critical | ⏳ |
| Funcionalidad | 100% | ⏳ |
| UX: Navigation | Intuitiva | ⏳ |
| Data Persistence | 100% | ⏳ |

---

## 📚 Content Types Checklist

### Texto (Markdown)
- [ ] Headers, listas, bold, italic, links
- [ ] Code blocks con syntax highlighting
- [ ] Rendering seguro (sanitizado)
- [ ] Tipografía responsiva (16px móvil, 18px desktop)

### Audio (MP3, WAV, OGG)
- [ ] Reproductor HTML5 funcional
- [ ] Controles: play, pause, volumen, tiempo
- [ ] Velocidades: 0.75x, 1x, 1.25x, 1.5x
- [ ] Duración visible (MM:SS)
- [ ] Lazy loading

### Imágenes (JPG, PNG, WebP)
- [ ] Optimización con `next/image`
- [ ] Responsive sizing
- [ ] Lightbox/modal expandida
- [ ] Alt text obligatorio
- [ ] Máximo 10MB, compresión automática

### Videos (YouTube, Vimeo, HTML5)
- [ ] Embeds funcionales
- [ ] Reproductor con fullscreen
- [ ] Control de velocidad opcional
- [ ] Subtítulos (VTT)
- [ ] Responsive player
- [ ] Fallbacks

---

## 🔗 Related Documents

- **Constitution**: `.specify/memory/constitution.md`
- **Specification**: `.specify/specs/1-modulos-carrera/spec.md`
- **Checklist**: `.specify/specs/1-modulos-carrera/checklists/requirements.md`

---

## ⏱️ Time Estimation

| Phase | Hours | Status |
|-------|-------|--------|
| Phase 1: Setup & DB | 2.5h | ⏳ |
| Phase 2: API | 3.5h | ⏳ |
| Phase 3: Components | 4.5h | ⏳ |
| Phase 4: Content | 2.5h | ⏳ |
| Phase 5: Progress | 2.5h | ⏳ |
| Phase 6: Testing | 3.5h | ⏳ |
| Phase 7: QA & Polish | 2.5h | ⏳ |
| **TOTAL** | **~21.5h** | ⏳ |

---

## 🚨 Critical Notes

1. **Autenticación debe funcionar** - Asumir auth completa en dashboard
2. **RLS es mandatory** - Estudiantes solo ven contenido de carreras inscritas
3. **Mobile first** - Diseñar móvil primero, luego escalar a desktop
4. **Performance** - Lazy load todo (audio, imágenes, videos)
5. **Accesibilidad** - WCAG 2.1 AA no es opcional
6. **Testing** - Constitution requiere 80% coverage mínimo

---

**Next Action**: Ejecutar `/speckit.plan` para crear plan de implementación detallado

