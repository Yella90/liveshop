import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderDetailClient from '@/components/seller/OrderDetailClient'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, slug')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items(*),
      publication_sessions(id, name, slug)
      `
    )
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!order) notFound()

  return (
    <OrderDetailClient
      order={{
        id: order.id,
        client_name: order.client_name,
        client_phone: order.client_phone,
        client_quarter: order.client_quarter,
        delivery_mode: order.delivery_mode,
        delivery_payer: order.delivery_payer,
        delivery_visible: order.delivery_visible,
        products_subtotal: order.products_subtotal,
        status: order.status,
        payment_status: order.payment_status,
        note: order.note,
        created_at: order.created_at,
        items: (order.order_items ?? []).map((i: any) => ({
          id: i.id,
          product_name: i.product_name,
          variant_name: i.variant_name,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total: i.total,
        })),
        session: order.publication_sessions
          ? {
              id: order.publication_sessions.id,
              name: order.publication_sessions.name,
              slug: order.publication_sessions.slug,
            }
          : null,
      }}
      shopSlug={shop.slug}
    />
  )
}