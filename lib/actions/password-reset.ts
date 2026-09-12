'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function requestPasswordReset(email: string) {
  const trimmed = email?.trim().toLowerCase()

  if (!trimmed || !trimmed.includes('@')) {
    return { error: 'Email invalide.' }
  }

  const supabase = await createServerClient()

  // 1. Vérifier si l'utilisateur existe (via une RPC security definer)
  const { data: userExists, error: rpcError } = await supabase.rpc(
    'user_exists_by_email',
    { p_email: trimmed }
  )

  if (rpcError) {
    console.error('RPC error:', rpcError.message)
  }

  // Anti-énumération : on renvoie toujours succès
  if (!userExists) {
    return { success: true }
  }

  // 2. Générer un token aléatoire
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h

  // 3. Insérer dans la table
  const admin = getAdminClient()
  const { error } = await admin.from('password_resets').insert({
    email: trimmed,
    token,
    expires_at: expiresAt.toISOString(),
    sent: false,
  })

  if (error) {
    console.error('Insert error:', error.message)
    return { error: 'Erreur lors de la création de la demande.' }
  }

  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createServerClient()

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

  if (error) return { error: error.message }

  return { success: true }
}