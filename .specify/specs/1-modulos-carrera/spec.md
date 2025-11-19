# Feature Specification: Módulos de Carrera con Contenido Multimedia

**Feature Branch**: `1-modulos-carrera`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: Implementación de dos módulos de carrera con contenido multimedia (texto, audio, imágenes, videos)

## User Scenarios & Testing

### User Story 1 - Estudiante Accede a Módulo de Carrera (Priority: P1)

El estudiante inscrito en una carrera (ej: Tech English Professional) accede al dashboard, ve la lista de módulos y entra a uno de ellos para consumir el contenido multimedia.

**Why this priority**: Core functionality - estudiantes necesitan acceder al contenido principal de la carrera.

**Independent Test**: Un estudiante autenticado puede navegar a `/dashboard/careers/tech/module/1` y ver el contenido del módulo cargado completamente.

**Acceptance Scenarios**:

1. **Given** estudiante está en Dashboard, **When** hace click en "Módulos", **Then** ve lista de módulos disponibles con progreso
2. **Given** estudiante abre un módulo, **When** carga la página, **Then** ve título, descripción, duración y contenido multimedia
3. **Given** módulo tiene múltiples lecciones, **When** estudiante navega entre ellas, **Then** transición es suave sin recargas
4. **Given** estudiante cierra/abre el módulo nuevamente, **When** retorna, **Then** su posición anterior se mantiene

---

### User Story 2 - Consumir Contenido de Texto (Priority: P1)

El estudiante lee el contenido de texto principal de la lección, con formato profesional, buen contraste y tipografía legible.

**Why this priority**: Contenido de texto es el fundamento de cada lección.

**Independent Test**: El contenido de texto se renderiza correctamente con formato markdown, enlaces funcionales y buena legibilidad en móvil y desktop.

**Acceptance Scenarios**:

1. **Given** lección abierta, **When** se carga el contenido, **Then** texto es legible (tamaño >= 16px en móvil)
2. **Given** contenido incluye listas y énfasis, **When** se renderiza, **Then** jerarquía visual es clara
3. **Given** texto tiene enlaces internos, **When** hace click, **Then** navega sin perder contexto (o abre nueva pestaña si es externo)
4. **Given** contenido es largo, **When** usuario hace scroll, **Then** no hay jank/lag

---

### User Story 3 - Escuchar Audio de la Lección (Priority: P1)

El estudiante puede escuchar el audio de pronunciación, explicación o diálogos de la lección con controles intuitivos.

**Why this priority**: Aspecto crítico de aprendizaje de idiomas - pronunciación y escucha son esenciales.

**Independent Test**: Reproductor de audio funciona en navegadores modernos, tiene controles de play/pause/volumen, y muestra duración.

**Acceptance Scenarios**:

1. **Given** lección contiene audio, **When** se carga, **Then** reproductor de audio visible y funcional
2. **Given** audio está disponible, **When** usuario presiona play, **Then** se reproduce sin delays (< 1s)
3. **Given** audio está reproduciendo, **When** usuario baja volumen o pausa, **Then** controles responden instantáneamente
4. **Given** audio termina, **When** reproductor alcanza el final, **Then** puede repetir o pasar a siguiente audio
5. **Given** usuario está en móvil, **When** reproduce audio, **Then** no interfiere con navegación de la página

---

### User Story 4 - Ver Imágenes e Infografías (Priority: P1)

El estudiante ve imágenes, diagramas e infografías que ilustran conceptos, con capacidad de zoom/expansión.

**Why this priority**: Imágenes mejoran comprensión y retención del contenido.

**Independent Test**: Las imágenes se cargan rápidamente, se ven nítidas en todos los dispositivos, y tienen texto alternativo para accesibilidad.

**Acceptance Scenarios**:

1. **Given** lección contiene imágenes, **When** se cargan, **Then** aparecen rápidamente (< 2s) sin layout shift
2. **Given** imagen está en la página, **When** usuario hace click, **Then** se abre en vista expandida/lightbox
3. **Given** usuario ve imagen expandida, **When** cierra la vista, **Then** retorna a la posición anterior en la página
4. **Given** imagen es diagrama técnico, **When** se ve en móvil, **Then** se puede hacer zoom sin perder calidad
5. **Given** imagen no carga, **When** intenta cargar nuevamente, **Then** muestra placeholder con mensaje "Reintentar"

---

### User Story 5 - Ver Videos de la Lección (Priority: P1)

El estudiante ve videos embedded de explicaciones, pronunciación, diálogos o demostraciones con controles de reproducción.

**Why this priority**: Videos son el medio principal de enseñanza de idiomas en plataformas modernas.

**Independent Test**: Reproductor de video funciona en todos los navegadores, maneja bufering correctamente, y permite control de velocidad.

**Acceptance Scenarios**:

