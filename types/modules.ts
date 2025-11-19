/**
 * Types for lesson modules and multimedia content
 */

export interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  order_position: number
  content_text?: string
  estimated_duration_minutes: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface LessonAsset {
  id: string
  lesson_id: string
  type: 'audio' | 'image' | 'video' | 'document'
  file_url: string
  file_name: string
  file_size_bytes?: number
  duration_seconds?: number
  alt_text?: string
  created_at: string
  updated_at: string
}

export interface StudentLessonProgress {
  id: string
  student_id: string
  lesson_id: string
  completed_at?: string
  time_spent_seconds: number
  last_accessed_at: string
  created_at: string
  updated_at: string
}

export interface ModuleWithLessons {
  id: string
  title: string
  description?: string
  career_id: string
  lessons: Lesson[]
  total_lessons: number
  estimated_hours: number
}

export interface LessonWithAssets extends Lesson {
  assets: LessonAsset[]
}

export interface LessonProgress {
  lesson_id: string
  completed: boolean
  time_spent_seconds: number
  completed_at?: string
  progress_percentage: number
}

export interface ModuleProgress {
  module_id: string
  total_lessons: number
  completed_lessons: number
  completion_percentage: number
  estimated_hours_remaining: number
}

export type MediaType = 'audio' | 'image' | 'video' | 'document'

export interface MediaMetadata {
  type: MediaType
  duration?: number
  size?: number
  width?: number
  height?: number
}
