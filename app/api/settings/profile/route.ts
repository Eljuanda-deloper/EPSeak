import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

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

    // Preparar objeto de actualización solo con campos proporcionados
    const updateData: any = {}
    if (body.full_name !== undefined) updateData.full_name = body.full_name
    if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url
    if (body.bio !== undefined) updateData.bio = body.bio
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.timezone !== undefined) updateData.timezone = body.timezone
    if (body.language !== undefined) updateData.language = body.language
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      // Si el perfil no existe, crearlo
      if (error.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: body.full_name || '',
            avatar_url: body.avatar_url || '',
            bio: body.bio || '',
            phone: body.phone || '',
            timezone: body.timezone || 'America/Bogota',
            language: body.language || 'en',
            updated_at: new Date().toISOString(),
          })
          .select()

        if (insertError) throw insertError
        return NextResponse.json({ message: 'Perfil creado', data: insertData }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json({ message: 'Perfil actualizado', data: data && data[0] ? data[0] : null }, { status: 200 })
  } catch (error: any) {
    console.error('Error en PUT /api/settings/profile:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  return PUT(req)
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo perfil:', error)
      throw error
    }

    const profile = data && data.length > 0 ? data[0] : null

    return NextResponse.json({ data: profile }, { status: 200 })
  } catch (error: any) {
    console.error('Error en GET /api/settings/profile:', error)
    return NextResponse.json({ error: error?.message || 'Error al obtener perfil' }, { status: 500 })
  }
}
