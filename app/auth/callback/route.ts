export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')

  // 1. Vérifier la présence du token
  if (!token) {
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  // 2. Vérifier les variables d'environnement
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
    return NextResponse.redirect(
      `${origin}/connexion?error=config-manquante`
    )
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  // 3. Vérifier le token SANS le supprimer
  //    (Gmail et autres clients email pré-chargent les liens,
  //     donc on ne consomme le token qu'après le changement de mot de passe)
  const { data: reset, error: resetError } = await admin
    .from('password_resets')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (resetError) {
    console.error('Erreur vérification token:', resetError.message)
    return NextResponse.redirect(
      `${origin}/connexion?error=erreur-serveur`
    )
  }

  if (!reset) {
    // Token invalide, expiré, ou déjà consommé
    return NextResponse.redirect(
      `${origin}/connexion?error=lien-invalide`
    )
  }

  // 4. Générer un magic link Supabase pour connecter l'utilisateur
  //    On passe le token en query param pour le consommer plus tard
  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: reset.email,
      options: {
        redirectTo: `${origin}/nouveau-mot-de-passe?token=${token}`,
      },
    })

  if (linkError || !linkData?.properties?.action_link) {
    console.error(
      'Erreur génération magic link:',
      linkError?.message || 'Pas de action_link'
    )
    return NextResponse.redirect(
      `${origin}/connexion?error=erreur-serveur`
    )
  }

  // 5. Rediriger vers le magic link Supabase
  //    Supabase va :
  //    - Vérifier le lien magique
  //    - Créer une session
  //    - Rediriger vers /nouveau-mot-de-passe?token=xxx
  return NextResponse.redirect(linkData.properties.action_link)
}