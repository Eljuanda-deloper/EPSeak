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

    const { confirmDelete } = await req.json()

    if (confirmDelete !== true) {
      return NextResponse.json(
        { error: 'Debes confirmar la eliminación' },
        { status: 400 }
      )
    }

    // Eliminar perfil
    await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // Eliminar usuario
    const { error } = await supabase.auth.admin.deleteUser(user.id)

    if (error) throw error

    return NextResponse.json(
      { message: 'Cuenta eliminada correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cuenta' },
      { status: 500 }
    )
  }
}
