'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

/* ============================================
   CLIENT ADMIN (service_role)
   ============================================ */
function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant'
    )
  }

  return createAdminClient(url, key, {
    auth: { persistSession: false },
  })
}

/* ============================================
   DEMANDER UN RESET
   ============================================ */
export async function requestPasswordReset(email: string) {
  const trimmed = email?.trim().toLowerCase()

  if (!trimmed || !trimmed.includes('@')) {
    return { error: 'Email invalide.' }
  }

  const supabase = await createClient()

  const { data: userExists, error: rpcError } = await supabase.rpc(
    'user_exists_by_email',
    { p_email: trimmed }
  )

  if (rpcError) {
    console.error('RPC error:', rpcError.message)
    return { success: true }
  }

  if (!userExists) {
    return { success: true }
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  const admin = getAdminClient()

  // Nettoyer les anciens tokens non envoyés
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
    console.error('Insert error:', insertError.message)
    return { error: 'Erreur lors de la création de la demande.' }
  }

  return { success: true }
}

/* ============================================
   ✅ RESET PASSWORD AVEC TOKEN
   - Vérifie le token en DB
   - Récupère l'utilisateur par email
   - Met à jour le mot de passe via admin.updateUserById
   - Supprime le token
   ============================================ */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
) {
  if (!token) {
    return { error: 'Token manquant.' }
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      error: 'Le mot de passe doit contenir au moins 6 caractères.',
    }
  }

  const admin = getAdminClient()

  // 1. Vérifier le token
  const { data: reset, error: resetError } = await admin
    .from('password_resets')
    .select('id, email, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (resetError || !reset) {
    return {
      error: 'Lien invalide ou expiré. Veuillez refaire la demande.',
    }
  }

  // 2. Trouver l'utilisateur par email
  const { data: usersData, error: userError } =
    await admin.auth.admin.listUsers()

  if (userError) {
    return { error: 'Erreur serveur. Réessayez.' }
  }

  const user = usersData.users.find(
    (u) => u.email?.toLowerCase() === reset.email.toLowerCase()
  )

  if (!user) {
    return { error: 'Utilisateur introuvable.' }
  }

  // 3. Mettre à jour le mot de passe
  const { error: updateError } = await admin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  )

  if (updateError) {
    return { error: updateError.message }
  }

  // 4. Supprimer le token (usage unique)
  await admin.from('password_resets').delete().eq('id', reset.id)

  return { success: true }
}