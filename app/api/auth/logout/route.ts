import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  // Validar que haya usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/auth/login', req.url), {
    status: 302,
  })
}

// Permitir GET también para links
export async function GET(req: Request) {
  return POST(req)
}
