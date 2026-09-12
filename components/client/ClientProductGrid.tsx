'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/hooks/useCart'

type Variant = {
  id: string
  name: string
  price: number
  stock: number
}

type Product = {
  id: string
  name: string
  description: string | null
  base_price: number
  images: string[]
  active: boolean
  product_variants: Variant[]
}

export default function ClientProductGrid({
  shopSlug,
  sessionSlug = null,
  products,
}: {
  shopSlug: string
  sessionSlug?: string | null
  products: Product[]
}) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc'>(
    'recent'
  )
  const { addToCart, totalItems, totalPrice } = useCart(shopSlug)

  const cartUrl = `/${shopSlug}/panier`

  const filtered = useMemo(() => {
    let list = products
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      )
    }
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => minPrice(a) - minPrice(b))
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => minPrice(b) - minPrice(a))
    }
    return list
  }, [products, query, sortBy])

  return (
    <div className="space-y-6">
      {/* ============================================
          BARRE DE RECHERCHE + TRI
          ============================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche */}
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-12 py-3.5 text-base text-slate-900 bg-white border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Effacer"
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
          )}
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'recent' | 'price-asc' | 'price-desc'
              )
            }
            className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
          >
            <option value="recent">✨ Plus récents</option>
            <option value="price-asc">💰 Prix croissant</option>
            <option value="price-desc">💎 Prix décroissant</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ============================================
          RÉSULTAT DE RECHERCHE
          ============================================ */}
      {query && (
        <p className="text-sm text-slate-500">
          {filtered.length} résultat
          {filtered.length > 1 ? 's' : ''} pour{' '}
          <span className="font-semibold text-slate-900">
            « {query} »
          </span>
        </p>
      )}

      {/* ============================================
          AUCUN RÉSULTAT
          ============================================ */}
      {filtered.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Aucun résultat
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Aucun produit ne correspond à votre recherche.
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {filtered.map((product, index) => (
            <ClientProductCard
              key={product.id}
              shopSlug={shopSlug}
              product={product}
              onAdd={(variant) => {
                addToCart(product, variant, sessionSlug)
              }}
              index={index}
            />
          ))}
        </div>
      )}

      {/* ============================================
          BARRE PANIER FLOTTANTE
          ============================================ */}
      {totalItems > 0 && (
        <Link
          href={cartUrl}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto z-40 flex items-center justify-center gap-3 bg-slate-900 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl shadow-slate-900/40 hover:bg-slate-800 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all animate-fade-in-up"
        >
          <div className="relative">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900">
              {totalItems}
            </span>
          </div>

          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs text-slate-400 font-medium">
              Voir le panier
            </span>
            <span className="text-sm font-bold">
              {totalPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <svg
            className="w-4 h-4 ml-1"
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
      )}
    </div>
  )
}

/* ============================================
   CARTE PRODUIT
   ============================================ */
function ClientProductCard({
  shopSlug,
  product,
  onAdd,
  index = 0,
}: {
  shopSlug: string
  product: Product
  onAdd: (variant: Variant) => void
  index?: number
}) {
  const [showVariants, setShowVariants] = useState(false)
  const variants = product.product_variants ?? []
  const availableVariants = variants.filter((v) => v.stock > 0)
  const minP = minPrice(product)
  const hasImage = product.images.length > 0
  const stockTotal = variants.reduce((s, v) => s + v.stock, 0)
  const isLowStock = stockTotal > 0 && stockTotal <= 3

  function handleClick() {
    if (variants.length <= 1) {
      if (availableVariants[0]) onAdd(availableVariants[0])
    } else {
      setShowVariants(true)
    }
  }

  return (
    <>
      <div
        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 card-3d animate-fade-in-up transition-all duration-300"
        style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
      >
        {/* Image */}
        <button
          onClick={handleClick}
          disabled={stockTotal === 0}
          className="block w-full aspect-square bg-slate-100 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <svg
                className="w-14 h-14 text-slate-300"
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

          {/* Overlay rupture */}
          {stockTotal === 0 && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Rupture de stock
              </span>
            </div>
          )}

          {/* Overlay gradient en bas */}
          {stockTotal > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}

          {/* Badge variantes */}
          {variants.length > 1 && stockTotal > 0 && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {variants.length} options
            </div>
          )}

          {/* Badge stock faible */}
          {isLowStock && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              ⚡ Plus que {stockTotal}
            </div>
          )}

          {/* Bouton "ajouter" overlay rapide (desktop) */}
          {stockTotal > 0 && variants.length <= 1 && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
              <div className="w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-xl text-center shadow-lg">
                Ajouter au panier
              </div>
            </div>
          )}
        </button>

        {/* Infos */}
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                Prix
              </p>
              <p className="text-base sm:text-lg font-black text-slate-900 truncate">
                {Number(minP).toLocaleString('fr-FR')}
                <span className="text-[10px] font-medium text-slate-500 ml-1">
                  FCFA
                </span>
              </p>
            </div>

            {stockTotal > 0 && (
              <button
                onClick={handleClick}
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-90 transition-all flex items-center justify-center"
                title="Ajouter au panier"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          MODAL VARIANTES
          ============================================ */}
      {showVariants && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowVariants(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header modal */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-3 z-10">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choisissez une option
                </p>
              </div>
              <button
                onClick={() => setShowVariants(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Liste variantes */}
            <div className="p-4 space-y-2">
              {variants.map((variant) => {
                const available = variant.stock > 0
                const isLow = available && variant.stock <= 3
                return (
                  <button
                    key={variant.id}
                    disabled={!available}
                    onClick={() => {
                      onAdd(variant)
                      setShowVariants(false)
                    }}
                    className="group w-full flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white transition-all text-left active:scale-[0.98]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                        {variant.name}
                      </p>
                      <p
                        className={`text-xs mt-1 font-medium ${
                          !available
                            ? 'text-red-500'
                            : isLow
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {!available
                          ? '✕ Rupture'
                          : isLow
                          ? `⚡ Plus que ${variant.stock}`
                          : `✓ ${variant.stock} en stock`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-slate-900">
                        {Number(variant.price).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        FCFA
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================
   Utils
   ============================================ */
function minPrice(product: Product): number {
  const variants = product.product_variants ?? []
  if (variants.length === 0) return product.base_price
  return Math.min(...variants.map((v) => v.price))
}