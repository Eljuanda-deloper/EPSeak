import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { careerSlug: string; moduleId: string; lessonId: string }
  }
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

    // Fetch lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', params.lessonId)
      .eq('module_id', params.moduleId)
      .eq('is_published', true)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Fetch assets
    const { data: assets, error: assetsError } = await supabase
      .from('lesson_assets')
      .select('*')
      .eq('lesson_id', params.lessonId)
      .order('created_at', { ascending: true })

    if (assetsError) {
      return NextResponse.json(
        { error: 'Failed to fetch assets' },
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
