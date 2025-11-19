// Tipos custom para evaluaciones (assessments)

export type AssessmentType = 'quiz' | 'exam' | 'project'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer'

export interface AssessmentQuestion {
  id: string
  assessment_id: string
  question_text: string
  question_type: QuestionType
  options?: QuestionOption[] // for multiple choice
  correct_answer?: string
  order_index?: number
  created_at: string
}

export interface QuestionOption {
  text: string
  correct: boolean
}

export interface Assessment {
  id: string
  module_id: string
  title: string
  description?: string
  assessment_type: AssessmentType
  total_questions?: number
  passing_score: number // percentage (e.g., 70)
  duration_minutes?: number
  is_active: boolean
  questions?: AssessmentQuestion[]
  created_at: string
  updated_at: string
}

export interface StudentAssessmentAnswer {
  question_id: string
  selected_answer?: string // for multiple choice / true false
  text_answer?: string // for short answer
}

export interface StudentAssessmentSubmission {
  assessment_id: string
  answers: StudentAssessmentAnswer[]
}

export interface StudentAssessmentResult {
  id: string
  student_id: string
  assessment_id: string
  score: number // 0-100
  passed: boolean
  attempted_at: string
  completed_at?: string
  created_at: string
}

export interface AssessmentWithQuestions extends Assessment {
  questions: AssessmentQuestion[]
}

export interface StudentAssessmentWithDetails extends StudentAssessmentResult {
  assessment: Assessment
  answers_submitted: StudentAssessmentAnswer[]
}
