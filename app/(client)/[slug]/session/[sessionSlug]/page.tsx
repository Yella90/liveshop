import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import ClientProductGrid from '@/components/client/ClientProductGrid'
import SellerInfoCard from '@/components/client/SellerInfoCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sessionSlug: string }>
}) {
  const { slug, sessionSlug } = await params
  if (RESERVED_SLUGS.includes(slug)) return {}

  const supabase = await createClient()
  const { data: shop } = await supabase
    .from('shops')
    .select('id, name')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) return {}

  const { data: session } = await supabase
    .from('publication_sessions')
    .select('name, description')
    .eq('shop_id', shop.id)
    .eq('slug', sessionSlug)
    .maybeSingle()

  if (!session) return {}

  return {
    title: `${session.name} — ${shop.name}`,
    description:
      session.description ??
      `Session en direct de ${shop.name} — commandez maintenant`,
  }
}

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
    .select('id, name, slug, description, phone, created_at')
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ============================================
          HEADER STICKY
          ============================================ */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link
            href={`/${slug}`}
            className="group flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Retour
            </span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex items-center justify-center shrink-0">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <h1 className="text-sm font-bold text-slate-900 truncate">
              {session.name}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/mes-commandes?from=${slug}`}
              className="group relative p-2 text-slate-900 hover:text-indigo-600 transition-colors"
              title="Suivre mes commandes"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </Link>

            <Link
              href={`/${slug}/panier?session=${sessionSlug}`}
              className="group relative p-2 -mr-2 text-slate-900 hover:text-indigo-600 transition-colors"
              title="Panier"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
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
        </div>
      </header>

      {/* ============================================
          BANDEAU LIVE
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-rose-600 text-white">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float delay-700" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              En direct
            </span>

            {session.free_delivery_enabled && (
              <span className="inline-flex items-center gap-1.5 bg-white text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg animate-bounce-subtle">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"
                  />
                </svg>
                Livraison offerte
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
              {products.length} article{products.length > 1 ? 's' : ''}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            {session.name}
          </h1>

          {session.description && (
            <p className="text-sm sm:text-base text-white/90 mt-3 max-w-2xl leading-relaxed">
              {session.description}
            </p>
          )}
        </div>
      </section>

      {/* ============================================
          ✅ CARTE VENDEUR COMPACTE
          ============================================ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <SellerInfoCard
          shop={shop}
          stats={{ productCount: products.length }}
          variant="compact"
        />
      </div>

      {/* ============================================
          PRODUITS
          ============================================ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Produits du live
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {products.length} article
              {products.length > 1 ? 's' : ''} disponible
              {products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptySession shopSlug={slug} />
        ) : (
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

/* ============================================
   Empty state
   ============================================ */
function EmptySession({ shopSlug }: { shopSlug: string }) {
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center overflow-hidden animate-fade-in-up">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl" />

      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 shadow-xl shadow-red-500/30 animate-bounce-subtle">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Aucun produit dans ce live
        </h3>
        <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
          Le vendeur n&apos;a pas encore ajouté de produits à cette
          session. Revenez bientôt ou consultez la boutique complète.
        </p>

        <Link
          href={`/${shopSlug}/boutique`}
          className="inline-flex items-center gap-2 mt-8 bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all btn-shine"
        >
          Voir la boutique
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}