1. **Given** lección contiene video, **When** se carga la página, **Then** reproductor visible con thumbnail
2. **Given** usuario presiona play, **When** video inicia, **Then** empieza a reproducirse sin delays significativos (< 2s)
3. **Given** video está reproduciendo, **When** usuario pausa, **Then** puede continuar desde donde pausó
4. **Given** video está reproduciendo, **When** usuario maximiza pantalla, **Then** video se expande a pantalla completa
5. **Given** conexión es lenta, **When** video se está buffering, **Then** muestra indicador de buffering y no detiene reproducción
6. **Given** usuario está en móvil, **When** abre video, **Then** puede elegir entre quality auto/HD/SD según ancho de banda
7. **Given** video tiene subtítulos, **When** usuario lo abre, **Then** puede activar/desactivar subtítulos

---

### User Story 6 - Marcar Lección como Completada (Priority: P2)

El estudiante puede marcar una lección como completada y ver el progreso del módulo actualizado.

**Why this priority**: Importante para tracking de progreso pero no bloquea acceso a contenido.

**Independent Test**: Botón "Marcar como completado" funciona, actualiza progreso en tiempo real, y persiste en la base de datos.

**Acceptance Scenarios**:

1. **Given** estudiante termina de leer/escuchar contenido, **When** hace click en "Marcar como completado", **Then** botón cambia a "✓ Completado"
2. **Given** lección está marcada completada, **When** estudiante actualiza la página, **Then** estado persiste
3. **Given** módulo tiene múltiples lecciones, **When** estudiante completa una, **Then** barra de progreso se actualiza (ej: 1/3 completadas)
4. **Given** estudiante completa todas las lecciones, **When** progreso llega a 100%, **Then** módulo muestra "✓ Completado" con badge

---

### User Story 7 - Navegación Entre Lecciones (Priority: P1)

El estudiante puede navegar entre lecciones del módulo de forma intuitiva (botones anterior/siguiente o panel lateral).

**Why this priority**: Navegación es essential para user experience fluida.

**Independent Test**: Botones de navegación funcionan, los enlaces activos se destacan, y no hay saltos inesperados.

**Acceptance Scenarios**:

1. **Given** estudiante está en una lección, **When** ve botón "Siguiente", **Then** puede ir a la siguiente lección sin recargar
2. **Given** estudiante está en la primera lección, **When** busca botón "Anterior", **Then** botón está deshabilitado (grisáceo)
3. **Given** estudiante está en última lección, **When** busca botón "Siguiente", **Then** botón muestra "Completar módulo" o está deshabilitado
4. **Given** módulo está abierto, **When** ve panel lateral, **Then** lista de lecciones está visible y lección actual está resaltada
5. **Given** usuario está en móvil, **When** abre módulo, **Then** panel de lecciones es accesible (collapsible o drawer)

---

### User Story 8 - Gestión de Contenido Multimedia por Profesor (Priority: P2)

El profesor/admin puede subir y gestionar contenido multimedia (audio, imágenes, videos) para cada lección.

**Why this priority**: Importante para mantenibilidad pero puede hacerse después de interface de estudiante.

**Independent Test**: Profesor puede subir archivos, gestionar URLs de videos, y editar contenido sin escribir código.

**Acceptance Scenarios**:

1. **Given** profesor está en panel de administración, **When** accede a editar módulo, **Then** ve formulario para agregar lecciones
2. **Given** profesor está creando lección, **When** sube archivo de audio, **Then** se carga correctamente y aparece en preview
3. **Given** lección tiene video, **When** profesor agrega URL de YouTube/Vimeo, **Then** se embeda automáticamente
4. **Given** profesor sube imagen, **When** la confirma, **Then** se optimiza y se almacena en Storage público

---

## Requirements

### Functional Requirements

#### Contenido de Texto
- FR1: Sistema debe soportar contenido en formato Markdown con sintaxis completa (headers, listas, bold, italic, links, code blocks)
- FR2: Contenido debe renderizarse con HTML sanitizado (sin scripts maliciosos)
- FR3: Enlaces deben abrirse en nueva pestaña (target="_blank") si son externos
- FR4: Tipografía debe ser responsiva: 16px en móvil, 18px en desktop mínimo

#### Contenido de Audio
- FR5: Soporte para archivos MP3, WAV, OGG (formatos estándares de audio web)
- FR6: Reproductor nativo HTML5 con controles: play, pause, volumen, barra de tiempo
- FR7: Audio debe cargar de Storage de Supabase o URL externa con CORS configurado
- FR8: Mostrar duración del audio formateada (MM:SS)
- FR9: Permite reproducción a velocidad 0.75x, 1x, 1.25x, 1.5x

#### Contenido de Imágenes
- FR10: Soporte para formatos JPG, PNG, WebP
- FR11: Imágenes optimizadas con `next/image` para lazy loading y responsive sizing
- FR12: Lightbox/modal para vista expandida de imágenes
- FR13: Atributo `alt` obligatorio para cada imagen (accesibilidad)
- FR14: Máximo 10MB por imagen, compresión automática recomendada

