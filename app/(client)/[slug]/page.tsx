import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'

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
    title: `${shop.name} — LiveShop`,
    description:
      shop.description ??
      `Découvrez les produits et sessions en direct de ${shop.name}`,
  }
}

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ============================================
          HERO BOUTIQUE IMMERSIF
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Blobs décoratifs */}
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float delay-700" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float-slow delay-1000" />
        </div>

        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          {/* Badge boutique ouverte */}
          <div className="inline-flex items-center gap-2 glass-dark text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6 animate-fade-in-up">
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            Boutique ouverte
          </div>

          {/* Logo + nom */}
          <div className="flex items-center gap-4 sm:gap-5 mb-6 animate-fade-in-up delay-100">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 border-4 border-white/10">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight truncate">
                {shop.name}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-mono flex items-center gap-1.5">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                https://liveshop-dusky.vercel.app/{shop.slug}
              </p>
            </div>
          </div>

          {/* Description */}
          {shop.description && (
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed animate-fade-in-up delay-200">
              {shop.description}
            </p>
          )}

          {/* Stats rapides */}
          {(productCount ?? 0) > 0 || (sessions?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 animate-fade-in-up delay-300">
              {(productCount ?? 0) > 0 && (
                <div className="glass-dark rounded-2xl px-4 py-3 border border-white/10">
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    Produits
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {productCount}
                  </p>
                </div>
              )}
              {(sessions?.length ?? 0) > 0 && (
                <div className="glass-dark rounded-2xl px-4 py-3 border border-white/10">
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    Sessions actives
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                    {sessions?.length}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* CTA boutique */}
          <div className="mt-8 animate-fade-in-up delay-400">
            <Link
              href={`/${slug}/boutique`}
              className="group inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 hover:shadow-2xl active:scale-95 transition-all btn-shine"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Voir tous les produits
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
      </section>

      {/* ============================================
          SESSIONS ACTIVES
          ============================================ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              Sessions en cours
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Rejoignez un live et commandez en direct
            </p>
          </div>
          {sessions && sessions.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {sessions.length} en direct
            </span>
          )}
        </div>

        {!sessions || sessions.length === 0 ? (
          <EmptySessions shopSlug={slug} />
        ) : (
          <div className="space-y-3">
            {sessions.map((s: any, index: number) => (
              <SessionCard
                key={s.id}
                session={s}
                shopSlug={slug}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-slate-200 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">L</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              LiveShop
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Propulsé par LiveShop · Développé par{' '}
            <a
              href="https://unitech-qvgo.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gradient hover:opacity-80 transition-opacity"
            >
              UNITECH
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ============================================
   CARTE SESSION
   ============================================ */
function SessionCard({
  session,
  shopSlug,
  index = 0,
}: {
  session: {
    id: string
    name: string
    slug: string
    description: string | null
    free_delivery_enabled: boolean
  }
  shopSlug: string
  index?: number
}) {
  return (
    <Link
      href={`/${shopSlug}/session/${session.slug}`}
      className="group block relative bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/10 card-3d animate-fade-in-up overflow-hidden transition-all duration-300"
      style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      {/* Bande rouge à gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 via-red-600 to-rose-600 rounded-l-3xl" />

      {/* Blob décoratif */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 pl-3">
        <div className="min-w-0 flex-1">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-white" />
              </span>
              En direct
            </span>

            {session.free_delivery_enabled && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
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
          </div>

          {/* Nom */}
          <h3 className="text-lg sm:text-xl font-black text-slate-900 truncate group-hover:text-red-600 transition-colors">
            {session.name}
          </h3>

          {/* Description */}
          {session.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {session.description}
            </p>
          )}
        </div>

        {/* Flèche */}
        <div className="relative shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 group-hover:bg-red-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]">
            <svg
              className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
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
      </div>
    </Link>
  )
}

/* ============================================
   EMPTY SESSIONS
   ============================================ */
function EmptySessions({ shopSlug }: { shopSlug: string }) {
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center overflow-hidden animate-fade-in-up">
      {/* Blobs décoratifs */}
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Aucun live en cours
        </h3>
        <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
          Le vendeur n'a pas lancé de session pour le moment. Vous
          pouvez parcourir la boutique en attendant.
        </p>

        <Link
          href={`/${shopSlug}/boutique`}
          className="inline-flex items-center gap-2 mt-8 bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all btn-shine"
        >
          Parcourir la boutique
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