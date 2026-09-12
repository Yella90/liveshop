import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import ClientProductGrid from '@/components/client/ClientProductGrid'

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

  // Filtrer les produits qui ont au moins une variante en stock > 0
  // (ou toutes les variantes, selon votre choix)
  const visibleProducts =
    products?.filter((p) => {
      const variants = p.product_variants ?? []
      if (variants.length === 0) return true
      return variants.some((v: any) => v.stock > 0)
    }) ?? []

  return (
    <div className="min-h-screen">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link
            href={`/${slug}`}
            className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
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

          <h1 className="text-sm font-semibold text-slate-900 truncate flex-1 text-center">
            {shop.name}
          </h1>

          <Link
            href={`/${slug}/panier`}
            className="p-2 -mr-2 text-slate-900 hover:text-slate-700 transition-colors relative"
            title="Panier"
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

      {/* Contenu */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Titre */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Nos produits
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {visibleProducts.length} article
            {visibleProducts.length > 1 ? 's' : ''} disponible
            {visibleProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille de produits (client component pour la recherche) */}
        {visibleProducts.length === 0 ? (
          <EmptyBoutique shopSlug={slug} />
        ) : (
          <ClientProductGrid
            shopSlug={slug}
            products={visibleProducts}
          />
        )}
      </div>
    </div>
  )
}

function EmptyBoutique({ shopSlug }: { shopSlug: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-slate-400"
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
      <h3 className="text-base font-semibold text-slate-900">
        Aucun produit disponible
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Revenez bientôt, de nouveaux articles seront ajoutés.
      </p>
      <Link
        href={`/${shopSlug}`}
        className="inline-block mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Voir les sessions en cours
      </Link>
    </div>
  )
}