'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  useMyOrders,
  type StoredOrder,
} from '@/lib/hooks/useMyOrders'
import { fetchMyOrders } from '@/lib/actions/my-orders'

/* ============================================
   TYPES
   ============================================ */
type LiveOrder = {
  id: string
  status: string
  payment_status: string
  delivery_visible: string
  products_subtotal: number
  delivery_mode: string
  created_at: string
  shops: { name: string; slug: string; phone: string | null } | null
  order_items: {
    id: string
    product_name: string
    variant_name: string | null
    quantity: number
    unit_price: number
    total: number
  }[]
  publication_sessions: { name: string; slug: string } | null
}

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; step: number }
> = {
  EN_ATTENTE: {
    label: 'En attente de confirmation',
    color: 'amber',
    step: 1,
  },
  CONFIRMEE: {
    label: 'Confirmée',
    color: 'emerald',
    step: 2,
  },
  LIVREE: {
    label: 'Livrée',
    color: 'slate',
    step: 3,
  },
  ANNULEE: {
    label: 'Annulée',
    color: 'red',
    step: 0,
  },
}

/* ============================================
   WRAPPER SUSPENSE (obligatoire pour useSearchParams)
   ============================================ */
export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MesCommandesContent />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">
          Chargement...
        </p>
      </div>
    </div>
  )
}

/* ============================================
   CONTENU PRINCIPAL
   ============================================ */
