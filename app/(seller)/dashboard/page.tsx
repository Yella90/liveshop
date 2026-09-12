import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SellerDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // Récupérer la boutique
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/onboarding')

  // Récupérer les statistiques en parallèle
  const [
    { count: productsCount },
    { count: sessionsCount },
    { count: ordersCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id),
    supabase
      .from('publication_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id),
    supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Calculer le CA (commandes confirmées ou livrées)
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('products_subtotal')
    .eq('shop_id', shop.id)
    .in('status', ['CONFIRMEE', 'LIVREE'])

  const totalRevenue =
    paidOrders?.reduce(
      (sum, o) => sum + Number(o.products_subtotal || 0),
      0
    ) ?? 0

  const pendingOrders =
    recentOrders?.filter((o) => o.status === 'EN_ATTENTE').length ?? 0

  const fullName = user.user_metadata?.full_name ?? 'Vendeur'
  const firstName = fullName.split(' ')[0]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Voici un aperçu de votre activité aujourd&apos;hui.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/sessions/nouvelle"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvelle session
          </Link>
        </div>
      </div>

      {/* Bandeau boutique */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 right-16 w-32 h-32 bg-white/5 rounded-full translate-y-16" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold truncate">
                {shop.name}
              </h2>
              <p className="text-slate-300 text-sm truncate">
                liveshop.com/{shop.slug}
              </p>
            </div>
          </div>

          <Link
            href={`/${shop.slug}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
          >
            Voir ma boutique
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Chiffre d'affaires"
          value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`}
          icon="revenue"
          accent="emerald"
        />
        <StatCard
          label="Commandes"
          value={String(ordersCount ?? 0)}
          badge={pendingOrders > 0 ? `${pendingOrders} en attente` : undefined}
          icon="orders"
          accent="indigo"
        />
        <StatCard
          label="Produits"
          value={String(productsCount ?? 0)}
          icon="products"
          accent="amber"
        />
        <StatCard
          label="Sessions"
          value={String(sessionsCount ?? 0)}
          icon="sessions"
          accent="rose"
        />
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/dashboard/produits/nouveau"
            label="Ajouter un produit"
            description="Créez un nouvel article"
            icon="plus"
          />
          <QuickAction
            href="/dashboard/sessions/nouvelle"
            label="Créer une session"
            description="Lancez une vente en direct"
            icon="live"
          />
          <QuickAction
            href="/dashboard/commandes"
            label="Voir les commandes"
            description="Gérez vos commandes"
            icon="orders"
          />
          <QuickAction
            href="/dashboard/parametres"
            label="Paramètres"
            description="Configuration boutique"
            icon="settings"
          />
        </div>
      </div>

      {/* Commandes récentes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Commandes récentes
          </h2>
          {recentOrders && recentOrders.length > 0 && (
            <Link
              href="/dashboard/commandes"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Voir tout
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {!recentOrders || recentOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/commandes/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-slate-700">
                        {order.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {order.client_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.client_phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {Number(order.products_subtotal).toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Composants
   ============================================ */

type StatCardProps = {
  label: string
  value: string
  badge?: string
  icon: 'revenue' | 'orders' | 'products' | 'sessions'
  accent: 'emerald' | 'indigo' | 'amber' | 'rose'
}

function StatCard({ label, value, badge, icon, accent }: StatCardProps) {
  const accentClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClasses[accent]}`}
        >
          <StatIcon name={icon} />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1 truncate">
        {value}
      </p>
    </div>
  )
}

function StatIcon({ name }: { name: StatCardProps['icon'] }) {
  const cls = 'w-5 h-5'
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
  if (name === 'products')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

type QuickActionProps = {
  href: string
  label: string
  description: string
  icon: 'plus' | 'live' | 'orders' | 'settings'
}

function QuickAction({ href, label, description, icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center mb-3 transition-colors">
        <div className="text-slate-600 group-hover:text-white transition-colors">
          <QuickIcon name={icon} />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </Link>
  )
}

function QuickIcon({ name }: { name: QuickActionProps['icon'] }) {
  const cls = 'w-5 h-5'
  if (name === 'plus')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )
  if (name === 'live')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    EN_ATTENTE: {
      label: 'En attente',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    CONFIRMEE: {
      label: 'Confirmée',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    ANNULEE: {
      label: 'Annulée',
      cls: 'bg-red-50 text-red-700 border-red-200',
    },
    LIVREE: {
      label: 'Livrée',
      cls: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  }
  const s = map[status] ?? map.EN_ATTENTE
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wide border px-2 py-1 rounded-full whitespace-nowrap ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

function EmptyOrders() {
  return (
    <div className="p-8 sm:p-12 text-center">
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-900">
        Aucune commande pour le moment
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
        Créez votre première session de vente et partagez le lien à
        votre audience pour recevoir des commandes.
      </p>
      <Link
        href="/dashboard/sessions/nouvelle"
        className="inline-flex items-center gap-2 mt-4 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
      >
        Créer une session
      </Link>
    </div>
  )
}