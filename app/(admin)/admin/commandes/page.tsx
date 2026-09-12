import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const STATUS_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'EN_ATTENTE', label: 'En attente' },
  { key: 'CONFIRMEE', label: 'Confirmées' },
  { key: 'LIVREE', label: 'Livrées' },
  { key: 'ANNULEE', label: 'Annulées' },
]

export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>
}) {
  const { statut } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(
      `
      id, client_name, client_phone, client_quarter,
      delivery_mode, delivery_visible, products_subtotal,
      status, payment_status, created_at,
      shops(name, slug),
      order_items(id, product_name, quantity)
      `
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (statut && statut !== 'all') {
    query = query.eq('status', statut)
  }

  const { data: orders } = await query

  const { data: counts } = await supabase
    .from('orders')
    .select('status')

  const countByStatus = {
    all: counts?.length ?? 0,
    EN_ATTENTE: counts?.filter((o) => o.status === 'EN_ATTENTE').length ?? 0,
    CONFIRMEE: counts?.filter((o) => o.status === 'CONFIRMEE').length ?? 0,
    LIVREE: counts?.filter((o) => o.status === 'LIVREE').length ?? 0,
    ANNULEE: counts?.filter((o) => o.status === 'ANNULEE').length ?? 0,
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Commandes globales
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Toutes les commandes de la plateforme
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {STATUS_FILTERS.map((f) => {
          const active = (statut ?? 'all') === f.key
          const count = countByStatus[f.key as keyof typeof countByStatus]
          return (
            <Link
              key={f.key}
              href={
                f.key === 'all'
                  ? '/admin/commandes'
                  : `/admin/commandes?statut=${f.key}`
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-800 text-slate-400'
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
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-white">
            Aucune commande
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Aucune commande pour ce filtre.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {orders.map((order: any) => {
              const itemCount = order.order_items?.reduce(
                (s: number, i: any) => s + i.quantity,
                0
              ) ?? 0
              return (
                <div
                  key={order.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  {/* Avatar + client */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">
                        {order.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {order.client_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.shops?.name ?? '—'} · {order.client_phone}
                      </p>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        Articles
                      </p>
                      <p className="text-sm font-bold text-white">
                        {itemCount}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        Total
                      </p>
                      <p className="text-sm font-bold text-white">
                        {Number(order.products_subtotal).toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </p>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
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
    <span
      className={`text-[10px] font-bold uppercase tracking-wide border px-2.5 py-1 rounded-full whitespace-nowrap ${s.cls}`}
    >
      {s.label}
    </span>
  )
}