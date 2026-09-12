import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import ClientProductGrid from '@/components/client/ClientProductGrid'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string; sessionSlug: string }>
}) {
  const { slug, sessionSlug } = await params
  if (RESERVED_SLUGS.includes(slug)) notFound()

  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (!shop) notFound()

  const { data: session } = await supabase
    .from('publication_sessions')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('slug', sessionSlug)
    .maybeSingle()
  if (!session || !session.is_active) notFound()

  const { data: sessionProducts } = await supabase
    .from('session_products')
    .select('product_id, products(*, product_variants(*))')
    .eq('session_id', session.id)
    .eq('visible', true)

  const products =
    sessionProducts
      ?.map((sp: any) => sp.products)
      .filter((p: any) => p && p.active) ?? []

  return (
    <div className="min-h-screen">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link
            href={`/${slug}`}
            className="flex items-center gap-2 text-slate-900 hover:text-slate-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Retour</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <h1 className="text-sm font-semibold text-slate-900 truncate">
              {session.name}
            </h1>
          </div>

          {/* ✅ Lien panier qui conserve la session */}
          <Link
            href={`/${slug}/panier?session=${sessionSlug}`}
            className="p-2 -mr-2 text-slate-900 hover:text-slate-700 relative"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Bandeau live */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              En direct
            </span>
            {session.free_delivery_enabled && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-white text-red-600 px-2.5 py-1 rounded-full">
                🚚 Livraison offerte
              </span>
            )}
          </div>
          {session.description && (
            <p className="text-sm text-white/90 mt-2">
              {session.description}
            </p>
          )}
        </div>
      </div>

      {/* Produits */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Produits du live
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} article{products.length > 1 ? 's' : ''}{' '}
            disponible{products.length > 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              Aucun produit dans cette session pour le moment.
            </p>
          </div>
        ) : (
          // ✅ On passe sessionSlug pour conserver la session dans le panier
          <ClientProductGrid
            shopSlug={slug}
            sessionSlug={sessionSlug}
            products={products}
          />
        )}
      </div>
    </div>
  )
}