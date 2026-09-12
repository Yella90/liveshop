'use server'

import { createClient } from '@/lib/supabase/server'
import { isValidSlug } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function checkSlugAvailability(slug: string): Promise<{ available: boolean; reason?: string }> {
  if (!isValidSlug(slug)) {
    if (slug.length < 3) return { available: false, reason: 'Trop court (min 3 caractères)' }
    if (slug.length > 50) return { available: false, reason: 'Trop long (max 50 caractères)' }
    if (!/^[a-z0-9-]+$/.test(slug)) return { available: false, reason: 'Lettres minuscules, chiffres et tirets uniquement' }
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

export async function createShop(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const name = (formData.get('name') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim().toLowerCase()
  const description = (formData.get('description') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null

  if (!name || name.length < 2) return { error: 'Nom trop court' }
  if (!isValidSlug(slug)) return { error: 'Slug invalide' }

  const check = await checkSlugAvailability(slug)
  if (!check.available) return { error: check.reason }

  const { error } = await supabase.from('shops').insert({
    user_id: user.id,
    name,
    slug,
    description,
    phone,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}