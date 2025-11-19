import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import type { StudentAssessmentAnswer } from '@/types/assessment'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

/**
 * POST /api/assessments/[assessmentId]/submit
 * Enviar respuestas de evaluación y obtener puntaje
 * @param assessmentId - Assessment ID
 * Body: { answers: StudentAssessmentAnswer[] }
 */
export async function POST(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const { assessmentId } = params
    const { answers = [] } = await request.json() as {
      answers: StudentAssessmentAnswer[]
    }

    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify session and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get assessment and questions
    const { data: assessment, error: assessmentError } = await supabase
      .from('module_assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      )
    }

    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)

    if (!questions) {
      return NextResponse.json(
        { error: 'Error al obtener preguntas' },
        { status: 500 }
      )
    }

    // Calculate score
    let correctAnswers = 0

    answers.forEach((answer) => {
      const question = (questions as any[]).find((q) => q.id === answer.question_id)
      if (!question) return

      if (answer.selected_answer === question.correct_answer ||
          answer.text_answer === question.correct_answer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / answers.length) * 100)
    const passed = score >= ((assessment as any).passing_score || 70)

    // Save result
    const { data: result, error: resultError } = await supabase
      .from('student_assessments')
      .insert({
        student_id: user.id,
        assessment_id: assessmentId,
        score,
        passed,
        attempted_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (resultError) {
      console.error('Error saving assessment result:', resultError)
      return NextResponse.json(
        { error: 'Error al guardar resultado' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      result: {
        ...(result as any),
        score,
        passed,
        correct_answers: correctAnswers,
        total_questions: answers.length,
      },
    })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
