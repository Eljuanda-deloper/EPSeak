// Tipos custom para lecciones y assets multimedia

export type AssetType = 'audio' | 'image' | 'video' | 'text'

export interface LessonAsset {
  id: string
  lesson_id: string
  asset_type: AssetType
  file_url: string
  file_name: string
  file_size_bytes?: number
  duration_seconds?: number // for audio/video
  mime_type?: string
  alt_text?: string // for images
  caption_text?: string // for videos
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content?: string // markdown text content
  video_url?: string // legacy video URL
  duration_minutes?: number
  order_index: number
  is_active: boolean
  assets?: LessonAsset[] // multimedia assets
  created_at: string
  updated_at: string
}

export interface StudentProgress {
  id: string
  student_id: string
  lesson_id: string
  completed_at: string
  time_spent_minutes?: number
  score?: number
  notes?: string
}

export interface Module {
  id: string
  title: string
  description?: string
  area_of_interest: string
  order_index: number
  is_active: boolean
  lessons?: Lesson[]
  created_at: string
  updated_at: string
}

export interface ModuleWithProgress {
  module: Module
  progress: {
    total_lessons: number
    completed_lessons: number
    completion_percentage: number
  }
}

export interface LessonWithProgress {
  lesson: Lesson
  progress?: StudentProgress
  is_completed: boolean
}
