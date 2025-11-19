import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/modules/[id]
 * Obtener módulo con todas sus lecciones y assets
 * @param id - Module ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get module
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', id)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Módulo no encontrado' },
        { status: 404 }
      )
    }

    // Get lessons for this module
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', id)
      .order('order_index', { ascending: true })

    if (lessonsError) {
      return NextResponse.json(
        { error: 'Error al obtener lecciones' },
        { status: 500 }
      )
    }

    // Get assets for each lesson
    const lessonsWithAssets = await Promise.all(
      (lessons || []).map(async (lesson) => {
        const { data: assets } = await supabase
          .from('lesson_assets')
          .select('*')
          .eq('lesson_id', lesson.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true })

        return {
          ...lesson,
          assets: assets || [],
        }
      })
    )

    // Get module assessment
    const { data: assessment } = await supabase
      .from('module_assessments')
      .select('*')
      .eq('module_id', id)
      .single()

    return NextResponse.json({
      module: {
        ...module,
        lessons: lessonsWithAssets,
        assessment: assessment || null,
      },
    })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
