import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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

    const { newPassword, confirmPassword } = await req.json()

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    )
  }
}

// Permitir GET también para links
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

    const { data } = await supabase
      .from('user_settings')
      .select('theme')
      .eq('user_id', user.id)
      .single()

    const defaultTheme = {
      mode: 'light',
      primaryColor: '#0A4E5A',
      accentColor: '#7CC4E0',
      fontFamily: 'inter',
      fontSize: 'medium',
      compactMode: false,
    }

    return NextResponse.json(
      { data: data?.theme || defaultTheme },
      { status: 200 }
    )
  } catch (error: any) {
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
      .single()

    if (error) throw error

    return NextResponse.json(
      { message: 'Tema guardado', data: data.theme },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al guardar tema' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  return PUT(req)
}
