# Plan de Implementación Mejorado: Sistema de Carreras con Módulos Bloqueados en EPSeak

## Introducción Mejorada

Este documento detalla el plan de implementación mejorado para el dashboard de estudiantes EPSeak, incorporando un **sistema de carreras con módulos bloqueados**. El sistema gamifica el aprendizaje al bloquear módulos secuenciales hasta que el estudiante complete el módulo anterior, creando una "carrera" de progreso educativo.

**Proyecto Supabase existente:** epseakwebside-dev's Project (ID: nrgqbrwqrzbjsujgyput)

**Objetivos Mejorados:**
- Implementar sistema de carreras con módulos bloqueados secuenciales
- Gestionar progreso de estudiante con validaciones robustas
- Integrar con autenticación existente usando mejores prácticas de Next.js
- Aplicar paleta de colores EPSeak (#E8ECEF, #0A4E5A, #7CC4E0, #E0312D)
- Implementar manejo avanzado de errores y optimizaciones de rendimiento
- Seguridad RLS avanzada con políticas basadas en progreso
- Métricas de éxito actualizadas con tracking de carreras

**Arquitectura Mejorada:**
- **Backend:** Supabase (PostgreSQL + Edge Functions con RLS avanzada)
- **Frontend:** Next.js con TypeScript, autenticación DAL, error boundaries
- **Autenticación:** Supabase Auth con perfiles personalizados y verifySession
- **Real-time:** Suscripciones para progreso en tiempo real

## Mejoras Aplicadas desde MCP Context7

### Next.js - Autenticación
- Implementar `verifySession()` en Data Access Layer (DAL)
- Usar `cache()` para optimización de fetches autenticados
- Manejo de redirecciones con middleware para rutas protegidas
- Server Actions con verificación de sesión antes de operaciones sensibles

### Next.js - Manejo de Errores
- Error boundaries para componentes cliente
- Try/catch en Server Actions retornando objetos de error
- `unstable_rethrow` para errores internos de Next.js
- Manejo de errores en event handlers con useState

### Supabase - Row Level Security (RLS)
- Políticas con `auth.uid() IS NOT NULL AND auth.uid() = user_id`
- Views con `security_invoker = true`
- Políticas basadas en progreso de módulos para acceso secuencial
- Bypass RLS solo para roles administrativos

### Supabase - Real-time Subscriptions
- Canales para actualizaciones de progreso en tiempo real
- Filtros por eventos (INSERT, UPDATE, DELETE)
- Suscripciones a cambios en progreso de estudiante
- Broadcast para notificaciones de desbloqueo de módulos

## Esquema de Base de Datos Mejorado

### Tablas Principales (Mejoradas)

#### 1. public.modules (Mejorada)
- **id**: UUID (PK) - ID único del módulo
- **title**: TEXT - Título del módulo
- **description**: TEXT - Descripción del módulo
- **area_of_interest**: TEXT - Área especializada (Medicina, Ingeniería, etc.)
- **order_index**: INTEGER - Orden secuencial para bloqueo
- **is_active**: BOOLEAN - Estado del módulo
- **prerequisites**: JSONB - IDs de módulos requeridos (nuevo)
- **unlock_criteria**: JSONB - Criterios para desbloquear (nuevo)
- **created_at**: TIMESTAMP - Fecha de creación
- **updated_at**: TIMESTAMP - Fecha de actualización

#### 2. public.lessons (Sin cambios)
- **id**: UUID (PK) - ID único de la lección
- **module_id**: UUID (FK a modules.id) - Módulo padre
- **title**: TEXT - Título de la lección
- **content**: TEXT - Contenido de la lección
- **video_url**: TEXT - URL del video (opcional)
- **duration_minutes**: INTEGER - Duración estimada
- **order_index**: INTEGER - Orden dentro del módulo
- **is_active**: BOOLEAN - Estado de la lección
- **created_at**: TIMESTAMP - Fecha de creación
- **updated_at**: TIMESTAMP - Fecha de actualización

#### 3. public.student_progress (Mejorada)
- **id**: UUID (PK) - ID único del registro de progreso
- **student_id**: UUID (FK a auth.users.id) - ID del estudiante
- **lesson_id**: UUID (FK a lessons.id) - Lección completada
- **completed_at**: TIMESTAMP - Fecha de finalización
- **time_spent_minutes**: INTEGER - Tiempo dedicado
- **score**: INTEGER - Puntaje obtenido (0-100)
- **attempts**: INTEGER - Número de intentos (nuevo)
- **notes**: TEXT - Notas del estudiante

#### 4. public.student_modules (Mejorada)
- **id**: UUID (PK) - ID único
- **student_id**: UUID (FK a auth.users.id) - ID del estudiante
- **module_id**: UUID (FK a modules.id) - Módulo inscrito
- **enrolled_at**: TIMESTAMP - Fecha de inscripción
- **completion_percentage**: INTEGER - Porcentaje completado (0-100)
- **is_unlocked**: BOOLEAN - Estado de desbloqueo (nuevo)
- **unlocked_at**: TIMESTAMP - Fecha de desbloqueo (nuevo)
- **last_accessed_at**: TIMESTAMP - Último acceso

#### 5. public.module_unlock_events (Nueva)
- **id**: UUID (PK) - ID único del evento
- **student_id**: UUID (FK a auth.users.id) - Estudiante
- **module_id**: UUID (FK a modules.id) - Módulo desbloqueado
- **unlocked_by_completion**: BOOLEAN - Desbloqueado por completación
- **unlocked_at**: TIMESTAMP - Fecha de desbloqueo

### Diagrama de Relaciones Mejorado
```
auth.users (Supabase nativo)
    |
    | (1:1)
    v
public.profiles
    |
    | (1:many)
    v
public.student_modules
    |           |
    |           | (many:1)
    |           v
    |     public.modules
    |           |
    |           | (1:many)
    |           v
    |     public.lessons
    |           |
    |           | (many:many via student_progress)
    |           v
    |     public.student_progress
    |
    | (1:many)
    v
public.module_unlock_events
```

## Fases de Implementación Mejoradas

### Fase 1: Backend Mejorado - Esquema de Base de Datos y Migraciones

**Responsable:** Backend Developer

**Consulta Context7 aplicada:**
- Diseño de esquemas para sistemas de progreso secuencial
- Patrones de gamificación en plataformas educativas

**Pasos Mejorados:**
1. Agregar campos `prerequisites`, `unlock_criteria` a `modules`
2. Agregar campos `is_unlocked`, `unlocked_at` a `student_modules`
3. Crear tabla `module_unlock_events`
4. Crear índices para consultas de progreso y bloqueo
5. Crear vistas para módulos disponibles por estudiante
6. Implementar triggers para desbloqueo automático de módulos
7. Probar esquema con datos de ejemplo incluyendo secuencias de bloqueo

**Herramientas MCP mejoradas:**
- `apply_migration` para nuevas tablas y campos
- `list_tables` para verificar estructura
- `execute_sql` para testing con datos de bloqueo

### Fase 2: Backend Mejorado - Políticas RLS Avanzadas y Seguridad

**Responsable:** Backend Developer

**Consulta Context7 aplicada:**
- RLS para aplicaciones multi-tenant con lógica compleja
- Políticas de seguridad para datos de progreso educativo

**Pasos Mejorados:**
1. Habilitar RLS en todas las tablas nuevas
2. Crear políticas RLS para `modules` (lectura pública para estudiantes activos)
3. Crear políticas RLS para `lessons` (acceso solo si módulo desbloqueado)
4. Crear políticas RLS para `student_progress` (solo propietario)
5. Crear políticas RLS para `student_modules` (solo propietario)
6. Crear políticas RLS para `module_unlock_events` (solo propietario)
7. Implementar funciones de seguridad para validaciones de desbloqueo
8. Configurar políticas de retención de datos de progreso con encriptación

**Herramientas MCP mejoradas:**
- `apply_migration` para políticas RLS avanzadas
- `get_advisors` para verificar seguridad de bloqueo

### Fase 3: Backend Mejorado - Funciones Edge y Lógica de Negocio

**Responsable:** Backend Developer

**Consulta Context7 aplicada:**
- Edge Functions para cálculos de progreso
- Lógica de gamificación y recomendaciones

**Pasos Mejorados:**
1. Crear Edge Function para verificar y desbloquear módulos
2. Crear Edge Function para calcular progreso de carreras completas
3. Crear Edge Function para generar estadísticas de estudiante con métricas de carrera
4. Crear Edge Function para recomendaciones basadas en progreso bloqueado
5. Implementar lógica de gamificación (puntos, badges, posiciones en carrera)
6. Crear funciones para exportar datos de progreso con filtros de privacidad
7. Configurar webhooks para actualizaciones en tiempo real de desbloqueos
8. Implementar rate limiting avanzado para operaciones de progreso

**Herramientas MCP mejoradas:**
- `deploy_edge_function` para funciones de bloqueo
- `list_edge_functions` para verificar deployment

### Fase 4: UI Mejorada - Diseño de Componentes del Dashboard

**Responsable:** Frontend Developer

**Mejoras aplicadas:**
- Paleta de colores EPSeak integrada
- Componentes para mostrar estado de bloqueo
- Animaciones para desbloqueos

**Pasos Mejorados:**
1. Crear layout principal del dashboard con sidebar de navegación
2. Implementar componente de lista de módulos con indicadores de bloqueo/desbloqueo
3. Crear componente de detalle de módulo con validaciones de acceso
4. Implementar componente de reproductor de lecciones con progreso real-time
5. Crear componente de tracking de progreso con visualización de carrera
6. Implementar componente de perfil de estudiante con estadísticas de carrera
7. Diseñar componentes responsivos para móvil y desktop usando paleta EPSeak
8. Crear componente de notificaciones para desbloqueos de módulos

**Dependencias mejoradas:**
- Fases 1-3 del backend completadas con lógica de bloqueo
- Contexto de autenticación funcionando con verifySession

### Fase 5: UI Mejorada - Integración y Testing

**Responsable:** Frontend Developer

**Mejoras aplicadas:**
- Integración con real-time subscriptions
- Manejo de errores con error boundaries
- Optimizaciones de performance

**Pasos Mejorados:**
1. Integrar componentes con Supabase client usando mejores prácticas
2. Implementar manejo de estado para progreso en tiempo real con subscriptions
3. Crear páginas protegidas con middleware de autenticación mejorado
4. Implementar lazy loading para contenido de lecciones con error handling
5. Crear tests unitarios para componentes incluyendo estados de bloqueo
6. Implementar tests de integración para flujos completos de carrera
7. Optimizar performance y Core Web Vitals con caching
8. Implementar manejo de errores con boundaries y fallbacks

**Dependencias mejoradas:**
- Fase 4 completada
- Herramientas de testing configuradas con cobertura para lógica de bloqueo

### Fase 6: Testing, Seguridad y Optimización Final Mejorada

**Responsable:** Colaborativo

**Mejoras aplicadas:**
- Testing exhaustivo de lógica de bloqueo
- Auditoría de seguridad RLS
- Optimizaciones de performance para real-time

**Pasos Mejorados:**
1. Ejecutar tests end-to-end del flujo completo de carrera con módulos bloqueados
2. Revisar políticas de seguridad con Advisor incluyendo validaciones de desbloqueo
3. Optimizar consultas de base de datos con índices para progreso secuencial
4. Implementar caching avanzado para contenido estático y datos de progreso
5. Configurar monitoring y logging con métricas de carrera
6. Realizar pruebas de carga con escenarios de desbloqueo masivo
7. Documentar API y componentes con ejemplos de bloqueo
8. Implementar feature flags para activación gradual del sistema de carreras

## Consideraciones Generales Mejoradas

### Riesgos Globales Mejorados
- **Complejidad del bloqueo secuencial:** Diseño debe manejar dependencias circulares
- **Performance con real-time:** Optimización necesaria para actualizaciones frecuentes
- **Escalabilidad:** Arquitectura preparada para miles de estudiantes en carreras paralelas
- **Privacidad mejorada:** Cumplimiento GDPR con encriptación de datos de progreso

### Métricas de Éxito Actualizadas
- Tiempo de carga < 2 segundos para verificación de bloqueo
- Tasa de completación de módulos > 80% (mejorada)
- Tasa de deserción reducida < 15% por bloqueo motivacional
- Satisfacción del estudiante > 4.7/5 con sistema de carreras
- Zero vulnerabilidades críticas en lógica de bloqueo
- > 90% de estudiantes completan al menos una carrera completa

### Plan de Contingencia Mejorado
- Rollback a versiones anteriores con preservación de progreso
- Backup automático de datos de progreso con encriptación
- Contactos de soporte prioritarios para issues de bloqueo
- Sistema de recuperación manual de progreso perdido

## Mejores Prácticas Aplicadas

### Autenticación Next.js
- Uso de `verifySession()` en todas las operaciones DAL
- Middleware para protección de rutas con redirecciones
- Server Actions con verificación previa

### Manejo de Errores Next.js
- Error boundaries en componentes cliente
- Try/catch en Server Actions con retorno de errores
- Manejo de errores en event handlers con estado local

### Seguridad Supabase RLS
- Políticas con checks explícitos de `auth.uid()`
- Views con `security_invoker = true`
- Políticas complejas para acceso basado en progreso

### Real-time Supabase
- Subscriptions filtradas por eventos específicos
- Canales dedicados para progreso de estudiante
- Broadcast para notificaciones de desbloqueo

**Tiempo total estimado mejorado:** 25-35 horas laborables

**Costo estimado mejorado:** $0 (usando plan gratuito de Supabase inicialmente, con optimizaciones para evitar límites)

Para proceder, confirma autorización para iniciar la Fase 1 del backend mejorado.