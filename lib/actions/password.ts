'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

/* ============================================
   CLIENT ADMIN (service_role)
   Utilisé uniquement côté serveur pour :
   - insérer dans password_resets
   - vérifier l'existence d'un user
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
   ============================================ */
export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  if (!newPassword || newPassword.length < 6) {
    return {
      error: 'Le mot de passe doit contenir au moins 6 caractères.',
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Session expirée. Veuillez refaire la demande.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}