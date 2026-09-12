'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getShop() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, shop: null }

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  return { supabase, shop }
}

/**
 * Génère un slug unique pour une session dans une boutique donnée.
 */
async function generateUniqueSessionSlug(
  supabase: any,
  shopId: string,
  baseName: string
): Promise<string> {
  let baseSlug = slugify(baseName) || 'session'
  if (baseSlug.length < 3) baseSlug = 'session-' + baseSlug

  let slug = baseSlug
  let counter = 1

  while (counter < 100) {
    const { data } = await supabase
      .from('publication_sessions')
      .select('id')
      .eq('shop_id', shopId)
      .eq('slug', slug)
      .maybeSingle()

    if (!data) return slug

    counter++
    slug = `${baseSlug}-${counter}`
  }

  return `${baseSlug}-${Date.now()}`
}

/* ============================================
   CREATE
   ============================================ */
export async function createSession(formData: FormData) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const freeDelivery = formData.get('free_delivery_enabled') === 'on'

  if (!name || name.length < 2) {
    return { error: 'Le nom est requis (min 2 caractères).' }
  }
  if (name.length > 120) {
    return { error: 'Le nom est trop long (max 120 caractères).' }
  }

  const slug = await generateUniqueSessionSlug(supabase, shop.id, name)

  const { data: session, error } = await supabase
    .from('publication_sessions')
    .insert({
      shop_id: shop.id,
      name,
      slug,
      description,
      is_active: true,
      free_delivery_enabled: freeDelivery,
    })
    .select('id')
    .single()

  if (error || !session) {
    return { error: 'Erreur création session : ' + error?.message }
  }

  // Affecter automatiquement tous les produits actifs
  // (le vendeur pourra en retirer ensuite)
  const productIds = formData.getAll('product_ids') as string[]
  if (productIds.length > 0) {
    await supabase.from('session_products').insert(
      productIds.map((pid) => ({
        session_id: session.id,
        product_id: pid,
        visible: true,
      }))
    )
  }

  revalidatePath('/dashboard/sessions')
  redirect(`/dashboard/sessions/${session.id}`)
}

/* ============================================
   UPDATE
   ============================================ */
export async function updateSession(id: string, formData: FormData) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { data: existing } = await supabase
    .from('publication_sessions')
    .select('id')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!existing) return { error: 'Session introuvable.' }

  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const freeDelivery = formData.get('free_delivery_enabled') === 'on'
  const isActive = formData.get('is_active') === 'on'

  if (!name || name.length < 2) {
    return { error: 'Le nom est requis (min 2 caractères).' }
  }

  const { error } = await supabase
    .from('publication_sessions')
    .update({
      name,
      description,
      free_delivery_enabled: freeDelivery,
      is_active: isActive,
    })
    .eq('id', id)

  if (error) return { error: 'Erreur mise à jour : ' + error.message }

  revalidatePath('/dashboard/sessions')
  revalidatePath(`/dashboard/sessions/${id}`)
  return { success: true }
}

/* ============================================
   DELETE
   ============================================ */
export async function deleteSession(id: string) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { error } = await supabase
    .from('publication_sessions')
    .delete()
    .eq('id', id)
    .eq('shop_id', shop.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/sessions')
  return { success: true }
}

/* ============================================
   TOGGLE ACTIVE
   ============================================ */
export async function toggleSessionActive(id: string, active: boolean) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { error } = await supabase
    .from('publication_sessions')
    .update({ is_active: active })
    .eq('id', id)
    .eq('shop_id', shop.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/sessions')
  return { success: true }
}

/* ============================================
   SESSION PRODUCTS - Toggle visibilité
   ============================================ */
export async function toggleSessionProduct(
  sessionId: string,
  productId: string,
  visible: boolean
) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  // Vérifier que la session appartient à la boutique
  const { data: session } = await supabase
    .from('publication_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!session) return { error: 'Session introuvable.' }

  const { error } = await supabase
    .from('session_products')
    .update({ visible })
    .eq('session_id', sessionId)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/sessions/${sessionId}`)
  return { success: true }
}

export async function addProductsToSession(
  sessionId: string,
  productIds: string[]
) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { data: session } = await supabase
    .from('publication_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!session) return { error: 'Session introuvable.' }

  if (productIds.length === 0) return { success: true }

  // Upsert : ignorer les doublons
  const rows = productIds.map((pid) => ({
    session_id: sessionId,
    product_id: pid,
    visible: true,
  }))

  const { error } = await supabase
    .from('session_products')
    .upsert(rows, { onConflict: 'session_id,product_id' })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/sessions/${sessionId}`)
  return { success: true }
}

export async function removeProductFromSession(
  sessionId: string,
  productId: string
) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { data: session } = await supabase
    .from('publication_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!session) return { error: 'Session introuvable.' }

  const { error } = await supabase
    .from('session_products')
    .delete()
    .eq('session_id', sessionId)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/sessions/${sessionId}`)
  return { success: true }
}