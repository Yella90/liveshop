import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import ClientProductGrid from '@/components/client/ClientProductGrid'
import VisitTracker from '@/components/client/VisitTracker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.includes(slug)) return {}

  const supabase = await createClient()
  const { data: shop } = await supabase
    .from('shops')
    .select('name, description')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) return {}

  return {
    title: `${shop.name} — Boutique`,
    description: shop.description ?? `Découvrez les produits de ${shop.name}`,
  }
}

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.includes(slug)) notFound()

  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('shop_id', shop.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  const visibleProducts =
    products?.filter((p) => {
      const variants = p.product_variants ?? []
      if (variants.length === 0) return true
      return variants.some((v: any) => v.stock > 0)
    }) ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <VisitTracker shopSlug={slug} />
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[10px]">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 truncate">
              {shop.name}
            </h1>
          </div>

          <Link
            href={`/${slug}/panier`}
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
      </header>

      {/* ============================================
          HERO BOUTIQUE
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Blobs décoratifs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -top-10 -right-20 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl animate-float delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Boutique ouverte
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {shop.name}
              </h1>
              {shop.description && (
                <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl leading-relaxed">
                  {shop.description}
                </p>
              )}
            </div>

            {/* Stats boutique */}
            <div className="flex gap-3 sm:gap-4 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                  Produits
                </p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {visibleProducts.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          LISTE PRODUITS
          ============================================ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* Titre + compte */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tous les produits
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {visibleProducts.length} article
              {visibleProducts.length > 1 ? 's' : ''} disponible
              {visibleProducts.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <EmptyBoutique shopSlug={slug} />
        ) : (
          <ClientProductGrid shopSlug={slug} products={visibleProducts} />
        )}
      </div>
    </div>
  )
}

/* ============================================
   Empty state
   ============================================ */
function EmptyBoutique({ shopSlug }: { shopSlug: string }) {
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center overflow-hidden animate-fade-in-up">
      {/* Blob décoratif */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl" />

      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 animate-bounce-subtle">
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Aucun produit disponible
        </h3>
        <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
          Le vendeur n'a pas encore publié de produits. Revenez bientôt
          ou consultez les sessions en cours.
        </p>

        <Link
          href={`/${shopSlug}`}
          className="inline-flex items-center gap-2 mt-8 bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all btn-shine"
        >
          Voir les sessions en cours
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