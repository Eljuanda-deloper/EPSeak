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
 * GET /api/progress/[moduleId]
 * Obtener progreso del estudiante en un módulo
 * @param moduleId - Module ID
 */
export async function GET(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params

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

    // Get lessons in module
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId)

    if (lessonsError || !lessons) {
      return NextResponse.json(
        { error: 'Módulo no encontrado' },
        { status: 404 }
      )
    }

    const lessonIds = (lessons as any[]).map((l) => l.id)

    // Get student progress for all lessons in module
    const { data: progressList, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', user.id)
      .in('lesson_id', lessonIds)

    if (progressError) {
      console.error('Error fetching progress:', progressError)
      return NextResponse.json(
        { error: 'Error al obtener progreso' },
        { status: 500 }
      )
    }

    const completedCount = (progressList || []).length
    const totalCount = lessons.length
    const completionPercentage = Math.round((completedCount / totalCount) * 100)

    return NextResponse.json({
      module_id: moduleId,
      student_id: user.id,
      total_lessons: totalCount,
      completed_lessons: completedCount,
      completion_percentage: completionPercentage,
      lessons_progress: progressList || [],
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
