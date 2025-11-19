import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
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

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { time_spent_seconds = 0 } = body

    // Update or insert progress
    const { data: progress, error: progressError } = await supabase
      .from('student_lesson_progress')
      .upsert(
        {
          student_id: user.id,
          lesson_id: params.lessonId,
          completed_at: new Date().toISOString(),
          time_spent_seconds,
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,lesson_id' }
      )
      .select()
      .single()

    if (progressError) {
      console.error('Progress error:', progressError)
      return NextResponse.json(
        { error: 'Failed to update progress' },
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
