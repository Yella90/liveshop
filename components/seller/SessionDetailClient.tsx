'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import {
  addProductsToSession,
  removeProductFromSession,
  toggleSessionActive,
  toggleSessionProduct,
} from '@/lib/actions/sessions'

type Session = {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  free_delivery_enabled: boolean
  created_at: string
}

type ProductInSession = {
  productId: string
  name: string
  base_price: number
  image: string | null
  active: boolean
  totalStock: number
  visible: boolean
}

type AvailableProduct = {
  id: string
  name: string
  base_price: number
  image: string | null
  totalStock: number
}

export default function SessionDetailClient({
  session,
  shop,
  initialProducts,
  availableProducts,
  orderCount,
}: {
  session: Session
  shop: { slug: string; name: string }
  initialProducts: ProductInSession[]
  availableProducts: AvailableProduct[]
  orderCount: number
}) {
  const router = useRouter()
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([])
  const [active, setActive] = useState(session.is_active)
  const [products, setProducts] = useState(initialProducts)

  const publicUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/${shop.slug}/session/${session.slug}`
  }, [shop.slug, session.slug])

  useEffect(() => {
    if (!publicUrl) return
    QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''))
  }, [publicUrl])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  async function handleDownloadQR() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `session-${session.slug}-qr.png`
    link.click()
  }

  async function handleToggleActive() {
    setBusy(true)
    const next = !active
    await toggleSessionActive(session.id, next)
    setActive(next)
    setBusy(false)
  }

  async function handleToggleVisible(
    productId: string,
    visible: boolean
  ) {
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, visible } : p
      )
    )
    await toggleSessionProduct(session.id, productId, visible)
  }

  async function handleRemove(productId: string) {
    if (!confirm('Retirer ce produit de la session ?')) return
    setBusy(true)
    const result = await removeProductFromSession(session.id, productId)
    if (result?.error) {
      alert(result.error)
      setBusy(false)
      return
    }
    setProducts((prev) => prev.filter((p) => p.productId !== productId))
    setBusy(false)
    router.refresh()
  }

  async function handleAddProducts() {
    if (selectedToAdd.length === 0) return
    setBusy(true)
    const result = await addProductsToSession(session.id, selectedToAdd)
    if (result?.error) {
      alert(result.error)
      setBusy(false)
      return
    }
    setSelectedToAdd([])
    setShowAddProducts(false)
    setBusy(false)
    router.refresh()
  }

  const visibleCount = products.filter((p) => p.visible).length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Fil d'Ariane */}
      <div>
        <Link
          href="/dashboard/sessions"
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
          Retour aux sessions
        </Link>
      </div>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {active ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide bg-red-500 text-white px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                En direct
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                Inactive
              </span>
            )}
            {session.free_delivery_enabled && (
              <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                🚚 Livraison offerte
              </span>
            )}
            <span className="text-xs text-slate-500">
              {orderCount} commande{orderCount > 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
            {session.name}
          </h1>
          {session.description && (
            <p className="text-slate-500 mt-2 text-sm">
              {session.description}
            </p>
          )}
        </div>

        <button
          onClick={handleToggleActive}
          disabled={busy}
          className={`shrink-0 inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 ${
            active
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {active ? 'Désactiver' : 'Activer'}
        </button>
      </div>

      {/* Lien + QR code */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Lien */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
            Lien de la session
          </h2>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2.5 text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg truncate"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2.5 rounded-lg transition-all ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? (
                <>
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
                  Copié
                </>
              ) : (
                <>
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copier
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            💡 Partagez ce lien en bio TikTok, en commentaire épinglé
            ou envoyez-le par WhatsApp.
          </p>
        </div>

        {/* QR code */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3 self-start">
            QR Code
          </h2>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="QR code de la session"
                className="w-40 h-40"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-slate-50 rounded">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="mt-3 w-full text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            Télécharger le QR code
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Affichez-le pendant votre live
          </p>
        </div>
      </div>

      {/* Produits de la session */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Produits de la session
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {visibleCount} visible{visibleCount > 1 ? 's' : ''} sur{' '}
              {products.length}
            </p>
          </div>
          {availableProducts.length > 0 && (
            <button
              onClick={() => setShowAddProducts(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
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
              Ajouter
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">
              Aucun produit dans cette session.
            </p>
            {availableProducts.length > 0 && (
              <button
                onClick={() => setShowAddProducts(true)}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Ajouter des produits
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((product) => (
              <div
                key={product.productId}
                className="p-4 flex items-center gap-3"
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-slate-300"
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
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500">
                      {Number(product.base_price).toLocaleString('fr-FR')}{' '}
                      FCFA
                    </p>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <p className="text-xs text-slate-500">
                      {product.totalStock} en stock
                    </p>
                    {!product.active && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs text-amber-600 font-medium">
                          Inactif
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={product.visible}
                      onChange={(e) =>
                        handleToggleVisible(
                          product.productId,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-600 hidden sm:inline">
                      Visible
                    </span>
                  </label>
                  <button
                    onClick={() => handleRemove(product.productId)}
                    disabled={busy}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Retirer de la session"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal ajout de produits */}
      {showAddProducts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowAddProducts(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Ajouter des produits
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {availableProducts.length} produit
                {availableProducts.length > 1 ? 's' : ''} disponible
                {availableProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {availableProducts.map((p) => {
                const selected = selectedToAdd.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setSelectedToAdd((prev) =>
                        prev.includes(p.id)
                          ? prev.filter((x) => x !== p.id)
                          : [...prev, p.id]
                      )
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      selected
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected
                          ? 'bg-slate-900 border-slate-900'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selected && (
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
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {Number(p.base_price).toLocaleString('fr-FR')}{' '}
                        FCFA · {p.totalStock} en stock
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowAddProducts(false)
                  setSelectedToAdd([])
                }}
                disabled={busy}
                className="flex-1 text-sm font-medium text-slate-700 py-2.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProducts}
                disabled={busy || selectedToAdd.length === 0}
                className="flex-1 text-sm font-medium text-white bg-slate-900 py-2.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40"
              >
                Ajouter {selectedToAdd.length > 0 && `(${selectedToAdd.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}