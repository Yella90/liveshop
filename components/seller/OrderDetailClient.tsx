'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  validateOrder,
  cancelOrder,
  markOrderAsDelivered,
  markOrderAsPaid,
} from '@/lib/actions/orders'

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
  delivery_payer: 'CLIENT' | 'SELLER'
  delivery_visible: 'GRATUITE' | 'PAYANTE'
  products_subtotal: number
  status: string
  payment_status: string
  note: string | null
  created_at: string
  items: OrderItem[]
  session: { id: string; name: string; slug: string } | null
}

const STATUS_MAP: Record<
  string,
  { label: string; cls: string; dot: string }
> = {
  EN_ATTENTE: {
    label: 'En attente',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  CONFIRMEE: {
    label: 'Confirmée',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  ANNULEE: {
    label: 'Annulée',
    cls: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  LIVREE: {
    label: 'Livrée',
    cls: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
}

const DELIVERY_MODE_LABEL: Record<string, string> = {
  DOMICILE: 'À domicile',
  POINT_RETRAIT: 'Point de retrait',
  EXPRESS: 'Express (jour même)',
}

export default function OrderDetailClient({
  order,
  shopSlug,
}: {
  order: Order
  shopSlug: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP.EN_ATTENTE
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)

  const date = new Date(order.created_at)
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // ✅ Détermine si la commande est payée
  const isPaid =
    order.payment_status === 'PAYE_MANUELLEMENT' ||
    order.payment_status === 'PAYE_A_LA_LIVRAISON'

  async function handleValidate() {
    setBusy('validate')
    const toastId = toast.loading('Validation...')
    const result = await validateOrder(order.id)
    if (result?.error) {
      toast.error(result.error, { id: toastId })
      setBusy(null)
      return
    }
    toast.success('Commande validée, stock mis à jour', { id: toastId })
    router.refresh()
    setBusy(null)
  }

  async function handleMarkDelivered() {
    setBusy('deliver')
    const toastId = toast.loading('Mise à jour...')
    const result = await markOrderAsDelivered(order.id)
    if (result?.error) {
      toast.error(result.error, { id: toastId })
      setBusy(null)
      return
    }
    toast.success('Commande livrée et payée ✓', { id: toastId })
    router.refresh()
    setBusy(null)
  }

  async function handleMarkPaid() {
    setBusy('paid')
    const toastId = toast.loading('Mise à jour...')
    const result = await markOrderAsPaid(order.id)
    if (result?.error) {
      toast.error(result.error, { id: toastId })
      setBusy(null)
      return
    }
    toast.success('Commande marquée comme payée', { id: toastId })
    router.refresh()
    setBusy(null)
  }

  async function handleCancel() {
    setBusy('cancel')
    const toastId = toast.loading('Annulation...')
    const result = await cancelOrder(order.id, cancelReason)
    if (result?.error) {
      toast.error(result.error, { id: toastId })
      setBusy(null)
      return
    }
    toast.success('Commande annulée', { id: toastId })
    setConfirmCancel(false)
    setCancelReason('')
    router.refresh()
    setBusy(null)
  }

  const canCancel = order.status !== 'ANNULEE'
  const willRestoreStock =
    order.status === 'CONFIRMEE' || order.status === 'LIVREE'

  // ✅ Bouton "Marquer comme payée" visible si :
  //    - Pas encore payée
  //    - Pas livrée (car livrée = payée automatiquement)
  const canMarkAsPaid =
    !isPaid && order.status !== 'LIVREE' && order.status !== 'ANNULEE'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Fil d'Ariane */}
      <div>
        <Link
          href="/dashboard/commandes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour aux commandes
        </Link>
      </div>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide border px-2.5 py-1 rounded-full ${statusInfo.cls}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} ${
                  order.status === 'EN_ATTENTE' ? 'animate-pulse' : ''
                }`}
              />
              {statusInfo.label}
            </span>

            {/* Badge payé */}
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
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
                {order.payment_status === 'PAYE_MANUELLEMENT' &&
                  ' (manuel)'}
                {order.payment_status === 'PAYE_A_LA_LIVRAISON' &&
                  ' (à la livraison)'}
              </span>
            )}

            {/* Badge non payé */}
            {!isPaid && order.status !== 'ANNULEE' && (
              <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
                Non payé
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Commande
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            #{order.id.slice(0, 8).toUpperCase()} · {dateStr} à {timeStr}
          </p>
        </div>
      </div>

      {/* Client */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Client
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-white">
              {order.client_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900">
              {order.client_name}
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
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
                <a
                  href={`tel:${order.client_phone}`}
                  className="font-medium text-slate-900 hover:text-indigo-600"
                >
                  {order.client_phone}
                </a>
              </div>
              {order.client_quarter && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {order.client_quarter}
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                {DELIVERY_MODE_LABEL[order.delivery_mode] ??
                  order.delivery_mode}
              </div>
            </div>
          </div>
        </div>

        {order.note && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-900 mb-1">
              Note du client
            </p>
            <p className="text-sm text-amber-800">{order.note}</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${order.client_phone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
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
            Appeler
          </a>
          {order.session && (
            <Link
              href={`/${shopSlug}/session/${order.session.slug}`}
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Voir session
            </Link>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Articles ({itemCount})
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.product_name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.variant_name}
                  {item.quantity > 1 && ` · ${item.quantity} × `}
                  {Number(item.unit_price).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900 shrink-0">
                {Number(item.total).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Récapitulatif */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Récapitulatif
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Sous-total</span>
            <span className="font-semibold text-slate-900">
              {Number(order.products_subtotal).toLocaleString('fr-FR')}{' '}
              FCFA
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Livraison</span>
            {order.delivery_visible === 'GRATUITE' ? (
              <span className="font-semibold text-emerald-600">
                Gratuite (à votre charge)
              </span>
            ) : (
              <span className="font-semibold text-amber-600">
                Payante (à la charge du client)
              </span>
            )}
          </div>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">
              Total
            </span>
            <p className="text-xl font-bold text-slate-900">
              {Number(order.products_subtotal).toLocaleString('fr-FR')}{' '}
              FCFA
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        {/* EN_ATTENTE : bouton Valider */}
        {order.status === 'EN_ATTENTE' && (
          <button
            onClick={handleValidate}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-4 rounded-2xl hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {busy === 'validate' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validation...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Valider la commande (décrémenter le stock)
              </>
            )}
          </button>
        )}

        {/* CONFIRMEE : bouton Livrer */}
        {order.status === 'CONFIRMEE' && (
          <button
            onClick={handleMarkDelivered}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {busy === 'deliver' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Marquer comme livrée (et payée)
              </>
            )}
          </button>
        )}

        {/* ✅ Bouton "Marquer comme payée" - disponible AVANT la livraison */}
        {canMarkAsPaid && (
          <button
            onClick={handleMarkPaid}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-700 font-semibold py-3.5 rounded-2xl hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {busy === 'paid' ? (
              <>
                <div className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Marquer comme payée (avant livraison)
              </>
            )}
          </button>
        )}

        {/* Bouton Annuler - disponible pour tous les statuts sauf ANNULEE */}
        {canCancel && (
          <button
            onClick={() => setConfirmCancel(true)}
            disabled={busy !== null}
            className="w-full text-sm font-medium text-red-600 hover:text-red-700 py-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {order.status === 'LIVREE'
              ? 'Annuler la commande (restaurer le stock)'
              : order.status === 'CONFIRMEE'
              ? 'Annuler (restaurer le stock)'
              : 'Annuler la commande'}
          </button>
        )}

        {/* ANNULEE */}
        {order.status === 'ANNULEE' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-red-700">
              Cette commande est <strong>annulée</strong>. Aucune
              action disponible.
            </p>
          </div>
        )}
      </section>

      {/* Modal annulation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Annuler cette commande ?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              {willRestoreStock
                ? `La commande est ${statusInfo.label.toLowerCase()}. Le stock des variantes concernées sera restauré.`
                : 'La commande sera marquée comme annulée. Aucun stock n\'a été décrémenté.'}
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Raison (optionnel)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex : Client injoignable"
                maxLength={100}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setConfirmCancel(false)
                  setCancelReason('')
                }}
                disabled={busy !== null}
                className="flex-1 text-sm font-medium text-slate-700 py-2.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Retour
              </button>
              <button
                onClick={handleCancel}
                disabled={busy !== null}
                className="flex-1 text-sm font-medium text-white bg-red-600 py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {busy === 'cancel' ? 'Annulation...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}