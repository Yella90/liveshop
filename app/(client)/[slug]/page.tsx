import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'

export default async function ShopHomePage({
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

  const { data: sessions } = await supabase
    .from('publication_sessions')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shop.id)
    .eq('active', true)

  return (
    <div className="min-h-screen">
      {/* En-tête boutique */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
              <span className="text-3xl sm:text-4xl font-bold">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                {shop.name}
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                liveshop.com/{shop.slug}
              </p>
            </div>
          </div>

          {shop.description && (
            <p className="text-slate-200 text-sm sm:text-base max-w-xl">
              {shop.description}
            </p>
          )}

          {/* Stats rapides */}
          <div className="flex gap-6 mt-6 text-sm">
            {productCount !== null && productCount > 0 && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide">
                  Produits
                </p>
                <p className="text-lg font-bold">{productCount}</p>
              </div>
            )}
            {sessions && sessions.length > 0 && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide">
                  Sessions actives
                </p>
                <p className="text-lg font-bold">{sessions.length}</p>
              </div>
            )}
          </div>

          {/* CTA boutique */}
          <Link
            href={`/${slug}/boutique`}
            className="inline-flex items-center gap-2 mt-8 bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl hover:bg-slate-100 active:scale-[0.98] transition-all"
          >
            Voir tous les produits
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

      {/* Sessions actives */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            🔴 Sessions en cours
          </h2>
          {sessions && sessions.length > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {sessions.length} active{sessions.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <svg
                className="w-7 h-7 text-slate-400"
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
            <p className="text-sm text-slate-500">
              Aucune session active pour le moment.
            </p>
            <Link
              href={`/${slug}/boutique`}
              className="inline-block mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Parcourir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s: any) => (
              <Link
                key={s.id}
                href={`/${slug}/session/${s.slug}`}
                className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-900 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wide">
                        En direct
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">
                      {s.name}
                    </p>
                    {s.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center shrink-0 transition-colors">
                    <svg
                      className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-slate-400">
            Propulsé par <span className="font-semibold text-slate-600">LiveShop</span>
          </p>
        </div>
      </footer>
    </div>
  )
}