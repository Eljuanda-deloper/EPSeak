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
      .select('privacy')
      .eq('user_id', user.id)

    const defaultPrivacy = {
      profileVisibility: 'private',
      showProgress: false,
      showAchievements: false,
      allowDataCollection: true,
      marketingEmails: false,
    }

    if (error && error.code !== 'PGRST116') {
      console.warn('Error al obtener privacidad:', error)
    }

    const privacy = data && data.length > 0 ? data[0]?.privacy : null

    return NextResponse.json(
      { data: privacy || defaultPrivacy },
      { status: 200 }
    )
  } catch (error: any) {
    console.warn('Error en GET /api/settings/privacy:', error)
    return NextResponse.json(
      { data: { profileVisibility: 'private' } },
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
          privacy: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) {
      console.error('Error actualizando privacidad:', error)
      throw error
    }

    return NextResponse.json(
      { message: 'Privacidad guardada', data: data && data[0] ? data[0].privacy : body },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en PUT /api/settings/privacy:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al guardar privacidad' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  return PUT(req)
}
