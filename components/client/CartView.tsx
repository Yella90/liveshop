'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/lib/hooks/useCart'
import { createOrder } from '@/lib/actions/orders'
import { useMyOrders } from '@/lib/hooks/useMyOrders'

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

  // ✅ Hook appelé en haut du composant (règle des Hooks)
  const { saveOrder } = useMyOrders()

  const {
    items,
    sessionSlug: cartSessionSlug,
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
  const [focused, setFocused] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

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

    if (clientName.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères')
      return
    }
    if (clientPhone.trim().length < 6) {
      toast.error('Le numéro de téléphone est invalide')
      return
    }
    if (clientQuarter.trim().length < 2) {
      toast.error('Le quartier est requis')
      return
    }

    setLoading(true)
    setError(null)

    const effectiveSessionSlug = cartSessionSlug ?? sessionSlug
    let finalSessionId = sessionId

    if (!finalSessionId && effectiveSessionSlug) {
      try {
        const res = await fetch(
          `/api/sessions/resolve?slug=${shop.slug}&session=${effectiveSessionSlug}`
        )
        if (res.ok) {
          const json = await res.json()
          finalSessionId = json.sessionId ?? null
        }
      } catch {}
    }

    const toastId = toast.loading('Envoi de la commande...')

    const result = await createOrder({
      shopSlug: shop.slug,
      sessionId: finalSessionId,
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
      toast.error(result.error, { id: toastId })
      setError(result.error)
      setLoading(false)
      return
    }

    if (result?.success && result.orderId) {
      // ✅ Save order APRÈS avoir le résultat
      saveOrder({
        id: result.orderId,
        shopSlug: shop.slug,
        shopName: shop.name,
        total: totalPrice,
        createdAt: new Date().toISOString(),
      })

      toast.success('Commande envoyée !', { id: toastId })
      clearCart()

      const url = sessionSlug
        ? `/${shop.slug}/commande/confirmation?order=${result.orderId}&session=${sessionSlug}`
        : `/${shop.slug}/commande/confirmation?order=${result.orderId}`
      router.push(url)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Chargement du panier...
          </p>
        </div>
      </div>
    )
  }

  const backUrl = sessionSlug
    ? `/${shop.slug}/session/${sessionSlug}`
    : `/${shop.slug}/boutique`

  /* ============================================
     PANIER VIDE
     ============================================ */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="sticky top-0 z-40 glass border-b border-white/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href={backUrl}
              className="group flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
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
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Continuer mes achats
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-sm font-bold text-slate-900">Panier</h1>
            </div>

            <div className="w-10" />
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="relative bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center overflow-hidden animate-fade-in-up">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 animate-bounce-subtle">
                <svg
                  className="w-10 h-10 text-white"
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

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Votre panier est vide
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
                Parcourez les produits de {shop.name} et ajoutez vos
                coups de cœur pour passer commande.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Link
                  href={`/${shop.slug}/boutique`}
                  className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-4 rounded-2xl hover:bg-slate-800 hover:shadow-xl active:scale-95 transition-all btn-shine"
                >
                  Voir les produits
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                {sessionSlug && (
                  <Link
                    href={`/${shop.slug}/session/${sessionSlug}`}
                    className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Retour au live
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ============================================
     PANIER AVEC ARTICLES
     ============================================ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href={backUrl}
            className="group flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
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
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Continuer
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900">Panier</h1>
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-32"
      >
        {/* ARTICLES */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-600"
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
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Articles
                </h2>
                <p className="text-[10px] text-slate-500">
                  {totalItems} article{totalItems > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Vider
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <div
                key={item.variantId}
                className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-slate-50/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative group">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
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

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {item.variantName}
                  </p>
                  <p className="text-sm sm:text-base font-black text-indigo-600 mt-1.5">
                    {Number(item.unitPrice).toLocaleString('fr-FR')}
                    <span className="text-[10px] font-medium text-slate-500 ml-1">
                      FCFA
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
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
                    <span className="w-7 text-center text-sm font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.maxStock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
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

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULAIRE CLIENT */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Vos informations
              </h2>
              <p className="text-[10px] text-slate-500">
                Le vendeur vous appellera pour confirmer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="sm:col-span-2">
              <label
                htmlFor="clientName"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
              >
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focused === 'name'
                    ? 'ring-2 ring-indigo-500 ring-offset-2'
                    : ''
                }`}
              >
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    focused === 'name' ? 'text-indigo-500' : 'text-slate-400'
                  }`}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="clientName"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="Ex : Awa Diop"
                  maxLength={80}
                  className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label
                htmlFor="clientPhone"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
              >
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focused === 'phone'
                    ? 'ring-2 ring-indigo-500 ring-offset-2'
                    : ''
                }`}
              >
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    focused === 'phone' ? 'text-indigo-500' : 'text-slate-400'
                  }`}
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  id="clientPhone"
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="+221 77 000 00 00"
                  maxLength={20}
                  className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Quartier */}
            <div>
              <label
                htmlFor="clientQuarter"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
              >
                Quartier / Zone <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focused === 'quarter'
                    ? 'ring-2 ring-indigo-500 ring-offset-2'
                    : ''
                }`}
              >
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    focused === 'quarter'
                      ? 'text-indigo-500'
                      : 'text-slate-400'
                  }`}
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  id="clientQuarter"
                  type="text"
                  required
                  value={clientQuarter}
                  onChange={(e) => setClientQuarter(e.target.value)}
                  onFocus={() => setFocused('quarter')}
                  onBlur={() => setFocused(null)}
                  placeholder="Ex : Médina, Dakar"
                  maxLength={80}
                  className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Mode de récupération */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
              Mode de récupération <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <DeliveryOption
                value="DOMICILE"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="À domicile"
                description="Livré chez vous"
                icon="home"
              />
              <DeliveryOption
                value="POINT_RETRAIT"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="Point de retrait"
                description="Vous récupérez"
                icon="pickup"
              />
              <DeliveryOption
                value="EXPRESS"
                current={deliveryMode}
                onChange={setDeliveryMode}
                label="Express"
                description="Le jour même"
                icon="express"
              />
            </div>
          </div>

          {/* Note */}
          <div className="mt-5">
            <label
              htmlFor="note"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Note pour le vendeur{' '}
              <span className="text-slate-400 normal-case font-normal">
                (optionnel)
              </span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : Je préfère être appelée après 18h"
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
            />
          </div>
        </section>

        {/* RÉCAPITULATIF */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-slate-900/20 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-5 flex items-center gap-2">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Récapitulatif
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Sous-total</span>
                <span className="font-bold">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Livraison</span>
                {isFreeDelivery ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <svg
                      className="w-3.5 h-3.5"
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
                    Gratuite
                  </span>
                ) : (
                  <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    Payante
                  </span>
                )}
              </div>

              {!isFreeDelivery && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Les frais de livraison vous seront communiqués par
                    le vendeur après confirmation de votre commande.
                  </p>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <span className="text-sm font-bold">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">
                    {totalPrice.toLocaleString('fr-FR')} FCFA
                  </p>
                  {!isFreeDelivery && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      + frais de livraison
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERREUR */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
            <p className="text-sm text-red-700 flex items-start gap-2 font-medium">
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        )}

        {/* BOUTON SOUMETTRE */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden btn-shine"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer ma commande
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          contacté par le vendeur pour confirmation.
        </p>
      </form>

      {/* MODAL VIDER PANIER */}
      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setConfirmClear(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Vider le panier ?
            </h3>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Tous les articles seront retirés. Cette action est
              irréversible.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="flex-1 text-sm font-semibold text-slate-700 py-3 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart()
                  setConfirmClear(false)
                  toast.success('Panier vidé')
                }}
                className="flex-1 text-sm font-semibold text-white bg-red-600 py-3 rounded-2xl hover:bg-red-700 transition-colors"
              >
                Vider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================
   DELIVERY OPTION
   ============================================ */
function DeliveryOption({
  value,
  current,
  onChange,
  label,
  description,
  icon,
}: {
  value: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS'
  current: string
  onChange: (v: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS') => void
  label: string
  description: string
  icon: 'home' | 'pickup' | 'express'
}) {
  const active = current === value

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`group relative text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
        active
          ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg shadow-indigo-500/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {active && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center animate-fade-in">
          <svg
            className="w-3 h-3 text-white"
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
      )}

      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            active
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <DeliveryIcon name={icon} />
        </div>
      </div>

      <p
        className={`text-sm font-bold transition-colors ${
          active ? 'text-indigo-700' : 'text-slate-900'
        }`}
      >
        {label}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </button>
  )
}

function DeliveryIcon({ name }: { name: 'home' | 'pickup' | 'express' }) {
  const cls = 'w-4 h-4'
  if (name === 'home')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  if (name === 'pickup')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}