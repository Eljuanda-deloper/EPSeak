# Lesson Modules with Multimedia Content

Complete implementation of an interactive lesson system with multimedia support for EPSEAK platform.

## Features

### 📚 Lesson Management
- Organized lessons within modules
- Lesson progress tracking
- Multiple content types per lesson
- Estimated duration display

### 🎓 Content Types
- **Text Content**: Markdown-formatted lessons with proper typography
- **Audio**: Interactive audio player with:
  - Play/pause controls
  - Progress bar with seek functionality
  - Volume control
  - Speed adjustment (0.75x, 1x, 1.25x, 1.5x)
- **Images**: Gallery with lightbox viewer
  - Click to expand
  - Navigation between images
  - Keyboard shortcuts (Esc to close, Arrow keys to navigate)
- **Videos**: Multiple video source support
  - YouTube embeds
  - Vimeo embeds
  - HTML5 video player with fullscreen support

### 📊 Progress Tracking
- Real-time completion marking
- Time spent tracking
- Progress persistence
- Module completion percentage

### 📱 Responsive Design
- Desktop: Sidebar navigation + main content
- Mobile: Hamburger menu with lesson drawer
- Touch-optimized controls
- Adaptive layouts

### ♿ Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Semantic HTML structure
- Color contrast compliance

## File Structure

```
app/
├── api/
│   └── careers/[careerSlug]/modules/
│       └── [moduleId]/
│           ├── route.ts                 # GET module with lessons
│           └── lessons/[lessonId]/
│               ├── route.ts             # GET lesson with assets
│               └── complete/route.ts    # POST mark as complete
├── components/careers/
│   ├── ModuleView.tsx                  # Main container component
│   ├── LessonContent.tsx               # Content renderer
│   ├── LessonNavigation.tsx            # Prev/Next buttons
│   ├── LessonSidebar.tsx               # Desktop navigation
│   ├── LessonDrawer.tsx                # Mobile navigation
│   ├── ProgressBar.tsx                 # Progress indicator
│   ├── CompleteButton.tsx              # Completion trigger
│   ├── TextContent.tsx                 # Text renderer
│   ├── AudioPlayer.tsx                 # Audio control
│   ├── ImageGallery.tsx                # Image viewer
│   └── VideoPlayer.tsx                 # Video player
├── hooks/
│   ├── useLessonProgress.ts            # Progress management
│   └── useToast.ts                     # Notifications
├── utils/
│   ├── multimedia.ts                   # Media utilities
│   └── markdown.ts                     # Markdown processor
│
supabase/
└── migrations/
    ├── 20251119_create_lesson_tables.sql      # Schema
    └── 20251119_rls_lesson_policies.sql       # Security
    
types/
└── modules.ts                          # TypeScript types

__tests__/
├── integration/
│   └── lessons.cy.ts                   # E2E tests
├── hooks/
│   └── useLessonProgress.test.ts       # Hook tests
└── components/
    └── careers.test.tsx                # Component tests
```

## Database Schema

### lessons
```sql
- id (UUID, PK)
- module_id (UUID, FK)
- title (TEXT)
- description (TEXT)
- order_position (INTEGER)
- content_text (TEXT) -- Markdown
- estimated_duration_minutes (INTEGER)
- is_published (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### lesson_assets
```sql
- id (UUID, PK)
- lesson_id (UUID, FK)
- type (TEXT) -- 'audio', 'image', 'video', 'document'
- file_url (TEXT)
- file_name (TEXT)
- file_size_bytes (INTEGER)
- duration_seconds (INTEGER)
- alt_text (TEXT)
- created_at, updated_at (TIMESTAMP)
```

### student_lesson_progress
```sql
- id (UUID, PK)
- student_id (UUID, FK)
- lesson_id (UUID, FK)
- completed_at (TIMESTAMP)
- time_spent_seconds (INTEGER)
- last_accessed_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
- UNIQUE(student_id, lesson_id)
```

## API Endpoints

### GET /api/careers/[careerSlug]/modules/[moduleId]
Fetch module with all lessons.

**Response:**
```json
{
  "module": {
    "id": "uuid",
    "title": "Module Title",
    "description": "...",
    "estimated_hours": 5
  },
  "lessons": [
    {
      "id": "uuid",
      "title": "Lesson 1",
      "order_position": 0,
      "estimated_duration_minutes": 10
    }
  ],
  "totalLessons": 5
}
```

### GET /api/careers/[careerSlug]/modules/[moduleId]/lessons/[lessonId]
Fetch lesson with all multimedia assets.

**Response:**
```json
{
  "lesson": {
    "id": "uuid",
    "title": "Lesson Title",
    "content_text": "# Markdown content...",
    "assets": [
      {
        "id": "uuid",
        "type": "audio",
        "file_url": "https://...",
        "file_name": "audio.mp3",
        "duration_seconds": 300
      }
    ]
  }
}
```

### POST /api/careers/[careerSlug]/modules/[moduleId]/lessons/[lessonId]/complete
Mark lesson as completed.

**Request:**
```json
{
  "time_spent_seconds": 600
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "uuid",
    "completed_at": "2025-11-19T10:30:00Z"
  }
}
```

## Component Usage

### ModuleView
Main component for displaying a lesson module.

```tsx
<ModuleView
  moduleName="Module 1"
  lessons={lessons}
  currentLesson={currentLesson}
  completedLessonIds={['id1', 'id2']}
  onNavigate={handleNavigate}
  onComplete={handleComplete}
  careerSlug="business"
  moduleId="module-1"
/>
```

### AudioPlayer
```tsx
<AudioPlayer
  src="https://example.com/audio.mp3"
  title="Lesson Audio"
/>
```

### ImageGallery
```tsx
<ImageGallery
  assets={imageAssets}
/>
```

### VideoPlayer
```tsx
<VideoPlayer
  src="https://example.com/video.mp4"
  type="html5"
  title="Lesson Video"
/>
```

### useLessonProgress Hook
```tsx
const { isCompleted, isLoading, markAsComplete } = useLessonProgress({
  lessonId: 'lesson-1',
  careerSlug: 'business',
  moduleId: 'module-1',
})

await markAsComplete()
```

## Testing

### Run Unit Tests
```bash
npm run test
```

### Run Integration Tests
```bash
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
```

## Accessibility Features

✅ WCAG 2.1 AA Compliant
- Keyboard navigation (arrow keys)
- Screen reader support
- Proper semantic HTML
- ARIA labels and roles
- Color contrast (4.5:1 ratio)
- Focus indicators
- Skip links (optional)

## Performance Optimization

- Image lazy loading with Next.js Image component
- Audio/video lazy loading with Intersection Observer
- Code splitting with dynamic imports
- Progress bar animations with Framer Motion
- Responsive images with srcset

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14.5+
- Chrome Android 90+

## Known Limitations

1. Video uploads limited to 500MB (configurable)
2. Audio uploads limited to 50MB (configurable)
3. Image uploads limited to 10MB (configurable)
4. Markdown syntax limited to basic formatting
5. Requires authentication for access

## Future Enhancements

- [ ] Quiz functionality after lessons
- [ ] Subtitle support for videos
- [ ] Download lesson materials
- [ ] Offline mode with service workers
- [ ] Advanced analytics dashboard
- [ ] Comment system for lessons
- [ ] Peer collaboration features
- [ ] Custom progress reports
- [ ] Certificate generation
- [ ] Content recommendations

## Support

For issues or questions:
- Email: support@epseak.com
- GitHub Issues: [link to repo]
- Documentation: [link to docs]
