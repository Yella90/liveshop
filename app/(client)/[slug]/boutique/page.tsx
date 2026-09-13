import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { RESERVED_SLUGS } from '@/lib/constants'
import ClientProductGrid from '@/components/client/ClientProductGrid'
import SellerInfoCard from '@/components/client/SellerInfoCard'

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
    description:
      shop.description ?? `Découvrez les produits de ${shop.name}`,
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

  // ✅ Client admin pour bypass RLS sur les stats publiques
  const admin = createAdminClient()

  const [
    { data: products },
    { count: productCount },
    { count: orderCount },
    { count: deliveredCount },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('shop_id', shop.id)
      .eq('active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .eq('active', true),
    // ✅ Compteurs via admin (visibles par les clients anonymes)
    admin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id),
    admin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .eq('status', 'LIVREE'),
  ])

  const visibleProducts =
    products?.filter((p) => {
      const variants = p.product_variants ?? []
      if (variants.length === 0) return true
      return variants.some((v: any) => v.stock > 0)
    }) ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header sticky */}
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
            <svg
              className="w-3.5 h-3.5 text-emerald-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
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
        </div>
      </header>

      {/* Hero boutique */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -top-10 -right-20 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl animate-float delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6">
          <SellerInfoCard
            shop={shop}
            stats={{
              productCount: productCount ?? 0,
              orderCount: orderCount ?? 0,
            }}
            variant="full"
          />
        </div>
      </section>

      {/* Liste produits */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
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

function EmptyBoutique({ shopSlug }: { shopSlug: string }) {
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center overflow-hidden">
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
          Le vendeur n&apos;a pas encore publié de produits. Revenez
          bientôt ou consultez les sessions en cours.
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