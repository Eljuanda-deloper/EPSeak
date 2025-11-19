// Tipos de base de datos Supabase
// Generados automáticamente con: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      lesson_assets: {
        Row: {
          id: string
          lesson_id: string
          asset_type: string // audio, image, video
          file_url: string
          file_name: string
          file_size_bytes: number | null
          duration_seconds: number | null
          mime_type: string | null
          alt_text: string | null // for images
          caption_text: string | null // for videos
          order_index: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['lesson_assets']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['lesson_assets']['Row']>
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          completed_at: string
          time_spent_minutes: number | null
          score: number | null
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['student_progress']['Row'], 'id' | 'completed_at'> & {
          id?: string
          completed_at?: string
        }
        Update: Partial<Database['public']['Tables']['student_progress']['Row']>
      }
      module_assessments: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          assessment_type: string // quiz, exam, project
          total_questions: number | null
          passing_score: number | null
          duration_minutes: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['module_assessments']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['module_assessments']['Row']>
      }
      assessment_questions: {
        Row: {
          id: string
          assessment_id: string
          question_text: string
          question_type: string // multiple_choice, true_false, short_answer
          options: Json | null // For multiple choice: [{text: "", correct: bool}]
          correct_answer: string | null
          order_index: number | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['assessment_questions']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['assessment_questions']['Row']>
      }
      student_assessments: {
        Row: {
          id: string
          student_id: string
          assessment_id: string
          score: number | null
          passed: boolean | null
          attempted_at: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['student_assessments']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['student_assessments']['Row']>
      }
    }
  }
}
