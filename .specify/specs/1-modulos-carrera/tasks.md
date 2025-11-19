---
description: "Task list for Módulos de Carrera con Contenido Multimedia feature implementation"
---

# Tasks: Módulos de Carrera con Contenido Multimedia

**Input**: Design documents from `/specs/1-modulos-carrera/`
**Prerequisites**: spec.md (✅ complete), QUICKSTART.md, README.md
**Branch**: `1-modulos-carrera`
**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US8)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Infrastructure (Shared)

**Purpose**: Database, Storage, and API foundation for ALL user stories

### Database & Migrations

- [ ] T001 Create `lessons` table with fields: id, module_id, title, description, order, content_text, created_at, updated_at in `supabase/migrations/20251119_create_lessons.sql`
- [ ] T002 Create `lesson_assets` table with: id, lesson_id, type (audio/image/video), file_url, file_name, duration, created_at in same migration
- [ ] T003 Create `student_lesson_progress` table with: id, student_id, lesson_id, completed_at, time_spent_seconds, last_accessed_at, created_at in same migration
- [ ] T004 [P] Add RLS policy for `lessons` - students see lessons of enrolled careers in `supabase/migrations/20251119_rls_lessons.sql`
- [ ] T005 [P] Add RLS policy for `lesson_assets` - restrict access to enrolled students
- [ ] T006 [P] Add RLS policy for `student_lesson_progress` - students only see own progress
- [ ] T007 Create indices on `lessons(module_id)`, `lesson_assets(lesson_id)`, `student_lesson_progress(student_id, lesson_id)` in `supabase/migrations/20251119_indices.sql`

### Storage Configuration

- [ ] T008 Create `lesson_assets` bucket in Supabase Storage with public read, authenticated write
- [ ] T009 Configure CORS for Storage bucket to allow downloads from localhost:3000 and production domains

### Type Definitions

- [ ] T010 [P] Create TypeScript interfaces in `types/modules.ts`: Lesson, LessonAsset, StudentProgress, ModuleContent
- [ ] T011 [P] Export types from `types/index.ts`

### Base Utilities

- [ ] T012 [P] Create `app/utils/multimedia.ts` - utility functions for media processing (formatDuration, validateFileType, getMediaIcon)
- [ ] T013 [P] Create `app/utils/markdown.ts` - markdown to HTML converter using `remark` package

**Checkpoint**: Database schema complete, RLS policies active, types defined

---

## Phase 2: API Endpoints (Blocking Prerequisites)

**Purpose**: Core API layer required by ALL user stories

### Module & Lesson Retrieval

- [ ] T014 Create `app/api/careers/[careerSlug]/modules/[moduleId]/route.ts` - GET returns module with lessons list, title, description, estimated time
- [ ] T015 Create `app/api/careers/[careerSlug]/modules/[moduleId]/lessons/[lessonId]/route.ts` - GET returns full lesson content with all assets
- [ ] T016 [P] Add authentication check to both endpoints (verify user enrolled in career)
- [ ] T017 [P] Add error handling (404 if module/lesson not found, 403 if not enrolled)

### Progress Tracking

- [ ] T018 Create `app/api/careers/[careerSlug]/modules/[moduleId]/lessons/[lessonId]/complete` (POST) - marks lesson complete, returns updated progress
- [ ] T019 [P] Validate authentication and enrollment before marking complete
- [ ] T020 [P] Return updated student_lesson_progress with timestamp

### Asset Upload

- [ ] T021 Create `app/api/upload/lesson-asset` (POST) - multipart form handler, validates file type/size, uploads to Storage
- [ ] T022 [P] Validate: image max 10MB, audio max 50MB, video max 500MB
- [ ] T023 [P] Return file_url, file_name, type for client storage

### Progress Reporting

- [ ] T024 Create `app/api/careers/[careerSlug]/progress` (GET) - returns career progress: modules, lessons completed, overall percentage
- [ ] T025 [P] Include per-module stats and estimated time remaining

**Checkpoint**: All 5 API endpoints functional, tested with Postman

---

## Phase 3: UI Components - Desktop Layout (P1)

**Purpose**: Build reusable components for student interface

### Main Container & Layout

- [ ] T026 [US1] Create `app/components/careers/ModuleView.tsx` - container component with sidebar + main content layout (Tailwind grid)
- [ ] T027 [US1] [P] Add Framer Motion animations for page entry/transitions
- [ ] T028 [US1] [P] Add breadcrumb navigation: Dashboard > Carrera > Módulo > Lección in `ModuleView.tsx`

