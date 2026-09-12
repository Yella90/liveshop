import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrderListItem from '@/components/seller/OrderListItem'

const STATUS_FILTERS = [
  { key: 'all', label: 'Toutes', status: null },
  { key: 'EN_ATTENTE', label: 'En attente', status: 'EN_ATTENTE' },
  { key: 'CONFIRMEE', label: 'Confirmées', status: 'CONFIRMEE' },
  { key: 'LIVREE', label: 'Livrées', status: 'LIVREE' },
  { key: 'ANNULEE', label: 'Annulées', status: 'ANNULEE' },
]

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>
}) {
  const { statut } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  // Construire la requête
  let query = supabase
    .from('orders')
    .select(
      `
      id, client_name, client_phone, client_quarter,
      delivery_mode, delivery_visible, products_subtotal,
      status, payment_status, created_at, session_id,
      order_items(id, product_name, variant_name, quantity, unit_price, total),
      publication_sessions(name, slug)
      `
    )
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  if (statut && statut !== 'all') {
    query = query.eq('status', statut)
  }

  const { data: orders } = await query

  // Compter par statut
  const { data: counts } = await supabase
    .from('orders')
    .select('status')
    .eq('shop_id', shop.id)

  const countByStatus = {
    all: counts?.length ?? 0,
    EN_ATTENTE:
      counts?.filter((o) => o.status === 'EN_ATTENTE').length ?? 0,
    CONFIRMEE:
      counts?.filter((o) => o.status === 'CONFIRMEE').length ?? 0,
    LIVREE: counts?.filter((o) => o.status === 'LIVREE').length ?? 0,
    ANNULEE: counts?.filter((o) => o.status === 'ANNULEE').length ?? 0,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Commandes
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Gérez les commandes reçues lors de vos sessions.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {STATUS_FILTERS.map((f) => {
          const active = (statut ?? 'all') === f.key
          const count =
            countByStatus[f.key as keyof typeof countByStatus] ?? 0
          return (
            <Link
              key={f.key}
              href={
                f.key === 'all'
                  ? '/dashboard/commandes'
                  : `/dashboard/commandes?statut=${f.key}`
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Liste */}
      {!orders || orders.length === 0 ? (
        <EmptyOrders filterKey={statut} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {orders.map((order: any) => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyOrders({ filterKey }: { filterKey?: string }) {
  const isFiltered = filterKey && filterKey !== 'all'
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        {isFiltered
          ? 'Aucune commande dans ce filtre'
          : 'Aucune commande pour le moment'}
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        {isFiltered
          ? 'Essayez un autre filtre ou consultez toutes les commandes.'
          : 'Créez une session et partagez le lien à votre audience pour recevoir vos premières commandes.'}
      </p>
      {!isFiltered && (
        <Link
          href="/dashboard/sessions/nouvelle"
          className="inline-flex items-center gap-2 mt-5 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
        >
          Créer une session
        </Link>
      )}
    </div>
  )
}