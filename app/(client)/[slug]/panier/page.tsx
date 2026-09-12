import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import CartView from '@/components/client/CartView'

export default async function PanierPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ session?: string }>
}) {
  const { slug } = await params
  const { session: sessionSlug } = await searchParams

  if (RESERVED_SLUGS.includes(slug)) notFound()

  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) notFound()

  let sessionId: string | null = null
  if (sessionSlug) {
    const { data: session } = await supabase
      .from('publication_sessions')
      .select('id')
      .eq('shop_id', shop.id)
      .eq('slug', sessionSlug)
      .maybeSingle()
    sessionId = session?.id ?? null
  }

  return (
    <CartView
      shop={{
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        delivery_payer_default: shop.delivery_payer_default,
        free_delivery_threshold: shop.free_delivery_threshold,
      }}
      sessionId={sessionId}
      sessionSlug={sessionSlug ?? null}
    />
  )
}