### Sidebar Component

- [ ] T029 [US7] Create `app/components/careers/LessonSidebar.tsx` - vertical list of lessons with progress indicators
- [ ] T030 [US7] [P] Show lesson title, duration, completed status (checkmark), current lesson highlighted
- [ ] T031 [US7] [P] Add click handlers to navigate between lessons without reload
- [ ] T032 [US7] [P] Add smooth scroll to active lesson

### Main Content Area

- [ ] T033 [US1] Create `app/components/careers/LessonContent.tsx` - flex container for text + media, responsive layout
- [ ] T034 [US1] [P] Render lesson title (h1), description, duration estimate
- [ ] T035 [US1] [P] Include navigation buttons (Previous/Next) with disabled states

### Progress Indicator

- [ ] T036 [US6] Create `app/components/careers/ProgressBar.tsx` - visual progress (X of Y completed), percentage text
- [ ] T037 [US6] [P] Update in real-time when lesson marked complete
- [ ] T038 [US6] [P] Show time estimate and time remaining

### Navigation Controls

- [ ] T039 [US7] Create `app/components/careers/LessonNavigation.tsx` - Previous/Next buttons with keyboard shortcuts (arrow keys)
- [ ] T040 [US7] [P] Disable Previous on first lesson, disable/change Next on last lesson to "Complete Module"

**Checkpoint**: Desktop layout complete and responsive

---

## Phase 4: Content Renderers (P1)

**Purpose**: Display different multimedia types

### Text Content (Markdown)

- [ ] T041 [US2] Create `app/components/careers/TextContent.tsx` - renders lesson.content_text as formatted HTML
- [ ] T042 [US2] [P] Use `remark` + `remark-html` to convert markdown to safe HTML
- [ ] T043 [US2] [P] Apply Tailwind styles: h2/h3/h4 headers, ul/ol lists, code blocks with syntax highlight
- [ ] T044 [US2] [P] Ensure typography responsive: 16px mobile, 18px desktop minimum
- [ ] T045 [US2] [P] Make external links open in new tab (target="_blank" with rel="noopener noreferrer")

### Audio Player

- [ ] T046 [US3] Create `app/components/careers/AudioPlayer.tsx` - HTML5 audio with custom controls
- [ ] T047 [US3] [P] Display: play/pause button, progress bar, volume control, duration (MM:SS)
- [ ] T048 [US3] [P] Add speed controls: 0.75x, 1x (default), 1.25x, 1.5x
- [ ] T049 [US3] [P] Show current time / total duration
- [ ] T050 [US3] [P] Handle mobile: ensure controls don't break layout, use larger touch targets (44px+)

### Image Gallery & Lightbox

- [ ] T051 [US4] Create `app/components/careers/ImageGallery.tsx` - renders lesson_assets of type 'image'
- [ ] T052 [US4] [P] Use `next/image` for optimization, responsive sizing, lazy loading
- [ ] T053 [US4] [P] Include alt text from asset metadata
- [ ] T054 [US4] Create `app/components/careers/ImageLightbox.tsx` - modal for expanded view with close button
- [ ] T055 [US4] [P] Add keyboard support: Esc to close, arrow keys to prev/next image
- [ ] T056 [US4] [P] Preserve scroll position when opening/closing lightbox

### Video Player

- [ ] T057 [US5] Create `app/components/careers/VideoPlayer.tsx` - embed YouTube/Vimeo and HTML5 video
- [ ] T058 [US5] [P] For YouTube: use IFrame embed with responsive wrapper
- [ ] T059 [US5] [P] For Vimeo: use IFrame embed with responsive wrapper
- [ ] T060 [US5] [P] For HTML5: use native `<video>` tag with custom controls
- [ ] T061 [US5] [P] Add speed control: 0.75x, 1x, 1.25x, 1.5x (for HTML5 videos)
- [ ] T062 [US5] [P] Support subtitles: accept WebVTT file URL in lesson_assets
- [ ] T063 [US5] [P] Make fullscreen button prominent
- [ ] T064 [US5] [P] Show loading state while buffering

**Checkpoint**: All content types render correctly

---

## Phase 5: Mobile Layout & Responsiveness (P1)

**Purpose**: Ensure mobile-first design per Constitution

### Mobile Sidebar (Drawer/Collapsible)

- [ ] T065 [US7] Create `app/components/careers/LessonDrawer.tsx` - collapsible drawer with lessons list on mobile
- [ ] T066 [US7] [P] Show hamburger icon on screens < lg (Tailwind breakpoint)
- [ ] T067 [US7] [P] Slide drawer from left, semi-transparent backdrop, close on selection
- [ ] T068 [US7] [P] Use Framer Motion for smooth animation