#### Contenido de Videos
- FR15: Soporte para embeds de YouTube, Vimeo y videos auto-hosted en Storage
- FR16: Reproductor con controles: play, pause, fullscreen, volumen, barra de tiempo
- FR17: Opcional: control de velocidad (0.75x, 1x, 1.25x, 1.5x)
- FR18: Subtítulos soportados (VTT format)
- FR19: Responsive player que se ajusta a diferentes tamaños de pantalla
- FR20: Fallback para navegadores sin soporte de video

#### Estructura de Datos
- FR21: Tabla `lessons` con: id, module_id, title, description, order, content_text, created_at, updated_at
- FR22: Tabla `lesson_assets` con: id, lesson_id, type (audio/image/video), file_url, file_name, duration (para audio/video), created_at
- FR23: Tabla `student_lesson_progress` con: id, student_id, lesson_id, completed_at, time_spent_seconds, last_accessed_at
- FR24: RLS policies para garantizar estudiantes solo vean contenido de carreras inscritas

#### API Endpoints
- FR25: `GET /api/careers/:careerSlug/modules/:moduleId` - obtener módulo con lecciones
- FR26: `GET /api/careers/:careerSlug/modules/:moduleId/lessons/:lessonId` - obtener lección completa
- FR27: `POST /api/careers/:careerSlug/modules/:moduleId/lessons/:lessonId/complete` - marcar como completada
- FR28: `POST /api/upload/lesson-asset` - subir archivo multimedia
- FR29: `GET /api/careers/:careerSlug/progress` - obtener progreso general del estudiante

#### Interface de Estudiante
- FR30: Página de módulo con lista de lecciones en sidebar (desktop) o drawer (móvil)
- FR31: Página de lección con contenido multimedia rendered lado a lado (texto + media en desktop, stacked en móvil)
- FR32: Barra de progreso del módulo mostrando N de M lecciones completadas
- FR33: Breadcrumbs: Carrera > Módulo > Lección actual
- FR34: Botones de navegación: Anterior/Siguiente con estados (deshabilitado si es primera/última)
- FR35: Tiempo estimado para completar lección/módulo
- FR36: Indicador visual de lecciones completadas (checkmark o color diferente)

#### Performance & Optimización
- FR37: Audio/videos deben cargar lazy (no cargar todos al mismo tiempo)
- FR38: Imágenes deben servirse en WebP con fallback a JPG
- FR39: Caché de contenido con service worker para modo offline parcial
- FR40: Compresión de assets: audio bitrate 128kbps, videos 720p máximo recomendado

---

## Success Criteria

1. **Funcionalidad**: Estudiantes pueden ver y consumir todo tipo de contenido multimedia en ambos módulos (Texto: 100%, Audio: 100%, Imágenes: 100%, Videos: 100%)

2. **Performance**: Lighthouse score ≥ 90 en página de módulo (target: 95+). Tiempo de carga inicial < 2.5s en conexión 3G.

3. **Accesibilidad**: Cumplir WCAG 2.1 AA - imágenes con alt text, videos con subtítulos opcionales, contraste 4.5:1 mínimo

4. **Responsividad**: Contenido se ve correctamente en 6+ dispositivos: iPhone SE, iPhone 15, iPad, Desktop 1366px, Desktop 1920px, Tablet 768px

5. **User Experience**: Navegación entre lecciones es intuitiva, progreso se actualiza en tiempo real (< 500ms), no hay loading delays perceptibles

6. **Data Persistence**: Progreso de estudiante se guarda en base de datos y persiste entre sesiones (F5 no borra estado)

7. **Seguridad**: RLS enforce que estudiantes solo vean módulos de carreras inscritas. Assets privados requieren autenticación

8. **Coverage**: 80% test coverage mínimo para funciones críticas (contentido loading, progreso tracking, navigation)

---

## Assumptions

- Estudiantes ya están autenticados y tienen carrera asignada (auth funciona)
- Archivos multimedia (audio, imágenes, videos) están pre-cargados o URLs públicas disponibles
- YouTube/Vimeo APIs disponibles para embeds
- Supabase Storage está configurado y RLS implementado
- Navegadores target: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Tamaño máximo recomendado: audio 50MB, videos 500MB (auto-hosted), imágenes 10MB
- Estudiantes tienen conexión mínima de 3G para videos
- Próximas iteraciones pueden incluir: quizzes, ejercicios interactivos, certificados

---

## Technical Notes

- Usar `next/image` para todas las imágenes
- HTML5 `<audio>` y `<video>` tags nativos, no librerías pesadas
- Contenido Markdown convertido con `remark` o `markdown-it`
- Storage: Supabase `lesson_assets` bucket con RLS
- Considerar `MediaSession API` para controles de audio/video en móvil

