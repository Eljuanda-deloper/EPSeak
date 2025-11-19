import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('theme')
      .eq('user_id', user.id)

    const defaultTheme = {
      mode: 'light',
      primaryColor: '#0A4E5A',
      accentColor: '#7CC4E0',
      fontFamily: 'inter',
      fontSize: 'medium',
      compactMode: false,
    }

    if (error && error.code !== 'PGRST116') {
      console.warn('Error al obtener tema:', error)
    }

    const theme = data && data.length > 0 ? data[0]?.theme : null

    return NextResponse.json(
      { data: theme || defaultTheme },
      { status: 200 }
    )
  } catch (error: any) {
    console.warn('Error en GET /api/settings/theme:', error)
    return NextResponse.json(
      { data: { mode: 'light' } },
      { status: 200 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          theme: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) {
      console.error('Error actualizando tema:', error)
      throw error
    }

    return NextResponse.json(
      { message: 'Tema guardado', data: data && data[0] ? data[0].theme : body },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en PUT /api/settings/theme:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al guardar tema' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  return PUT(req)
}
