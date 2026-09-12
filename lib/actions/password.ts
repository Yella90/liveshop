'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()

  const trimmed = email?.trim().toLowerCase()

  if (!trimmed || !trimmed.includes('@')) {
    return { error: 'Email invalide.' }
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: `${siteUrl}/auth/callback?next=/nouveau-mot-de-passe`,
  })

  if (error) {
    // On ne révèle pas si l'email existe ou pas (sécurité)
    console.error('resetPasswordForEmail error:', error.message)
  }

  // Toujours succès pour éviter l'énumération d'emails
  return { success: true }
}

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