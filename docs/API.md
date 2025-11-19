# 🔌 API Reference

## Overview

EPSEAK uses a RESTful API built with Next.js API routes and Supabase. All endpoints require authentication and implement Row Level Security (RLS) policies.

## Authentication

All API requests require a valid JWT token from Supabase Auth. Include the token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Modules

#### GET `/api/modules`
List all available modules for the authenticated user.

**Response:**
```json
{
  "modules": [
    {
      "id": "uuid",
      "title": "Business English Basics",
      "description": "Learn essential business vocabulary",
      "career_id": "uuid",
      "order_index": 1,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/api/modules/[id]`
Get detailed module information including lessons and assets.

**Parameters:**
- `id` (path): Module UUID

**Response:**
```json
{
  "module": {
    "id": "uuid",
    "title": "Business English Basics",
    "description": "Learn essential business vocabulary",
    "career_id": "uuid",
    "order_index": 1,
    "is_active": true,
    "lessons": [
      {
        "id": "uuid",
        "title": "Greetings",
        "content": "Lesson content...",
        "content_type": "text",
        "order_index": 1,
        "is_active": true,
        "assets": [
          {
            "id": "uuid",
            "lesson_id": "uuid",
            "asset_type": "image",
            "url": "https://...",
            "alt_text": "Business meeting",
            "order_index": 1
          }
        ]
      }
    ],
    "assessment": {
      "id": "uuid",
      "title": "Business English Assessment",
      "passing_score": 70,
      "time_limit_minutes": 30
    }
  }
}
```

#### GET `/api/modules/cached`
Optimized endpoint for module listing with caching.

**Response:** Same as `/api/modules` but with performance optimizations.

### Lessons

#### GET `/api/lessons/[id]`
Get lesson content and metadata.

**Parameters:**
- `id` (path): Lesson UUID

**Response:**
```json
{
  "lesson": {
    "id": "uuid",
    "module_id": "uuid",
    "title": "Business Meeting Vocabulary",
    "content": "In this lesson, we'll learn...",
    "content_type": "text",
    "order_index": 1,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "assets": [
      {
        "id": "uuid",
        "asset_type": "audio",
        "url": "https://...",
        "alt_text": "Pronunciation guide"
      }
    ]
  }
}
```

#### POST `/api/lessons/[id]/complete`
Mark a lesson as completed and track progress.

**Parameters:**
- `id` (path): Lesson UUID

**Request Body:**
```json
{
  "timeSpent": 300,
  "completedAt": "2025-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "lessonId": "uuid",
    "completedAt": "2025-01-01T12:00:00Z",
    "timeSpent": 300
  },
  "moduleProgress": {
    "completedLessons": 5,
    "totalLessons": 10,
    "percentage": 50
  }
}
```

### Assessments

#### GET `/api/assessments/[id]`
Get assessment details and questions.

**Parameters:**
- `id` (path): Assessment UUID

**Response:**
```json
{
  "assessment": {
    "id": "uuid",
    "module_id": "uuid",
    "title": "Business English Final Assessment",
    "description": "Test your knowledge",
    "passing_score": 70,
    "time_limit_minutes": 30,
    "is_active": true,
    "questions": [
      {
        "id": "uuid",
        "question_text": "What does 'ROI' stand for?",
        "question_type": "multiple_choice",
        "options": ["Return on Investment", "Return of Income", "Rate of Interest"],
        "correct_answer_index": 0,
        "explanation": "ROI stands for Return on Investment"
      }
    ]
  }
}
```

#### POST `/api/assessments/[id]/submit`
Submit assessment answers and get results.

**Parameters:**
- `id` (path): Assessment UUID

**Request Body:**
```json
{
  "answers": [0, 2, 1, 3],
  "timeSpent": 1800,
  "submittedAt": "2025-01-01T12:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "assessmentId": "uuid",
    "score": 85,
    "totalQuestions": 4,
    "correctAnswers": 3,
    "passed": true,
    "timeSpent": 1800,
    "submittedAt": "2025-01-01T12:30:00Z",
    "feedback": "Great job! You passed the assessment."
  }
}
```

### Progress

#### GET `/api/progress/[moduleId]`
Get user progress for a specific module.

**Parameters:**
- `moduleId` (path): Module UUID

**Response:**
```json
{
  "progress": {
    "moduleId": "uuid",
    "userId": "uuid",
    "completedLessons": ["lesson-1", "lesson-2"],
    "totalLessons": 10,
    "percentage": 20,
    "lastAccessed": "2025-01-01T12:00:00Z",
    "assessmentCompleted": false,
    "assessmentScore": null
  }
}
```

### Settings

#### GET `/api/settings/profile`
Get user profile settings.

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "theme": "light",
    "language": "en",
    "notifications": true
  }
}
```

#### PUT `/api/settings/profile`
Update user profile.

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "theme": "dark",
  "notifications": false
}
```

#### PUT `/api/settings/password`
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

#### POST `/api/settings/export-data`
Export user data (GDPR compliance).

**Response:**
```json
{
  "downloadUrl": "https://...",
  "expiresAt": "2025-01-02T00:00:00Z"
}
```

#### DELETE `/api/settings/delete-account`
Delete user account and all data.

**Response:**
```json
{
  "success": true,
  "message": "Account deletion initiated"
}
```

### Upload

#### POST `/api/upload/avatar`
Upload user avatar image.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: Image file (max 5MB, JPG/PNG/WebP)

**Response:**
```json
{
  "success": true,
  "avatarUrl": "https://supabase-storage-url/avatar.jpg"
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error information"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authenticated requests:** 1000/hour per user
- **File uploads:** 10/hour per user
- **Assessment submissions:** 5/hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Data Types

### Module
```typescript
interface Module {
  id: string
  title: string
  description: string
  career_id: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Lesson
```typescript
interface Lesson {
  id: string
  module_id: string
  title: string
  content: string
  content_type: 'text' | 'video' | 'audio' | 'mixed'
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Assessment
```typescript
interface Assessment {
  id: string
  module_id: string
  title: string
  description: string
  passing_score: number
  time_limit_minutes: number
  is_active: boolean
  questions: Question[]
}
```

### Question
```typescript
interface Question {
  id: string
  assessment_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  options: string[]
  correct_answer_index: number
  explanation: string
}
```

## Webhooks

EPSEAK supports webhooks for real-time updates (future implementation):

- `lesson.completed`
- `assessment.submitted`
- `user.registered`
- `module.unlocked`

## SDK

A JavaScript SDK is available for easier integration:

```javascript
import { EPSEAK } from '@epseak/sdk'

const client = new EPSEAK({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.epseak.com'
})

// Get modules
const modules = await client.modules.list()

// Complete lesson
await client.lessons.complete('lesson-id', {
  timeSpent: 300
})
```

---

**Version:** 1.0.0
**Last Updated:** November 2025