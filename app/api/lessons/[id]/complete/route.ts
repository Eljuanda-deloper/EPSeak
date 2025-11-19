import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

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
 * POST /api/lessons/[id]/complete
 * Marcar lección como completada
 * @param id - Lesson ID
 * Body: { time_spent_minutes?: number }
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { time_spent_minutes = 0 } = await request.json()

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

    // Get lesson to find module_id
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('module_id')
      .eq('id', id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lección no encontrada' },
        { status: 404 }
      )
    }

    // Upsert progress
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .upsert({
        student_id: user.id,
        lesson_id: id,
        completed_at: new Date().toISOString(),
        time_spent_minutes,
      } as any, {
        onConflict: 'student_id,lesson_id',
      })
      .select()
      .single()

    if (progressError) {
      console.error('Error updating progress:', progressError)
      return NextResponse.json(
        { error: 'Error al marcar lección como completada' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
