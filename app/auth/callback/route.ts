export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  const admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Vérifier le token (SANS le consommer)
  const { data: reset } = await admin
    .from('password_resets')
    .select('id, email, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!reset) {
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  // Rediriger vers le formulaire (le token sera consommé au submit)
  return NextResponse.redirect(
    `${origin}/nouveau-mot-de-passe?token=${token}`
  )
}