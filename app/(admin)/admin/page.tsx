import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Stats globales en parallèle
  const [
    { count: shopsCount },
    { count: usersCount },
    { count: ordersCount },
    { count: productsCount },
    { data: recentOrders },
    { data: recentShops },
  ] = await Promise.all([
    supabase.from('shops').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select(
        'id, client_name, products_subtotal, status, created_at, shop_id, shops(name, slug)'
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('shops')
      .select('id, name, slug, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Chiffre d'affaires global
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('products_subtotal')
    .in('status', ['CONFIRMEE', 'LIVREE'])

  const totalRevenue =
    paidOrders?.reduce(
      (sum, o) => sum + Number(o.products_subtotal || 0),
      0
    ) ?? 0

  // Commandes en attente
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'EN_ATTENTE')

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Administration
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Vue d&apos;ensemble de la plateforme LiveShop
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AdminStatCard
          label="Chiffre d'affaires"
          value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`}
          icon="revenue"
          gradient="from-emerald-500 to-emerald-700"
          delay={0}
        />
        <AdminStatCard
          label="Commandes"
          value={String(ordersCount ?? 0)}
          badge={
            pendingOrders && pendingOrders > 0
              ? `${pendingOrders} en attente`
              : undefined
          }
          icon="orders"
          gradient="from-indigo-500 to-violet-600"
          delay={100}
        />
        <AdminStatCard
          label="Boutiques"
          value={String(shopsCount ?? 0)}
          icon="stores"
          gradient="from-amber-500 to-orange-600"
          delay={200}
        />
        <AdminStatCard
          label="Utilisateurs"
          value={String(usersCount ?? 0)}
          icon="users"
          gradient="from-rose-500 to-pink-600"
          delay={300}
        />
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Commandes récentes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Commandes récentes
              </h2>
            </div>
            <Link
              href="/admin/commandes"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  Aucune commande pour le moment
                </p>
              </div>
            ) : (
              recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/commandes`}
                  className="flex items-center gap-3 p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">
                      {order.client_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {order.client_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {order.shops?.name ?? 'Boutique inconnue'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">
                      {Number(order.products_subtotal).toLocaleString(
                        'fr-FR'
                      )}{' '}
                      FCFA
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Boutiques récentes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Boutiques récentes
              </h2>
            </div>
            <Link
              href="/admin/boutiques"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {!recentShops || recentShops.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  Aucune boutique pour le moment
                </p>
              </div>
            ) : (
              recentShops.map((shop: any) => (
                <Link
                  key={shop.id}
                  href={`/${shop.slug}`}
                  target="_blank"
                  className="flex items-center gap-3 p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">
                      {shop.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {shop.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      /{shop.slug}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs text-slate-500">
                      {new Date(shop.created_at).toLocaleDateString(
                        'fr-FR',
                        { day: 'numeric', month: 'short' }
                      )}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/admin/boutiques"
            label="Gérer les boutiques"
            description={`${shopsCount ?? 0} boutiques`}
            icon="stores"
          />
          <QuickAction
            href="/admin/utilisateurs"
            label="Gérer les utilisateurs"
            description={`${usersCount ?? 0} utilisateurs`}
            icon="users"
          />
          <QuickAction
            href="/admin/commandes"
            label="Voir les commandes"
            description={`${ordersCount ?? 0} commandes`}
            icon="orders"
          />
          <QuickAction
            href="/admin/zones-livraison"
            label="Zones de livraison"
            description="Configuration"
            icon="map"
          />
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Composants
   ============================================ */
function AdminStatCard({
  label,
  value,
  badge,
  icon,
  gradient,
  delay = 0,
}: {
  label: string
  value: string
  badge?: string
  icon: 'revenue' | 'orders' | 'stores' | 'users'
  gradient: string
  delay?: number
}) {
  return (
    <div
      className="bg-slate-900 rounded-2xl border border-slate-800 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <StatIcon name={icon} />
        </div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-black text-white mt-1 truncate">
        {value}
      </p>
    </div>
  )
}

function StatIcon({ name }: { name: string }) {
  const cls = 'w-5 h-5 text-white'
  if (name === 'revenue')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  if (name === 'stores')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string
  label: string
  description: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="group bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-white flex items-center justify-center mb-3 transition-colors">
        <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
          <StatIcon name={icon} />
        </div>
      </div>
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    EN_ATTENTE: { label: 'Attente', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    CONFIRMEE: { label: 'Confirmée', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    ANNULEE: { label: 'Annulée', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
    LIVREE: { label: 'Livrée', cls: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  }
  const s = map[status] ?? map.EN_ATTENTE
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wide border px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}