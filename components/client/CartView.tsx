'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { createOrder } from '@/lib/actions/orders'

type Shop = {
  id: string
  name: string
  slug: string
  delivery_payer_default: 'CLIENT' | 'SELLER'
  free_delivery_threshold: number | null
}

export default function CartView({
  shop,
  sessionId,
  sessionSlug,
}: {
  shop: Shop
  sessionId: string | null
  sessionSlug: string | null
}) {
  const router = useRouter()
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart(shop.slug)

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientQuarter, setClientQuarter] = useState('')
  const [deliveryMode, setDeliveryMode] = useState<
    'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS'
  >('DOMICILE')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Déterminer si la livraison est offerte
  const isFreeDelivery =
    shop.delivery_payer_default === 'SELLER' ||
    (shop.free_delivery_threshold !== null &&
      totalPrice >= Number(shop.free_delivery_threshold))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    setError(null)

    const result = await createOrder({
      shopSlug: shop.slug,
      sessionId,
      clientName,
      clientPhone,
      clientQuarter,
      deliveryMode,
      note,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result?.success && result.orderId) {
      clearCart()
      const url = sessionSlug
        ? `/${shop.slug}/commande/confirmation?order=${result.orderId}&session=${sessionSlug}`
        : `/${shop.slug}/commande/confirmation?order=${result.orderId}`
      router.push(url)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    )
  }

  const backUrl = sessionSlug
    ? `/${shop.slug}/session/${sessionSlug}`
    : `/${shop.slug}/boutique`

  /* ============================================
     Panier vide
     ============================================ */
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href={backUrl}
              className="flex items-center gap-2 text-slate-900 hover:text-slate-700"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Continuer mes achats</span>
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">
              Votre panier est vide
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Ajoutez des articles depuis la boutique pour passer
              commande.
            </p>
            <Link
              href={`/${shop.slug}/boutique`}
              className="inline-flex items-center gap-2 mt-6 bg-slate-900 text-white font-semibold px-5 py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              Voir les produits
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
      </div>
    )
  }

  /* ============================================
     Panier avec articles
     ============================================ */
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href={backUrl}
            className="flex items-center gap-2 text-slate-900 hover:text-slate-700"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Continuer</span>
          </Link>

          <h1 className="text-sm font-semibold text-slate-900">
            Panier ({totalItems})
          </h1>

          <div className="w-16" />
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {/* Liste des articles */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Articles
            </h2>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    'Vider tout le panier ? Cette action est irréversible.'
                  )
                ) {
                  clearCart()
                }
              }}
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              Vider le panier
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="p-4 flex items-center gap-3 sm:gap-4"
              >
                {/* Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.variantName}
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {Number(item.unitPrice).toLocaleString('fr-FR')}{' '}
                    <span className="text-xs font-medium text-slate-500">
                      FCFA
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Quantité */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.maxStock}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-[10px] text-slate-400 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire client */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Vos informations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex : Awa Diop"
                maxLength={80}
                className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                maxLength={20}
                className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
              <p className="mt-1 text-xs text-slate-500">
                Le vendeur vous appellera pour confirmer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Quartier / Zone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientQuarter}
                onChange={(e) => setClientQuarter(e.target.value)}
                placeholder="Ex : Médina, Dakar"
                maxLength={80}
                className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Mode de récupération */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Mode de récupération <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <DeliveryOption
                value="DOMICILE"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="À domicile"
                description="Livré chez vous"
              />
              <DeliveryOption
                value="POINT_RETRAIT"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="Point de retrait"
                description="Vous récupérez"
              />
              <DeliveryOption
                value="EXPRESS"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="Express"
                description="Le jour même"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Note pour le vendeur
              <span className="text-slate-400 font-normal ml-1">
                (optionnel)
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : Je préfère être appelée après 18h"
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
            />
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
                {totalPrice.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Livraison</span>
              {isFreeDelivery ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Gratuite
                </span>
              ) : (
                <span className="font-semibold text-amber-600">
                  Payante
                </span>
              )}
            </div>

            {!isFreeDelivery && (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                💡 Les frais de livraison vous seront communiqués par
                le vendeur après confirmation de votre commande.
              </p>
            )}

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Total
              </span>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </p>
                {!isFreeDelivery && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    + frais de livraison
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer ma commande
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
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center -mt-2">
          En envoyant votre commande, vous acceptez d&apos;être
          contacté par le vendeur.
        </p>
      </form>
    </div>
  )
}

/* ============================================
   DeliveryOption
   ============================================ */
function DeliveryOption({
  value,
  current,
  onChange,
  label,
  description,
}: {
  value: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS'
  current: string
  onChange: (v: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS') => void
  label: string
  description: string
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`text-left p-3 rounded-xl border-2 transition-all ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p
        className={`text-xs mt-0.5 ${
          active ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        {description}
      </p>
    </button>
  )
}