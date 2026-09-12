import Link from 'next/link'

type OrderItem = {
  id: string
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total: number
}

type Order = {
  id: string
  client_name: string
  client_phone: string
  client_quarter: string | null
  delivery_mode: string
  delivery_visible: 'GRATUITE' | 'PAYANTE'
  products_subtotal: number
  status: string
  payment_status: string
  created_at: string
  session_id: string | null
  order_items: OrderItem[]
  publication_sessions: { name: string; slug: string } | null
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
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

export default function OrderListItem({ order }: { order: Order }) {
  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP.EN_ATTENTE
  const itemCount = order.order_items.reduce((s, i) => s + i.quantity, 0)
  const firstItems = order.order_items.slice(0, 2)
  const moreCount = order.order_items.length - firstItems.length

  const date = new Date(order.created_at)
  const timeAgo = getTimeAgo(date)

  return (
    <Link
      href={`/dashboard/commandes/${order.id}`}
      className="block p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
          <span className="text-sm sm:text-base font-semibold text-white">
            {order.client_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900 truncate">
                  {order.client_name}
                </p>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide border px-2 py-0.5 rounded-full ${statusInfo.cls}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {order.client_phone}
                {order.client_quarter && (
                  <>
                    <span className="mx-1.5">·</span>
                    {order.client_quarter}
                  </>
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">
                {Number(order.products_subtotal).toLocaleString('fr-FR')}
                <span className="text-xs font-medium text-slate-500 ml-1">
                  FCFA
                </span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {timeAgo}
              </p>
            </div>
          </div>

          {/* Résumé articles */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-600">
              {itemCount} article{itemCount > 1 ? 's' : ''}
            </span>
            {firstItems.map((item, i) => (
              <span key={item.id} className="text-xs text-slate-500">
                {i > 0 && '·'}{' '}
                <span className="truncate max-w-[120px] inline-block align-bottom">
                  {item.product_name}
                </span>
                {item.quantity > 1 && (
                  <span className="text-slate-400 ml-0.5">
                    ×{item.quantity}
                  </span>
                )}
              </span>
            ))}
            {moreCount > 0 && (
              <span className="text-xs text-slate-400">
                +{moreCount}
              </span>
            )}
          </div>

          {/* Badges secondaires */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {order.delivery_visible === 'GRATUITE' && (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                🚚 Livraison offerte
              </span>
            )}
            {order.payment_status === 'PAYE_MANUELLEMENT' && (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                ✓ Payé
              </span>
            )}
            {order.publication_sessions && (
              <span className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[180px]">
                📡 {order.publication_sessions.name}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <svg
          className="w-5 h-5 text-slate-400 shrink-0 mt-1"
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
    </Link>
  )
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'À l\'instant'
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Il y a ${days}j`
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}