'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateShopSettings(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié.' }

  // Récupérer la boutique
  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) return { error: 'Boutique introuvable.' }

  // Valider les données
  const name = (formData.get('name') as string)?.trim()
  const description =
    (formData.get('description') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const deliveryPayer =
    (formData.get('delivery_payer_default') as string) || 'CLIENT'
  const thresholdRaw = formData.get('free_delivery_threshold') as string
  const threshold = thresholdRaw ? Number(thresholdRaw) : null

  if (!name || name.length < 2) {
    return { error: 'Le nom doit contenir au moins 2 caractères.' }
  }
  if (name.length > 100) {
    return { error: 'Le nom est trop long (max 100 caractères).' }
  }
  if (description && description.length > 500) {
    return { error: 'La description est trop longue (max 500 caractères).' }
  }
  if (phone && phone.length > 20) {
    return { error: 'Le téléphone est trop long (max 20 caractères).' }
  }
  if (
    !['CLIENT', 'SELLER'].includes(deliveryPayer)
  ) {
    return { error: 'Mode de livraison invalide.' }
  }
  if (threshold !== null && (threshold < 0 || threshold > 10000000)) {
    return { error: 'Seuil de livraison invalide.' }
  }

  // Mettre à jour
  const { error } = await supabase
    .from('shops')
    .update({
      name,
      description,
      phone,
      delivery_payer_default: deliveryPayer,
      free_delivery_threshold: threshold,
    })
    .eq('id', shop.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/parametres')
  revalidatePath('/dashboard')
  revalidatePath(`/${shop.id}`)

  return { success: true }
}