### Responsive Component Updates

- [ ] T069 [US1] [P] Update `ModuleView.tsx` - grid changes: desktop 2-col (sidebar + content), mobile 1-col stacked
- [ ] T070 [US1] [P] Update `LessonNavigation.tsx` - full-width buttons on mobile, side-by-side on desktop
- [ ] T071 [US1] [P] Update `ProgressBar.tsx` - horizontal on mobile, larger text
- [ ] T072 [US2] [P] Update `TextContent.tsx` - adjust padding/margins for mobile (px-4 md:px-6)

### Media Queries Testing

- [ ] T073 Test all components on 6 device breakpoints: iPhone SE (375px), iPhone 12 (390px), iPhone 15 (393px), iPad (768px), Desktop 1366px, Desktop 1920px
- [ ] T074 [P] Fix any layout issues, ensure touch targets >= 44px on mobile
- [ ] T075 [P] Verify video players responsive on all sizes
- [ ] T076 [P] Verify images scale properly on all sizes

**Checkpoint**: Mobile design fully functional

---

## Phase 6: Progress Tracking & State Management (P1)

**Purpose**: Track student completion and persist state

### Progress Update Handler

- [ ] T077 [US6] Create `app/hooks/useLessonProgress.ts` - custom hook for marking complete, calling API, updating local state
- [ ] T078 [US6] [P] Show loading state while API call in progress
- [ ] T079 [US6] [P] Handle errors: show toast/notification if API fails
- [ ] T080 [US6] [P] Update UI immediately (optimistic update) before API confirms

### Complete Button Integration

- [ ] T081 [US6] Create `app/components/careers/CompleteButton.tsx` - button that calls useLessonProgress hook
- [ ] T082 [US6] [P] Show "✓ Completed" state after completion
- [ ] T083 [US6] [P] Disable button if already completed
- [ ] T084 [US6] [P] Update parent ProgressBar when lesson completed

### Progress Persistence

- [ ] T085 [US6] Add localStorage cache of student progress for offline reference (optional)
- [ ] T086 [US6] [P] Validate cache against API on page load to prevent stale data

**Checkpoint**: Completion tracking fully functional with persistence

---

## Phase 7: Data Integration & Testing (P1)

**Purpose**: Fetch and display actual data from APIs

### Fetch Module Content

- [ ] T087 [US1] Create `app/careers/[careerSlug]/modules/[moduleId]/page.tsx` - server component that fetches module via API
- [ ] T088 [US1] [P] Display loading state while fetching
- [ ] T089 [US1] [P] Handle 404 if module doesn't exist
- [ ] T090 [US1] [P] Handle 403 if student not enrolled

### Fetch Lesson Content

- [ ] T091 [US2] [US3] [US4] [US5] Create page route: `app/careers/[careerSlug]/modules/[moduleId]/lessons/[lessonId]/page.tsx`
- [ ] T092 [US2] [US3] [US4] [US5] [P] Fetch lesson from API and pass to components
- [ ] T093 [US2] [US3] [US4] [US5] [P] Handle loading, error states

### Integration Testing

- [ ] T094 Write integration test: student can navigate module → lesson → see text content (in `__tests__/integration/`)
- [ ] T095 [P] Write integration test: student can mark lesson complete → progress updates
- [ ] T096 [P] Write integration test: student can play audio without errors
- [ ] T097 [P] Write integration test: student can view/expand images
- [ ] T098 [P] Write integration test: student can play video
- [ ] T099 [P] Write integration test: student can navigate between lessons

**Checkpoint**: All content retrieval and display working

---

## Phase 8: Performance Optimization (P1)

**Purpose**: Achieve Lighthouse ≥90 target

### Image Optimization

- [ ] T100 [US4] [P] Verify all images use `next/image` with proper widths/heights
- [ ] T101 [P] Ensure WebP format with JPG fallback
- [ ] T102 [P] Enable blurred placeholder for images
- [ ] T103 [P] Implement lazy loading for below-fold images

### Media Lazy Loading

