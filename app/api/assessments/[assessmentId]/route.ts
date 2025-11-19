import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/assessments/[assessmentId]
 * Obtener evaluación con todas sus preguntas
 * @param assessmentId - Assessment ID
 */
export async function GET(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const { assessmentId } = params

    // Get assessment
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

    // Get questions for this assessment
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('order_index', { ascending: true })

    if (questionsError) {
      return NextResponse.json(
        { error: 'Error al obtener preguntas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      assessment: {
        ...(assessment as any),
        questions: questions || [],
      },
    })
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
