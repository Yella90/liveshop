'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type OrderItemInput = {
  productId: string
  variantId: string
  quantity: number
}

type CreateOrderInput = {
  shopSlug: string
  sessionId?: string | null
  clientName: string
  clientPhone: string
  clientQuarter: string
  deliveryMode: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS'
  note?: string
  items: OrderItemInput[]
}

/* ============================================
   CRÉER UNE COMMANDE
   ============================================ */
export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select(
      'id, user_id, delivery_payer_default, free_delivery_threshold'
    )
    .eq('slug', input.shopSlug)
    .maybeSingle()

  if (!shop) return { error: 'Boutique introuvable.' }

  const clientName = input.clientName?.trim()
  const clientPhone = input.clientPhone?.trim()
  const clientQuarter = input.clientQuarter?.trim()

  if (!clientName || clientName.length < 2) {
    return { error: 'Le nom est requis.' }
  }
  if (!clientPhone || clientPhone.length < 6) {
    return { error: 'Le numéro de téléphone est requis.' }
  }
  if (!clientQuarter || clientQuarter.length < 2) {
    return { error: 'Le quartier est requis.' }
  }
  if (!input.items || input.items.length === 0) {
    return { error: 'Votre panier est vide.' }
  }

  const variantIds = input.items.map((i) => i.variantId)
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, product_id, name, price, stock, products(name, images)')
    .in('id', variantIds)

  if (!variants || variants.length === 0) {
    return { error: 'Produits introuvables.' }
  }

  let subtotal = 0
  const orderItemsData: {
    productId: string
    variantId: string
    productName: string
    variantName: string
    quantity: number
    unitPrice: number
    total: number
  }[] = []

  for (const item of input.items) {
    const variant = variants.find((v) => v.id === item.variantId)
    if (!variant) {
      return { error: "Un produit de votre panier n'existe plus." }
    }

    const qty = Math.max(1, Math.floor(item.quantity))
    if (variant.stock < qty) {
      return {
        error: `Stock insuffisant pour « ${
          (variant.products as any)?.name ?? variant.name
        } » (${variant.stock} restant).`,
      }
    }

    const unitPrice = Number(variant.price)
    const total = unitPrice * qty
    subtotal += total

    orderItemsData.push({
      productId: variant.product_id,
      variantId: variant.id,
      productName: (variant.products as any)?.name ?? '',
      variantName: variant.name,
      quantity: qty,
      unitPrice,
      total,
    })
  }

  const threshold = shop.free_delivery_threshold
  const freeDelivery =
    shop.delivery_payer_default === 'SELLER' ||
    (threshold !== null && subtotal >= Number(threshold))

  const deliveryVisible = freeDelivery ? 'GRATUITE' : 'PAYANTE'
  const deliveryPayer = freeDelivery ? 'SELLER' : 'CLIENT'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      shop_id: shop.id,
      session_id: input.sessionId ?? null,
      client_name: clientName,
      client_phone: clientPhone,
      client_quarter: clientQuarter,
      delivery_mode: input.deliveryMode,
      delivery_payer: deliveryPayer,
      delivery_visible: deliveryVisible,
      products_subtotal: subtotal,
      status: 'EN_ATTENTE',
      payment_status: 'NON_PAYE',
      note: input.note?.trim() || null,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return { error: 'Erreur création commande : ' + orderError?.message }
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      orderItemsData.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        variant_id: i.variantId,
        product_name: i.productName,
        variant_name: i.variantName,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        total: i.total,
      }))
    )

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Erreur lignes commande : ' + itemsError.message }
  }

  if (shop.user_id) {
    await supabase.from('notifications').insert({
      user_id: shop.user_id,
      shop_id: shop.id,
      type: 'ORDER',
      title: 'Nouvelle commande',
      message: `${clientName} a passé une commande de ${subtotal.toLocaleString(
        'fr-FR'
      )} FCFA`,
      link: `/dashboard/commandes/${order.id}`,
    })
  }

  revalidatePath('/dashboard/commandes')
  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/sessions`)

  return { success: true, orderId: order.id }
}

/* ============================================
   VALIDER UNE COMMANDE
   - Décrémente le stock
   ============================================ */
export async function validateOrder(orderId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id, shop_id, status,
      shops!inner(user_id),
      order_items(id, variant_id, quantity, product_name, variant_name)
      `
    )
    .eq('id', orderId)
    .maybeSingle()

  if (!order) return { error: 'Commande introuvable.' }
  if ((order.shops as any)?.user_id !== user.id) {
    return { error: 'Accès refusé.' }
  }
  if (order.status !== 'EN_ATTENTE') {
    return { error: 'Cette commande a déjà été traitée.' }
  }

  const items = order.order_items ?? []

  for (const item of items) {
    if (!item.variant_id) continue

    const { data: variant } = await supabase
      .from('product_variants')
      .select('id, stock, name')
      .eq('id', item.variant_id)
      .maybeSingle()

    if (!variant) {
      return {
        error: `Variante introuvable pour « ${item.product_name} ».`,
      }
    }
    if (variant.stock < item.quantity) {
      return {
        error: `Stock insuffisant pour « ${item.product_name} — ${item.variant_name} » (${variant.stock} restant, ${item.quantity} demandé).`,
      }
    }
  }

  for (const item of items) {
    if (!item.variant_id) continue

    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', item.variant_id)
      .single()

    if (!variant) continue

    const newStock = Math.max(0, variant.stock - item.quantity)

    await supabase
      .from('product_variants')
      .update({ stock: newStock })
      .eq('id', item.variant_id)

    await supabase.from('stock_movements').insert({
      variant_id: item.variant_id,
      quantity: -item.quantity,
      type: 'OUT',
      reference: `order:${orderId}`,
    })
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'CONFIRMEE' })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/commandes')
  revalidatePath(`/dashboard/commandes/${orderId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

/* ============================================
   ANNULER UNE COMMANDE
   - Restaure le stock si CONFIRMEE ou LIVREE
   ============================================ */
export async function cancelOrder(orderId: string, reason?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id, shop_id, status,
      shops!inner(user_id),
      order_items(variant_id, quantity, product_name, variant_name)
      `
    )
    .eq('id', orderId)
    .maybeSingle()

  if (!order) return { error: 'Commande introuvable.' }
  if ((order.shops as any)?.user_id !== user.id) {
    return { error: 'Accès refusé.' }
  }
  if (order.status === 'ANNULEE') {
    return { error: 'Commande déjà annulée.' }
  }

  const shouldRestoreStock =
    order.status === 'CONFIRMEE' || order.status === 'LIVREE'

  if (shouldRestoreStock) {
    for (const item of order.order_items ?? []) {
      if (!item.variant_id) continue

      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('id', item.variant_id)
        .maybeSingle()

      if (!variant) continue

      await supabase
        .from('product_variants')
        .update({ stock: variant.stock + item.quantity })
        .eq('id', item.variant_id)

      await supabase.from('stock_movements').insert({
        variant_id: item.variant_id,
        quantity: item.quantity,
        type: 'IN',
        reference: `cancel:${orderId}`,
      })
    }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'ANNULEE',
      note: reason ? `Annulée : ${reason}` : undefined,
    })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/commandes')
  revalidatePath(`/dashboard/commandes/${orderId}`)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/sessions')
  return { success: true }
}

