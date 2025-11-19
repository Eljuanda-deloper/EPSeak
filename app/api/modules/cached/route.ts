/**
 * API Route - Modules with Caching
 * Endpoint optimizado para obtener módulos con caché
 */

import { createClient } from '@/app/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Validar usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Obtener módulos con caché de 5 minutos
    const { data: modules, error } = await supabase
      .from('modules')
      .select(`
        *,
        lessons (*),
        student_modules (
          completion_percentage,
          is_unlocked,
          unlocked_at,
          last_accessed_at
        )
      `)
      .eq('is_active', true)
      .order('order_index')

    if (error) throw error

    // Headers de caché
    const response = NextResponse.json(modules)
    response.headers.set(
      'Cache-Control',
      'private, max-age=300, s-maxage=300'
    )
    response.headers.set('CDN-Cache-Control', 'max-age=300')

    return response
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}
