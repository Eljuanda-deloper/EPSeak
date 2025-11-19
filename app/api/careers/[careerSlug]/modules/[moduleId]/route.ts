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

    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id, title, description, order_index, estimated_hours')
      .eq('id', params.moduleId)
      .eq('is_active', true)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, description, order_position, estimated_duration_minutes, content_text')
      .eq('module_id', params.moduleId)
      .eq('is_published', true)
      .order('order_position', { ascending: true })

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
