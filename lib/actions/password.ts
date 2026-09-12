'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

/* ============================================
   CLIENT ADMIN (service_role)
   Utilisé uniquement côté serveur pour :
   - insérer dans password_resets
   - vérifier l'existence d'un user
   - consommer un token après changement de mdp
   ============================================ */
function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local'
    )
  }

  return createAdminClient(url, key, {
    auth: { persistSession: false },
  })
}

/* ============================================
   DEMANDER UN RESET
   - Vérifie si l'utilisateur existe (via RPC)
   - Génère un token
   - Insère dans password_resets (sent = false)
   - Le cron AlwaysData enverra l'email
   ============================================ */
export async function requestPasswordReset(email: string) {
  const trimmed = email?.trim().toLowerCase()

  if (!trimmed || !trimmed.includes('@')) {
    return { error: 'Email invalide.' }
  }

  const supabase = await createClient()

  // 1. Vérifier si l'utilisateur existe (via RPC security definer)
  const { data: userExists, error: rpcError } = await supabase.rpc(
    'user_exists_by_email',
    { p_email: trimmed }
  )

  if (rpcError) {
    console.error('RPC user_exists_by_email error:', rpcError.message)
    // On ne révèle rien, on retourne succès quand même
    return { success: true }
  }

  // Anti-énumération : si l'email n'existe pas, on renvoie succès
  if (!userExists) {
    return { success: true }
  }

  // 2. Générer un token aléatoire (64 caractères hex)
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

  // 3. Insérer dans la table password_resets
  const admin = getAdminClient()

  // Invalider les anciens tokens non envoyés du même email
  await admin
    .from('password_resets')
    .delete()
    .eq('email', trimmed)
    .eq('sent', false)

  const { error: insertError } = await admin
    .from('password_resets')
    .insert({
      email: trimmed,
      token,
      expires_at: expiresAt.toISOString(),
      sent: false,
    })

  if (insertError) {
    console.error('Insert password_resets error:', insertError.message)
    return { error: 'Erreur lors de la création de la demande.' }
  }

  // 4. Succès : le cron s'occupe du reste
  return { success: true }
}

/* ============================================
   METTRE À JOUR LE MOT DE PASSE
   Appelé après que l'utilisateur a cliqué le lien
   et s'est retrouvé connecté sur /nouveau-mot-de-passe

   ✅ Consomme le token APRÈS succès
      (pas dans le callback, pour éviter que Gmail
       ne consomme le token via son pré-chargement)
   ============================================ */
export async function updatePassword(
  newPassword: string,
  resetToken?: string
) {
  const supabase = await createClient()

  // 1. Valider le mot de passe
  if (!newPassword || newPassword.length < 6) {
    return {
      error: 'Le mot de passe doit contenir au moins 6 caractères.',
    }
  }

  // 2. Vérifier que l'utilisateur est connecté
  //    (il l'est grâce au magic link généré par /auth/callback)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Session expirée. Veuillez refaire la demande.' }
  }

  // 3. Mettre à jour le mot de passe
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  // 4. Consommer le token seulement maintenant que tout est OK
  if (resetToken) {
    await consumeResetToken(resetToken)
  }

  return { success: true }
}

/* ============================================
   CONSOMMER UN TOKEN
   Supprime la ligne de password_resets
   Appelé après un changement de mot de passe réussi
   ============================================ */
export async function consumeResetToken(token: string) {
  if (!token) return { success: true }

  try {
    const admin = getAdminClient()
    await admin.from('password_resets').delete().eq('token', token)
    return { success: true }
  } catch (err) {
    console.error('consumeResetToken error:', err)
    // On ne fait pas échouer le changement de mot de passe
    // si la suppression du token échoue
    return { success: true }
  }
}