'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteProduct, toggleProductActive } from '@/lib/actions/products'

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
  created_at: string
}

export default function ProductCard({
  product,
  variants,
}: {
  product: Product
  variants: Variant[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const totalStock = variants.reduce((s, v) => s + v.stock, 0)
  const minPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.price))
      : product.base_price
  const hasImage = product.images.length > 0

  async function handleToggleActive() {
    setBusy(true)
    await toggleProductActive(product.id, !product.active)
    router.refresh()
    setBusy(false)
  }

  async function handleDelete() {
    setBusy(true)
    const result = await deleteProduct(product.id)
    if (result?.error) {
      alert(result.error)
      setBusy(false)
      return
    }
    router.refresh()
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-slate-300 hover:shadow-sm transition-all">
        {/* Image */}
        <div className="aspect-square bg-slate-100 relative overflow-hidden">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

          {/* Badge inactif */}
          {!product.active && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                Inactif
              </span>
            </div>
          )}

          {/* Nombre de variantes */}
          {variants.length > 1 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full">
              {variants.length} variantes
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 text-sm truncate">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 h-8">
              {product.description}
            </p>
          )}

          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                Prix
              </p>
              <p className="text-base font-bold text-slate-900">
                {Number(minPrice).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                Stock
              </p>
              <p
                className={`text-base font-bold ${
                  totalStock === 0
                    ? 'text-red-500'
                    : totalStock < 5
                    ? 'text-amber-500'
                    : 'text-emerald-600'
                }`}
              >
                {totalStock}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <Link
              href={`/dashboard/produits/${product.id}/modifier`}
              className="flex-1 text-center text-xs font-medium text-slate-700 hover:text-slate-900 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Modifier
            </Link>
            <button
              onClick={handleToggleActive}
              disabled={busy}
              className="flex-1 text-xs font-medium text-slate-700 hover:text-slate-900 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {product.active ? 'Désactiver' : 'Activer'}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={busy}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Supprimer"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Supprimer ce produit ?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              <strong>{product.name}</strong> et ses{' '}
              {variants.length} variante
              {variants.length > 1 ? 's' : ''} seront définitivement
              supprimés. Cette action est irréversible.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={busy}
                className="flex-1 text-sm font-medium text-slate-700 py-2.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex-1 text-sm font-medium text-white bg-red-600 py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {busy ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}