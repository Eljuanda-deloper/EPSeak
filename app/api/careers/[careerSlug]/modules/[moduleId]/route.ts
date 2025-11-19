import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { careerSlug: string; moduleId: string } }
) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // First, get the career to verify it exists
    const { data: career, error: careerError } = await supabase
      .from('careers')
      .select('id')
      .eq('slug', params.careerSlug)
      .single()

    if (careerError || !career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    // Get module and verify it belongs to this career
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id, title, description, order_index, duration_hours, career_id')
      .eq('id', params.moduleId)
      .eq('career_id', career.id)
      .eq('is_active', true)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Module not found or does not belong to this career' },
        { status: 404 }
      )
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, description, order_index, duration_minutes, content_text')
      .eq('module_id', params.moduleId)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (lessonsError) {
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      module,
      lessons,
      totalLessons: lessons?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
