'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateShopSettings(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié.' }

  const { data: shop } = await supabase
    .from('shops')
    .select('id, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) return { error: 'Boutique introuvable.' }

  const get = (k: string) => (formData.get(k) as string)?.trim() || null

  const name = get('name')
  if (!name || name.length < 2) {
    return { error: 'Le nom est requis (min 2 caractères).' }
  }
  if (name.length > 100) {
    return { error: 'Le nom est trop long.' }
  }

  const deliveryPayer = get('delivery_payer_default') || 'CLIENT'
  if (!['CLIENT', 'SELLER'].includes(deliveryPayer)) {
    return { error: 'Mode de livraison invalide.' }
  }

  const thresholdRaw = get('free_delivery_threshold')
  const threshold = thresholdRaw ? Number(thresholdRaw) : null
  if (threshold !== null && (threshold < 0 || threshold > 10000000)) {
    return { error: 'Seuil de livraison invalide.' }
  }

  const yearsRaw = get('years_experience')
  const years = yearsRaw ? Number(yearsRaw) : null
  if (years !== null && (years < 0 || years > 100)) {
    return { error: "Années d'expérience invalides." }
  }

  const { error } = await supabase
    .from('shops')
    .update({
      name,
      description: get('description'),
      // ⚠️ PAS de logo_url ici : c'est l'upload qui s'en charge
      phone: get('phone'),
      whatsapp: get('whatsapp'),
      contact_email: get('contact_email'),
      website: get('website'),
      address: get('address'),
      postal_code: get('postal_code'),
      city: get('city'),
      country: get('country'),
      instagram: get('instagram'),
      tiktok: get('tiktok'),
      facebook: get('facebook'),
      opening_hours: get('opening_hours'),
      return_policy: get('return_policy'),
      shipping_policy: get('shipping_policy'),
      years_experience: years,
      delivery_payer_default: deliveryPayer,
      free_delivery_threshold: threshold,
    })
    .eq('id', shop.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/parametres')
  revalidatePath('/dashboard')
  revalidatePath(`/${shop.slug}`)
  revalidatePath(`/${shop.slug}/boutique`)

  return { success: true }
}