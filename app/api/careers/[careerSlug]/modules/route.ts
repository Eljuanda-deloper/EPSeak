import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { careerSlug: string } }
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

    // Get the career
    const { data: career, error: careerError } = await supabase
      .from('careers')
      .select('id, title, slug')
      .eq('slug', params.careerSlug)
      .eq('is_active', true)
      .single()

    if (careerError || !career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    // Get all modules for this career
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, title, description, order_index, estimated_hours, total_lessons')
      .eq('career_id', career.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (modulesError) {
      return NextResponse.json(
        { error: 'Failed to fetch modules' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      career,
      modules: modules || [],
      totalModules: modules?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching career modules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
