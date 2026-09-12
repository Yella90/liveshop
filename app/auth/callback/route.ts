
export const runtime = 'nodejs'; // <-- AJOUTEZ CETTE LIGNE AUSSI
export const dynamic = 'force-dynamic'; // <-- Ajoutez cette ligne
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

  // 1. Vérifier le token
  const { data: reset, error } = await admin
    .from('password_resets')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !reset) {
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  // 2. Supprimer le token (usage unique)
  await admin.from('password_resets').delete().eq('id', reset.id)

  // 3. Générer un magic link pour connecter l'utilisateur
  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: reset.email,
      options: {
        redirectTo: `${origin}/nouveau-mot-de-passe`,
      },
    })

  if (linkError || !linkData?.properties?.action_link) {
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  // 4. Rediriger vers le magic link (qui redirigera vers /nouveau-mot-de-passe)
  return NextResponse.redirect(linkData.properties.action_link)
}