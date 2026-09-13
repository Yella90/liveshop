import Link from 'next/link'

type Shop = {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  created_at: string
}

type Stats = {
  productCount?: number
  orderCount?: number
  sessionCount?: number
}

export default function SellerInfoCard({
  shop,
  stats = {},
  variant = 'full',
}: {
  shop: Shop
  stats?: Stats
  variant?: 'full' | 'compact' | 'badge'
}) {
  /* ============================================
     VARIANTE BADGE (petit bloc discret)
     ============================================ */
  if (variant === 'badge') {
    return (
      <Link
        href={`/${shop.slug}`}
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-[9px]">
            {shop.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-white text-xs font-semibold truncate max-w-[120px]">
          {shop.name}
        </span>
        <svg
          className="w-3 h-3 text-emerald-400 shrink-0"
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
      </Link>
    )
  }

  /* ============================================
     VARIANTE COMPACT (1 ligne)
     ============================================ */
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md">
          <span className="text-white font-black text-base">
            {shop.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-slate-900 truncate">
              {shop.name}
            </p>
            <VerifiedBadge />
          </div>
          <p className="text-[10px] text-slate-500">
            Membre depuis {getMemberSince(shop.created_at)}
          </p>
        </div>
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="p-2 -mr-1 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0"
            title="Appeler"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </a>
        )}
      </div>
    )
  }

  /* ============================================
     VARIANTE FULL (carte complète)
     ============================================ */
  const memberSince = getMemberSince(shop.created_at)
  const isNew = isNewShop(shop.created_at)

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      {/* Bande dégradée */}
      <div className="h-16 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 relative">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="px-5 pb-5">
        {/* Avatar qui chevauche */}
        <div className="flex items-end justify-between -mt-10 mb-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border-4 border-white shadow-xl">
              <span className="text-white font-black text-3xl">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-md">
              <svg
                className="w-3.5 h-3.5 text-white"
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

          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Appeler
            </a>
          )}
        </div>

        {/* Nom + badges */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h2 className="text-xl font-black text-slate-900">
            {shop.name}
          </h2>
          <VerifiedBadge />
          {isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          )}
        </div>

        {/* Description */}
        {shop.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {shop.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          {typeof stats.productCount === 'number' && (
            <Stat
              label="Produits"
              value={String(stats.productCount)}
              icon="products"
            />
          )}
          {typeof stats.orderCount === 'number' && (
            <Stat
              label="Commandes"
              value={String(stats.orderCount)}
              icon="orders"
            />
          )}
          <Stat
            label="Membre depuis"
            value={memberSince}
            icon="calendar"
          />
        </div>

        {/* Trust indicators */}
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-900">
                Vendeur vérifié sur LiveShop
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Le vendeur vous appellera pour confirmer votre commande
                avant livraison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Composants auxiliaires
   ============================================ */
function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
      title="Vendeur vérifié"
    >
      <svg
        className="w-3 h-3"
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
      Vérifié
    </span>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: 'products' | 'orders' | 'calendar'
}) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-1.5">
        <StatIcon name={icon} />
      </div>
      <p className="text-sm font-black text-slate-900 truncate">
        {value}
      </p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
        {label}
      </p>
    </div>
  )
}

function StatIcon({ name }: { name: string }) {
  const cls = 'w-4 h-4 text-slate-700'
  if (name === 'products')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

/* ============================================
   Utilitaires
   ============================================ */
function getMemberSince(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 30) {
    const weeks = Math.max(1, Math.floor(diffDays / 7))
    return `${weeks} sem.`
  }

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) {
    return `${diffMonths} mois`
  }

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears} an${diffYears > 1 ? 's' : ''}`
}

function isNewShop(createdAt: string): boolean {
  const date = new Date(createdAt)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffDays < 30
}