import Link from 'next/link'

type Shop = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  country: string | null
  whatsapp: string | null
  contact_email: string | null
  website: string | null
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  opening_hours: string | null
  return_policy: string | null
  shipping_policy: string | null
  verified: boolean
  years_experience: number | null
  created_at: string
}

type Stats = {
  productCount?: number
  orderCount?: number
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
     VARIANTE BADGE
     ============================================ */
  if (variant === 'badge') {
    return (
      <Link
        href={`/${shop.slug}`}
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
      >
        <LogoOrInitial shop={shop} size="xs" />
        <span className="text-white text-xs font-semibold truncate max-w-[120px]">
          {shop.name}
        </span>
        {shop.verified && (
          <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )}
      </Link>
    )
  }

  /* ============================================
     VARIANTE COMPACT
     ============================================ */
  if (variant === 'compact') {
    const hasStats =
      typeof stats.productCount === 'number' ||
      (typeof stats.orderCount === 'number' && stats.orderCount > 0)

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <LogoOrInitial shop={shop} size="md" showBadge={shop.verified} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-slate-900 truncate">
                {shop.name}
              </p>
              {shop.verified && <VerifiedBadge />}
            </div>

            {hasStats ? (
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                {typeof stats.productCount === 'number' && (
                  <span>
                    {stats.productCount} produit
                    {stats.productCount > 1 ? 's' : ''}
                  </span>
                )}
                {typeof stats.productCount === 'number' &&
                  typeof stats.orderCount === 'number' &&
                  stats.orderCount > 0 && (
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                  )}
                {typeof stats.orderCount === 'number' &&
                  stats.orderCount > 0 && (
                    <span className="font-semibold text-emerald-600">
                      {stats.orderCount} commande
                      {stats.orderCount > 1 ? 's' : ''}
                    </span>
                  )}
              </p>
            ) : (
              shop.city && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {shop.city}
                  {shop.country && ` · ${shop.country}`}
                </p>
              )
            )}
          </div>

          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="p-2 -mr-1 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0"
              title="Appeler le vendeur"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    )
  }

  /* ============================================
     VARIANTE FULL
     ============================================ */
  const memberSince = getMemberSince(shop.created_at)
  const isNew = isNewShop(shop.created_at)

  const fullAddress = [shop.address, shop.postal_code, shop.city, shop.country]
    .filter(Boolean)
    .join(', ')

  const socials = [
    shop.website && { label: 'Site web', url: shop.website, icon: 'web' },
    shop.instagram && {
      label: `@${shop.instagram.replace('@', '')}`,
      url: `https://instagram.com/${shop.instagram.replace('@', '')}`,
      icon: 'instagram',
    },
    shop.tiktok && {
      label: `@${shop.tiktok.replace('@', '')}`,
      url: `https://tiktok.com/@${shop.tiktok.replace('@', '')}`,
      icon: 'tiktok',
    },
    shop.facebook && {
      label: 'Facebook',
      url: shop.facebook.startsWith('http')
        ? shop.facebook
        : `https://facebook.com/${shop.facebook}`,
      icon: 'facebook',
    },
  ].filter(Boolean) as { label: string; url: string; icon: string }[]

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Bande dégradée */}
      <div className="h-20 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 relative">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="px-5 pb-5">
        {/* Logo + bouton appel */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {shop.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white font-black text-4xl">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {shop.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler
            </a>
          )}
        </div>

        {/* Nom + badges */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h2 className="text-xl font-black text-slate-900">{shop.name}</h2>
          {shop.verified && <VerifiedBadge />}
          {isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          )}
          {shop.years_experience && shop.years_experience > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {shop.years_experience}+ ans d&apos;exp.
            </span>
          )}
        </div>

        {/* Description */}
        {shop.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {shop.description}
          </p>
        )}

        {/* Infos pratiques */}
        <div className="space-y-2 mb-4">
          {fullAddress && <InfoRow icon="map" text={fullAddress} />}
          {shop.opening_hours && (
            <InfoRow icon="clock" text={shop.opening_hours} />
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Icon name="whatsapp" />
              <span>WhatsApp : {shop.whatsapp}</span>
            </a>
          )}
          {shop.contact_email && (
            <a
              href={`mailto:${shop.contact_email}`}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <Icon name="email" />
              <span className="truncate">{shop.contact_email}</span>
            </a>
          )}
        </div>

        {/* Réseaux sociaux */}
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {socials.map((s) => (
              <a
                key={s.icon}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                <Icon name={s.icon} />
                {s.label}
              </a>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <Stat
            label="Produits"
            value={
              typeof stats.productCount === 'number'
                ? String(stats.productCount)
                : '—'
            }
            icon="products"
          />
          <Stat
            label="Commandes"
            value={
              typeof stats.orderCount === 'number'
                ? String(stats.orderCount)
                : '—'
            }
            icon="orders"
          />
          <Stat label="Membre depuis" value={memberSince} icon="calendar" />
        </div>

        {/* Politiques */}
        {(shop.return_policy || shop.shipping_policy) && (
          <div className="mt-4 space-y-2">
            {shop.shipping_policy && (
              <PolicyBox
                icon="truck"
                title="Livraison"
                text={shop.shipping_policy}
              />
            )}
            {shop.return_policy && (
              <PolicyBox
                icon="return"
                title="Retours"
                text={shop.return_policy}
              />
            )}
          </div>
        )}

        {/* Trust indicator */}
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
   SOUS-COMPOSANTS
   ============================================ */
function LogoOrInitial({
  shop,
  size,
  showBadge = false,
}: {
  shop: Shop
  size: 'xs' | 'md'
  showBadge?: boolean
}) {
  const dims = size === 'xs' ? 'w-5 h-5' : 'w-12 h-12'
  const radius = size === 'xs' ? 'rounded-full' : 'rounded-2xl'
  const textSize = size === 'xs' ? 'text-[9px]' : 'text-lg'

  return (
    <div className="relative shrink-0">
      <div className={`${dims} ${radius} bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md overflow-hidden`}>
        {shop.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shop.logo_url}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={`text-white font-black ${textSize}`}>
            {shop.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {showBadge && (
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  )
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Vérifié
    </span>
  )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-600">
      <Icon name={icon} />
      <span className="leading-relaxed">{text}</span>
    </div>
  )
}

function PolicyBox({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
          <Icon name={icon} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
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
      <p className="text-sm font-black text-slate-900 truncate">{value}</p>
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

function Icon({ name }: { name: string }) {
  const cls = 'w-4 h-4 shrink-0'
  if (name === 'map')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  if (name === 'clock')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  if (name === 'email')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  if (name === 'whatsapp')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  if (name === 'web')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  if (name === 'instagram')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37a4 4 0 11-7.914 1.174A4 4 0 0116 11.37z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
      </svg>
    )
  if (name === 'tiktok')
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    )
  if (name === 'facebook')
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.88h-2.33v6.99A10 10 0 0022 12z" />
      </svg>
    )
  if (name === 'truck')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  if (name === 'return')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    )
  return null
}

/* ============================================
   UTILITAIRES
   ============================================ */
function getMemberSince(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 1) return "Aujourd'hui"
  if (diffDays < 7) return `${diffDays}j`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} sem.`
  }

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} mois`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears} an${diffYears > 1 ? 's' : ''}`
}

function isNewShop(createdAt: string): boolean {
  const date = new Date(createdAt)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffDays < 14
}