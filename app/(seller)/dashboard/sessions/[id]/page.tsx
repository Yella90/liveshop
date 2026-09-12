import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SessionDetailClient from '@/components/seller/SessionDetailClient'

export default async function SessionDetailPage({
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
    .select('id, slug, name')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  const { data: session } = await supabase
    .from('publication_sessions')
    .select('*')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!session) notFound()

  // Récupérer les produits associés
  const { data: sessionProducts } = await supabase
    .from('session_products')
    .select(
      `
      product_id,
      visible,
      products(id, name, base_price, images, active, product_variants(stock))
      `
    )
    .eq('session_id', id)

  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', id)

  const productList = (sessionProducts ?? []).map((sp: any) => ({
    productId: sp.product_id,
    visible: sp.visible,
    name: sp.products?.name ?? '',
    base_price: sp.products?.base_price ?? 0,
    image: sp.products?.images?.[0] ?? null,
    active: sp.products?.active ?? false,
    totalStock:
      sp.products?.product_variants?.reduce(
        (s: number, v: any) => s + v.stock,
        0
      ) ?? 0,
  }))

  // Tous les produits actifs de la boutique (pour en ajouter)
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, base_price, images, product_variants(stock)')
    .eq('shop_id', shop.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  const availableProducts = (allProducts ?? [])
    .filter((p) => !productList.some((sp) => sp.productId === p.id))
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      base_price: p.base_price,
      image: p.images?.[0] ?? null,
      totalStock:
        p.product_variants?.reduce(
          (s: number, v: any) => s + v.stock,
          0
        ) ?? 0,
    }))

  return (
    <SessionDetailClient
      session={{
        id: session.id,
        name: session.name,
        slug: session.slug,
        description: session.description,
        is_active: session.is_active,
        free_delivery_enabled: session.free_delivery_enabled,
        created_at: session.created_at,
      }}
      shop={{ slug: shop.slug, name: shop.name }}
      initialProducts={productList}
      availableProducts={availableProducts}
      orderCount={orderCount ?? 0}
    />
  )
}