- [ ] T104 [US3] [US5] Implement lazy loading for audio/video players (don't load until component visible)
- [ ] T105 [P] Use Intersection Observer API or `react-intersection-observer` library
- [ ] T106 [P] Show placeholder before media loads

### Code Splitting

- [ ] T107 Create separate chunks for heavy components (AudioPlayer, VideoPlayer, ImageLightbox)
- [ ] T108 [P] Use dynamic imports: `const VideoPlayer = dynamic(() => import('...'), { loading: () => <Skeleton /> })`

### Caching Strategy

- [ ] T109 Implement HTTP caching headers for API endpoints (Cache-Control for lesson content)
- [ ] T110 [P] Set-Cookie for progress tracking (optional, if using sessions)

### Performance Testing

- [ ] T111 Run Lighthouse audit on module page
- [ ] T112 [P] Run Lighthouse audit on lesson page
- [ ] T113 [P] Target: Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90
- [ ] T114 [P] Measure Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Checkpoint**: Lighthouse score ≥90 achieved

---

## Phase 9: Accessibility & WCAG Compliance (P1)

**Purpose**: Meet WCAG 2.1 AA standards per Constitution

### Semantic HTML

- [ ] T115 Review all components for semantic HTML: use `<button>`, `<nav>`, `<main>`, `<article>`, etc.
- [ ] T116 [P] Verify heading hierarchy (h1 > h2 > h3, no skips)

### ARIA Labels & Roles

- [ ] T117 [P] Add aria-label to icon buttons (play, pause, fullscreen, etc.)
- [ ] T118 [P] Add aria-live regions for dynamic content updates (progress bar, completion status)
- [ ] T119 [P] Add role="region" for audio/video players
- [ ] T120 [P] Add aria-current="page" to active lesson in sidebar

### Keyboard Navigation

- [ ] T121 [US3] [US5] Verify audio/video controls fully keyboard accessible (Tab through controls, Enter to activate)
- [ ] T122 [US4] [P] Verify lightbox closable with Esc key
- [ ] T123 [P] Verify all interactive elements have visible focus indicator (not ::focus { outline: none })
- [ ] T124 [P] Verify Skip to Content link (optional but recommended)

### Color Contrast

- [ ] T125 Audit all text colors for 4.5:1 contrast ratio (WCAG AA)
- [ ] T126 [P] Fix any failing contrast in buttons, headings, body text
- [ ] T127 [P] Test with accessibility checker (axe DevTools, Lighthouse Accessibility)

### Alt Text & Labels

- [ ] T128 [US4] Ensure ALL images have descriptive alt text (lesson_assets stores alt_text field)
- [ ] T129 [P] Add alt text for lesson asset images
- [ ] T130 [P] Verify form labels associated with inputs (if any)

**Checkpoint**: WCAG 2.1 AA compliance verified

---

## Phase 10: Admin/Professor Content Management (P2)

**Purpose**: Allow non-developers to create module content

### Admin Dashboard Pages

- [ ] T131 [US8] Create `app/dashboard/admin/modules/page.tsx` - list of all modules with edit links
- [ ] T132 [US8] [P] Create `app/dashboard/admin/modules/[moduleId]/page.tsx` - edit module form

### Lesson Management

- [ ] T133 [US8] Create `app/dashboard/admin/modules/[moduleId]/lessons/page.tsx` - list lessons with add/edit/delete buttons
- [ ] T134 [US8] [P] Create `app/dashboard/admin/modules/[moduleId]/lessons/[lessonId]/page.tsx` - edit lesson form

### Lesson Form Component

- [ ] T135 [US8] Create `app/components/admin/LessonForm.tsx` - form with:
       - title input
       - description textarea
       - content_text textarea (markdown editor with preview)
       - order number input
- [ ] T136 [US8] [P] Add markdown preview sidebar
- [ ] T137 [US8] [P] Save changes to API endpoint `PUT /api/admin/modules/[moduleId]/lessons/[lessonId]`

### Asset Management

- [ ] T138 [US8] Create `app/components/admin/AssetUploadForm.tsx` - multi-file upload
- [ ] T139 [US8] [P] Support drag & drop
- [ ] T140 [US8] [P] Show progress during upload
- [ ] T141 [US8] [P] List uploaded assets with delete buttons
- [ ] T142 [US8] [P] Call API endpoint `POST /api/upload/lesson-asset`

### API Endpoints for Admin

- [ ] T143 [US8] Create `app/api/admin/modules/[moduleId]/lessons` (GET, POST)
- [ ] T144 [US8] [P] Create `app/api/admin/modules/[moduleId]/lessons/[lessonId]` (GET, PUT, DELETE)
- [ ] T145 [US8] [P] Add role-based access control (only admin can modify)
- [ ] T146 [US8] [P] Add validation (required fields, file size limits)

**Checkpoint**: Admin can create/edit modules and lessons

---

## Phase 11: End-to-End Testing & QA (P2)

**Purpose**: Comprehensive testing before launch

### Manual QA Checklist

- [ ] T147 Test student flow: login → dashboard → select career → open module → read lesson → mark complete
- [ ] T148 [P] Test audio: play, pause, seek, volume, speed controls, on mobile
- [ ] T149 [P] Test images: load, click to expand, zoom on mobile, close lightbox
- [ ] T150 [P] Test videos: YouTube/Vimeo load, play, fullscreen, speed (if HTML5), subtitles
- [ ] T151 [P] Test navigation: previous/next buttons, sidebar clicks, keyboard shortcuts
- [ ] T152 [P] Test progress: mark complete, see progress bar update, refresh page and verify persistence
- [ ] T153 [P] Test responsivité: all features on iPhone SE, iPhone 15, iPad, Desktop

### Mobile Specific Testing

- [ ] T154 Test on actual devices (not just browser DevTools)
- [ ] T155 [P] Test audio playback with network restrictions (throttle to 3G)
- [ ] T156 [P] Test video playback with network restrictions
- [ ] T157 [P] Test touch interactions: buttons, swipes, pinch zoom on images

### Browser Compatibility

- [ ] T158 Test on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- [ ] T159 [P] Test on mobile browsers: Safari iOS, Chrome Android

### Error Scenarios

- [ ] T160 Test behavior when API returns 404 (lesson not found)
- [ ] T161 [P] Test behavior when student not enrolled in career (403)
- [ ] T162 [P] Test behavior when media file fails to load (timeout, 404)
- [ ] T163 [P] Test behavior with slow network (show loading states properly)
- [ ] T164 [P] Test behavior with offline (graceful degradation)

**Checkpoint**: All QA passed, ready for production

---

## Phase 12: Documentation & Deployment (P2)

**Purpose**: Document features and prepare for release

### Developer Documentation

- [ ] T165 Document component API in JSDoc comments
- [ ] T166 [P] Document API endpoints in comments (request/response format)
- [ ] T167 [P] Add README in `app/components/careers/` explaining usage
- [ ] T168 [P] Add troubleshooting guide for common issues

### Student Documentation

- [ ] T169 Create user guide for students: "How to use the learning modules" (markdown or video)
- [ ] T170 [P] Create quick start video showing navigation

### Release Notes

- [ ] T171 Write release notes documenting new features
- [ ] T172 [P] List known limitations and future improvements

### Production Deployment

- [ ] T173 Create production build: `npm run build` (must succeed)
- [ ] T174 [P] Run final Lighthouse audit (must be ≥90)
- [ ] T175 [P] Create database migrations backup
- [ ] T176 [P] Deploy to Vercel/production environment
- [ ] T177 [P] Test on production with real data

**Checkpoint**: Feature deployed to production

---

## Dependencies & Execution Order

### Critical Path (Must Complete First)
1. **Phase 1**: Setup (Database, Storage) - blocks ALL other phases
2. **Phase 2**: API Endpoints - blocks data integration

### Parallelizable (Can run simultaneously)
- **Phase 3-4**: Components and Content Renderers (independent)
- **Phase 6-7**: Progress Tracking and Integration (dependent on Phase 2 API)
- **Phase 8-9**: Performance and Accessibility (can start after Phase 4)
- **Phase 10**: Admin features (independent, lower priority)

### Recommended Execution Strategy
```
Phase 1 (Setup) → Phase 2 (API)
  ↓
  ├─→ Phase 3 (Components)
  ├─→ Phase 4 (Renderers)
  ├─→ Phase 5 (Mobile)
  └─→ Phase 6-7 (Progress/Integration)
      ↓
      ├─→ Phase 8 (Performance)
      ├─→ Phase 9 (Accessibility)
      └─→ Phase 10 (Admin)
         ↓
         Phase 11 (QA)
         ↓
         Phase 12 (Deployment)
```

**Total Estimated Tasks**: 177 tasks across 12 phases
**Estimated Duration**: ~21.5 hours (matching Phase breakdown from specification)

---

## Success Metrics

✅ All 177 tasks completed
✅ Lighthouse score ≥ 90
✅ WCAG 2.1 AA compliance verified
✅ Mobile testing on 6+ devices passed
✅ All integration tests passing (≥80% code coverage)
✅ Zero critical bugs in production

---

**Status**: Ready for implementation  
**Date Created**: 2025-11-19  
**Branch**: `1-modulos-carrera`