/* ============================================
   ✅ MARQUER COMME LIVREE
   - Passe le statut à LIVREE
   - ✅ Marque automatiquement comme PAYÉE
     (une commande livrée est considérée payée)
   ============================================ */
export async function markOrderAsDelivered(orderId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, payment_status, shops!inner(user_id)')
    .eq('id', orderId)
    .maybeSingle()

  if (!order) return { error: 'Commande introuvable.' }
  if ((order.shops as any)?.user_id !== user.id) {
    return { error: 'Accès refusé.' }
  }
  if (order.status !== 'CONFIRMEE') {
    return { error: "La commande doit être confirmée d'abord." }
  }

  // ✅ Une commande livrée est automatiquement payée.
  //    Si elle était déjà payée manuellement, on garde ce statut.
  const newPaymentStatus =
    order.payment_status === 'PAYE_MANUELLEMENT'
      ? 'PAYE_MANUELLEMENT'
      : 'PAYE_A_LA_LIVRAISON'

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'LIVREE',
      payment_status: newPaymentStatus,
    })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/commandes')
  revalidatePath(`/dashboard/commandes/${orderId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

/* ============================================
   ✅ MARQUER COMME PAYÉE (manuellement)
   - Peut se faire AVANT la livraison
   - Statuts autorisés : EN_ATTENTE, CONFIRMEE
   - Si la commande est déjà LIVREE, elle est déjà payée
   ============================================ */
export async function markOrderAsPaid(orderId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, payment_status, shops!inner(user_id)')
    .eq('id', orderId)
    .maybeSingle()

  if (!order) return { error: 'Commande introuvable.' }
  if ((order.shops as any)?.user_id !== user.id) {
    return { error: 'Accès refusé.' }
  }

  // Si la commande est livrée, elle est déjà considérée comme payée
  if (order.status === 'LIVREE') {
    return {
      error:
        'Cette commande est déjà livrée et donc considérée comme payée.',
    }
  }

  // Si déjà payée manuellement, ne rien faire
  if (order.payment_status === 'PAYE_MANUELLEMENT') {
    return { error: 'Cette commande est déjà marquée comme payée.' }
  }

  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'PAYE_MANUELLEMENT' })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/commandes')
  revalidatePath(`/dashboard/commandes/${orderId}`)
  return { success: true }
}