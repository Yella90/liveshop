'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function fetchMyOrders(orderIds: string[]) {
  if (!orderIds || orderIds.length === 0) {
    return { orders: [] }
  }

  // Limiter pour éviter les abus
  const ids = orderIds.slice(0, 20)

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('orders')
    .select(
      `
      id, status, payment_status, delivery_visible,
      products_subtotal, delivery_mode, created_at, session_id,
      shops (name, slug, phone),
      order_items (id, product_name, variant_name, quantity, unit_price, total),
      publication_sessions (name, slug)
      `
    )
    .in('id', ids)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchMyOrders error:', error.message)
    return { orders: [], error: error.message }
  }

  return { orders: data ?? [] }
}