import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      modules: {
        Row: {
          id: string
          title: string
          description: string | null
          area: string
          level: string
          duration_hours: number
          total_lessons: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          area: string
          level: string
          duration_hours: number
          total_lessons?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          area?: string
          level?: string
          duration_hours?: number
          total_lessons?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          content_type: string
          content_url: string | null
          content_text: string | null
          duration_minutes: number | null
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          content_type: string
          content_url?: string | null
          content_text?: string | null
          duration_minutes?: number | null
          order_index: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          content_type?: string
          content_url?: string | null
          content_text?: string | null
          duration_minutes?: number | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_modules: {
        Row: {
          id: string
          student_id: string
          module_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
          current_lesson_id: string | null
          is_active: boolean
          last_accessed_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          module_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          current_lesson_id?: string | null
          is_active?: boolean
          last_accessed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          module_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          current_lesson_id?: string | null
          is_active?: boolean
          last_accessed_at?: string | null
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          module_id: string
          status: string
          progress_percentage: number
          time_spent_minutes: number
          started_at: string | null
          completed_at: string | null
          last_accessed_at: string
          score: number | null
        }
        Insert: {
          id?: string
          student_id: string
          lesson_id: string
          module_id: string
          status?: string
          progress_percentage?: number
          time_spent_minutes?: number
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
          score?: number | null
        }
        Update: {
          id?: string
          student_id?: string
          lesson_id?: string
          module_id?: string
          status?: string
          progress_percentage?: number
          time_spent_minutes?: number
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
          score?: number | null
        }
      }
    }
    Views: {
      module_stats: {
        Row: {
          id: string
          title: string
          area: string
          level: string
          total_lessons: number
          enrolled_students: number | null
          avg_progress: number | null
          completed_students: number | null
        }
      }
      student_dashboard_stats: {
        Row: {
          student_id: string
          enrolled_modules: number | null
          completed_modules: number | null
          overall_progress: number | null
          total_study_hours: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}