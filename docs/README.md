# 📚 EPSEAK Technical Documentation

## 🚀 Overview

EPSEAK is a comprehensive learning platform built with Next.js 14, TypeScript, and Supabase, designed for career-focused English language education. The platform features modular courses, multimedia content, progress tracking, and automated assessments.

## 🏗️ Architecture

### Frontend Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.9+
- **Styling:** Tailwind CSS 4+
- **Animations:** Framer Motion 10+
- **Icons:** Lucide React
- **UI Components:** shadcn/ui

### Backend Stack
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **API:** PostgREST (auto-generated)
- **Security:** Row Level Security (RLS)

### Key Features
- ✅ Modular learning curriculum
- ✅ Multimedia content rendering (text, audio, image, video)
- ✅ Progress tracking with visual indicators
- ✅ Automated assessments with scoring
- ✅ Mobile-first responsive design
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Performance optimized (Lighthouse 90+)
- ✅ Comprehensive testing suite

## 📁 Project Structure

```
epseak/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   ├── components/               # Reusable components
│   │   ├── accessible/          # WCAG compliant components
│   │   ├── assessments/         # Quiz components
│   │   ├── careers/             # Career landing pages
│   │   ├── dashboard/           # Dashboard views
│   │   ├── layout/              # Layout components
│   │   ├── modules/             # Module components
│   │   └── renderers/           # Content renderers
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Utility functions
│   └── [dynamic]/               # Dynamic routes
├── docs/                        # Documentation
├── public/                      # Static assets
├── supabase/                    # Database migrations
├── types/                       # TypeScript types
└── __tests__/                   # Test suite
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eljuanda-deloper/EPSeak.git
   cd epseak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.local.example .env.local
   ```

   Configure the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. **Database setup**
   ```bash
   # Run migrations
   ./run-migration.sh

   # Seed database (if available)
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run analyze` | Bundle analyzer |
| `npm run type-check` | TypeScript type checking |

## 📊 Database Schema

### Core Tables

#### `modules`
Learning modules with metadata and content structure.

#### `lessons`
Individual lessons within modules, containing multimedia content.

#### `lesson_assets`
Multimedia files (images, audio, video) associated with lessons.

#### `assessments`
Quiz definitions with passing criteria.

#### `assessment_questions`
Individual questions with multiple choice answers.

#### `student_progress`
Tracks lesson completion and time spent.

#### `student_assessments`
Stores assessment results and scores.

#### `career_paths`
Available career tracks (Business, Medical, Legal, Tech English).

#### `student_careers`
User career selections and progress.

## 🔐 Authentication

EPSEAK uses Supabase Auth with the following features:
- Email/password authentication
- Password reset functionality
- Session management
- Row Level Security (RLS) policies

## 🎯 API Reference

### REST Endpoints

#### Modules
- `GET /api/modules` - List all modules
- `GET /api/modules/[id]` - Get module details
- `GET /api/modules/cached` - Cached modules with performance optimization

#### Lessons
- `GET /api/lessons/[id]` - Get lesson content
- `POST /api/lessons/[id]/complete` - Mark lesson as completed

#### Assessments
- `GET /api/assessments/[id]` - Get assessment details
- `POST /api/assessments/[id]/submit` - Submit assessment answers

#### Progress
- `GET /api/progress/[moduleId]` - Get user progress for module

### Authentication Required
All API endpoints require authenticated users and implement RLS policies.

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
├── utils/              # Utility tests
├── integration/        # Integration tests
└── setup.ts            # Test configuration
```

### Coverage Goals
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 85%
- **Lines:** 80%

### Running Tests
```bash
# All tests
npm run test

# With coverage
npm run test -- --coverage

# Watch mode
npm run test:watch
```

## ♿ Accessibility

EPSEAK is fully compliant with WCAG 2.1 Level AA standards:

### Features
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management
- Color contrast validation

### Testing
- Automated accessibility tests
- Manual screen reader testing
- Keyboard-only navigation verification

## 🚀 Deployment

### Production Requirements
- Vercel account (recommended)
- Supabase project
- Custom domain (optional)

### Deployment Steps

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure environment variables**
   Set production environment variables in Vercel dashboard.

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Performance Optimization
- Automatic code splitting
- Image optimization
- CDN caching
- Bundle analysis tools included

## 📈 Monitoring

### Built-in Monitoring
- Vercel Analytics
- Error tracking (Sentry integration ready)
- Performance metrics
- Lighthouse CI

### Database Monitoring
- Supabase dashboard
- Query performance
- RLS policy validation

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure accessibility compliance
4. Run full test suite
5. Create pull request

### Code Standards
- ESLint + Prettier configuration
- TypeScript strict mode
- Component documentation
- Test coverage requirements

## 📞 Support

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Issue Tracking
- GitHub Issues: [Report bugs](https://github.com/Eljuanda-deloper/EPSeak/issues)
- Feature requests welcome

## 📄 License

This project is proprietary software. All rights reserved.

---

**Version:** 1.0.0
**Last Updated:** November 2025
**Maintainer:** AI Assistant