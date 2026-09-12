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
  const { addToCart, totalItems } = useCart(shopSlug)

  // ✅ Lien panier qui conserve la session
  const cartUrl = sessionSlug
    ? `/${shopSlug}/panier?session=${sessionSlug}`
    : `/${shopSlug}/panier`

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
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
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-3 text-base text-slate-900 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as 'recent' | 'price-asc' | 'price-desc'
            )
          }
          className="px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">
            Aucun produit ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ClientProductCard
              key={product.id}
              shopSlug={shopSlug}
              product={product}
              onAdd={(variant) => addToCart(product, variant, sessionSlug)}
            />
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <Link
          href={cartUrl}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto z-40 flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-2xl shadow-slate-900/30 hover:bg-slate-800 active:scale-[0.98] transition-all"
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Voir le panier
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold bg-white text-slate-900 rounded-full">
            {totalItems}
          </span>
        </Link>
      )}
    </div>
  )
}

function ClientProductCard({
  shopSlug,
  product,
  onAdd,
}: {
  shopSlug: string
  product: Product
  onAdd: (variant: Variant) => void
}) {
  const [showVariants, setShowVariants] = useState(false)
  const variants = product.product_variants ?? []
  const availableVariants = variants.filter((v) => v.stock > 0)
  const minP = minPrice(product)
  const hasImage = product.images.length > 0
  const stockTotal = variants.reduce((s, v) => s + v.stock, 0)

  function handleClick() {
    if (variants.length <= 1) {
      if (availableVariants[0]) onAdd(availableVariants[0])
    } else {
      setShowVariants(true)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
        <button
          onClick={handleClick}
          disabled={stockTotal === 0}
          className="block w-full aspect-square bg-slate-100 relative overflow-hidden disabled:opacity-60"
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-300"
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
          {stockTotal === 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                Rupture de stock
              </span>
            </div>
          )}
          {variants.length > 1 && stockTotal > 0 && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-semibold px-2 py-1 rounded-full">
              {variants.length} options
            </div>
          )}
          {stockTotal > 0 && stockTotal <= 3 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              Plus que {stockTotal}
            </div>
          )}
        </button>

        <div className="p-3">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-base font-bold text-slate-900">
              {Number(minP).toLocaleString('fr-FR')}
              <span className="text-xs font-medium text-slate-500 ml-1">
                FCFA
              </span>
            </p>
            {stockTotal > 0 && (
              <button
                onClick={handleClick}
                className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {showVariants && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowVariants(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choisissez une option
                </p>
              </div>
              <button
                onClick={() => setShowVariants(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600"
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

            <div className="p-4 space-y-2">
              {variants.map((variant) => {
                const available = variant.stock > 0
                return (
                  <button
                    key={variant.id}
                    disabled={!available}
                    onClick={() => {
                      onAdd(variant)
                      setShowVariants(false)
                    }}
                    className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white transition-all text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {variant.name}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          available ? 'text-slate-500' : 'text-red-500'
                        }`}
                      >
                        {available
                          ? `${variant.stock} en stock`
                          : 'Rupture'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {Number(variant.price).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-[10px] text-slate-500">FCFA</p>
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

function minPrice(product: Product): number {
  const variants = product.product_variants ?? []
  if (variants.length === 0) return product.base_price
  return Math.min(...variants.map((v) => v.price))
}