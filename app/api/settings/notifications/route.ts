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
      .select('notifications')
      .eq('user_id', user.id)

    const defaultNotifications = {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: true,
      courseUpdates: true,
      promotions: false,
      soundEnabled: true,
      vibrationEnabled: true,
    }

    if (error && error.code !== 'PGRST116') {
      console.warn('Error al obtener notificaciones:', error)
    }

    const notifications = data && data.length > 0 ? data[0]?.notifications : null

    return NextResponse.json(
      { data: notifications || defaultNotifications },
      { status: 200 }
    )
  } catch (error: any) {
    console.warn('Error en GET /api/settings/notifications:', error)
    return NextResponse.json(
      { data: { emailNotifications: true, pushNotifications: true } },
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
          notifications: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) {
      console.error('Error actualizando notificaciones:', error)
      throw error
    }

    return NextResponse.json(
      { message: 'Notificaciones guardadas', data: data && data[0] ? data[0].notifications : body },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en PUT /api/settings/notifications:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al guardar notificaciones' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  return PUT(req)
}
