'use server'

import { createClient } from '@/lib/supabase/server'
import { isValidSlug } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* ============================================
   VÉRIFIER LA DISPONIBILITÉ D'UN SLUG
   Appelée en temps réel par OnboardingForm
   ============================================ */
export async function checkSlugAvailability(
  slug: string
): Promise<{ available: boolean; reason?: string }> {
  if (!slug) return { available: false, reason: 'Requis' }

  if (slug.length < 3) {
    return { available: false, reason: 'Trop court (min 3 caractères)' }
  }
  if (slug.length > 50) {
    return { available: false, reason: 'Trop long (max 50 caractères)' }
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      available: false,
      reason: 'Lettres minuscules, chiffres et tirets uniquement',
    }
  }
  if (!isValidSlug(slug)) {
    return { available: false, reason: 'Ce nom est réservé' }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('shops')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (data) return { available: false, reason: 'Ce nom est déjà pris' }
  return { available: true }
}

/* ============================================
   CRÉER UNE BOUTIQUE
   Appelée par OnboardingForm après inscription
   ============================================ */
export async function createShop(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté.' }
  }

  // Vérifier qu'il n'a pas déjà une boutique
  const { data: existing } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: 'Vous avez déjà une boutique.' }
  }

  const name = (formData.get('name') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim().toLowerCase()
  const description = (formData.get('description') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null

  // Validation
  if (!name || name.length < 2) {
    return { error: 'Le nom doit contenir au moins 2 caractères.' }
  }
  if (name.length > 100) {
    return { error: 'Le nom est trop long (max 100 caractères).' }
  }
  if (!slug || !isValidSlug(slug)) {
    return { error: 'Le lien de la boutique est invalide.' }
  }

  // Vérification finale du slug
  const check = await checkSlugAvailability(slug)
  if (!check.available) {
    return { error: check.reason || 'Ce lien est indisponible.' }
  }

  // Création
  const { error } = await supabase.from('shops').insert({
    user_id: user.id,
    name,
    slug,
    description,
    phone,
  })

  if (error) {
    console.error('createShop error:', error.message)
    return { error: 'Erreur lors de la création : ' + error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}