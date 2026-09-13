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

  // ✅ Récupérer TOUS les champs nécessaires pour SellerInfoCard
  const { data: shop } = await supabase
    .from('shops')
    .select(
      `
      id,
      name,
      slug,
      description,
      logo_url,
      phone,
      address,
      postal_code,
      city,
      country,
      whatsapp,
      contact_email,
      website,
      instagram,
      tiktok,
      facebook,
      opening_hours,
      return_policy,
      shipping_policy,
      verified,
      years_experience,
      created_at,
      delivery_payer_default,
      free_delivery_threshold
      `
    )
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) notFound()

  // Résoudre la session si fournie
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
        description: shop.description,
        logo_url: shop.logo_url,
        phone: shop.phone,
        address: shop.address,
        postal_code: shop.postal_code,
        city: shop.city,
        country: shop.country,
        whatsapp: shop.whatsapp,
        contact_email: shop.contact_email,
        website: shop.website,
        instagram: shop.instagram,
        tiktok: shop.tiktok,
        facebook: shop.facebook,
        opening_hours: shop.opening_hours,
        return_policy: shop.return_policy,
        shipping_policy: shop.shipping_policy,
        verified: shop.verified,
        years_experience: shop.years_experience,
        created_at: shop.created_at,
        delivery_payer_default: shop.delivery_payer_default,
        free_delivery_threshold: shop.free_delivery_threshold,
      }}
      sessionId={sessionId}
      sessionSlug={sessionSlug ?? null}
    />
  )
}