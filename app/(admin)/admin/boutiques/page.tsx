import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminBoutiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('shops')
    .select(
      `
      id, name, slug, description, phone, created_at, user_id,
      products(count),
      orders(count)
      `
    )
    .order('created_at', { ascending: false })

  if (q?.trim()) {
    query = query.ilike('name', `%${q.trim()}%`)
  }

  const { data: shops } = await query

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Boutiques
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {shops?.length ?? 0} boutique
            {(shops?.length ?? 0) > 1 ? 's' : ''} sur la plateforme
          </p>
        </div>
      </div>

      {/* Recherche */}
      <form
        action="/admin/boutiques"
        method="GET"
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Rechercher une boutique..."
            className="w-full pl-11 pr-4 py-3 text-sm text-white bg-slate-900 border border-slate-800 rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Liste */}
      {!shops || shops.length === 0 ? (
        <EmptyState
          title="Aucune boutique"
          description="Aucune boutique ne correspond à votre recherche."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop: any, index: number) => (
            <div
              key={shop.id}
              className="group bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 hover:bg-slate-800/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-lg font-black text-white">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono truncate">
                    /{shop.slug}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 py-3 border-y border-slate-800 mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Produits
                  </p>
                  <p className="text-base font-bold text-white">
                    {shop.products?.[0]?.count ?? 0}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Commandes
                  </p>
                  <p className="text-base font-bold text-white">
                    {shop.orders?.[0]?.count ?? 0}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {new Date(shop.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <Link
                  href={`/${shop.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Visiter
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  )
}