function MesCommandesContent() {
  const searchParams = useSearchParams()
  const fromSlug = searchParams.get('from')

  const { orders: storedOrders, removeOrder, clearAll } = useMyOrders()
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || storedOrders.length === 0) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      const ids = storedOrders.map((o) => o.id)
      const result = await fetchMyOrders(ids)
      setLiveOrders((result.orders ?? []) as LiveOrder[])
      setLoading(false)
    }

    load()
  }, [mounted, storedOrders])

  if (!mounted) {
    return <LoadingFallback />
  }

  /* ============================================
     DÉTERMINER L'URL DE RETOUR
     Priorité : boutique de la 1ère commande live > shopSlug stocké > ?from
     ✅ Jamais vers "/" (accueil LiveShop)
     ============================================ */
  const firstShop = liveOrders.find((o) => o.shops)?.shops
  const fallbackSlug =
    firstShop?.slug || storedOrders[0]?.shopSlug || fromSlug

  const backUrl = fallbackSlug ? `/${fallbackSlug}/boutique` : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              Mes commandes
            </span>
          </div>

          {/* ✅ Retour uniquement vers la boutique d'origine */}
          {backUrl ? (
            <Link
              href={backUrl}
              className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour
            </Link>
          ) : (
            <span className="text-xs text-slate-400">
              Suivi de commandes
            </span>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
        {/* ============================================
            EN-TÊTE
            ============================================ */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Suivi de mes commandes
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {storedOrders.length} commande
              {storedOrders.length > 1 ? 's' : ''} sur cet appareil
            </p>
          </div>
          {storedOrders.length > 0 && (
            <button
              onClick={() => {
                if (
                  confirm(
                    'Effacer toutes vos commandes de cet appareil ? Cette action ne supprime pas vos commandes réelles.'
                  )
                ) {
                  clearAll()
                  toast.success('Historique effacé')
                }
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors shrink-0"
            >
              Effacer tout
            </button>
          )}
        </div>

        {/* ============================================
            ÉTAT VIDE
            ============================================ */}
        {storedOrders.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-12 text-center">
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
            <h2 className="text-lg font-bold text-slate-900">
              Aucune commande
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Vos commandes apparaîtront ici automatiquement après chaque
              achat.
            </p>

            {/* ✅ Retour uniquement vers la boutique d'origine */}
            {backUrl && (
              <Link
                href={backUrl}
                className="group inline-flex items-center gap-2 mt-6 bg-slate-900 text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Retour à la boutique
              </Link>
            )}
          </div>
        )}

        {/* ============================================
            LISTE DES COMMANDES
            ============================================ */}
        {storedOrders.length > 0 && (
          <div className="space-y-4">
            {storedOrders.map((stored) => {
              const live = liveOrders.find((o) => o.id === stored.id)
              const status = live?.status ?? 'EN_ATTENTE'
              const statusInfo =
                STATUS_LABELS[status] ?? STATUS_LABELS.EN_ATTENTE

              return (
                <OrderCard
                  key={stored.id}
                  stored={stored}
                  live={live}
                  statusInfo={statusInfo}
                  loading={loading}
                  onRemove={() => {
                    removeOrder(stored.id)
                    toast.success('Commande retirée')
                  }}
                />
              )
            })}
          </div>
        )}

        {/* ============================================
            NOTE
            ============================================ */}
        {storedOrders.length > 0 && (
          <div className="bg-slate-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              💡 Cet historique est stocké uniquement sur cet appareil.
              Si vous changez de téléphone ou effacez vos données, il
              disparaîtra.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================
   CARTE COMMANDE
   ============================================ */
function OrderCard({
  stored,
  live,
  statusInfo,
  loading,
  onRemove,
}: {
  stored: StoredOrder
  live: LiveOrder | undefined
  statusInfo: { label: string; color: string; step: number }
  loading: boolean
  onRemove: () => void
}) {
  const colorClasses: Record<string, { badge: string; dot: string }> = {
    amber: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    slate: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    },
    red: {
      badge: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    },
  }

  const cls = colorClasses[statusInfo.color] ?? colorClasses.amber
  const date = new Date(stored.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const total = live?.products_subtotal ?? stored.total

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-mono">
            #{stored.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">
            {live?.shops?.name ?? stored.shopName}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 -mr-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          title="Retirer de cet appareil"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ============================================
          STATUT
          ============================================ */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
        ) : (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide border px-2.5 py-1 rounded-full ${cls.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
              {statusInfo.label}
            </span>

            {live && live.payment_status !== 'NON_PAYE' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
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
                Payé
              </span>
            )}
          </div>
        )}

        {/* Progression */}
        {!loading && statusInfo.step > 0 && (
          <>
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    statusInfo.step >= step
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              <span
                className={statusInfo.step >= 1 ? 'text-indigo-600' : ''}
              >
                Commandée
              </span>
              <span
                className={statusInfo.step >= 2 ? 'text-indigo-600' : ''}
              >
                Confirmée
              </span>
              <span
                className={statusInfo.step >= 3 ? 'text-indigo-600' : ''}
              >
                Livrée
              </span>
            </div>
          </>
        )}
      </div>

      {/* ============================================
          ARTICLES
          ============================================ */}
      {live && live.order_items && live.order_items.length > 0 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
            {live.order_items.length} article
            {live.order_items.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-1.5">
            {live.order_items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs gap-2"
              >
                <span className="text-slate-700 truncate">
                  {item.quantity}× {item.product_name}
                  {item.variant_name && ` (${item.variant_name})`}
                </span>
                <span className="text-slate-900 font-semibold shrink-0">
                  {Number(item.total).toLocaleString('fr-FR')} F
                </span>
              </div>
            ))}
            {live.order_items.length > 3 && (
              <p className="text-xs text-slate-500 pt-1">
                +{live.order_items.length - 3} autre
                {live.order_items.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============================================
          FOOTER
          ============================================ */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm font-black text-slate-900">
          {Number(total).toLocaleString('fr-FR')}{' '}
          <span className="text-xs font-medium text-slate-500">FCFA</span>
        </p>

        {/* ✅ Liens uniquement vers la boutique du vendeur */}
        <div className="flex items-center gap-2">
          {live?.shops?.phone && (
            <a
              href={`tel:${live.shops.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
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
              Appeler
            </a>
          )}
          {live?.shops?.slug && (
            <Link
              href={`/${live.shops.slug}/boutique`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Voir la boutique
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}