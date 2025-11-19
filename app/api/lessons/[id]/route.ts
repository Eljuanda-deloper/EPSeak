import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/lessons/[id]
 * Obtener lección con todos sus assets (audios, imágenes, videos)
 * @param id - Lesson ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lección no encontrada' },
        { status: 404 }
      )
    }

    // Get assets for this lesson
    const { data: assets, error: assetsError } = await supabase
      .from('lesson_assets')
      .select('*')
      .eq('lesson_id', id)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (assetsError) {
      return NextResponse.json(
        { error: 'Error al obtener assets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      lesson: {
        ...lesson,
        assets: assets || [],
      },
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
