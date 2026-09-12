'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createSession, updateSession } from '@/lib/actions/sessions'

type Product = {
  id: string
  name: string
  base_price: number
  image: string | null
  totalStock: number
}

type SessionFormProps = {
  mode: 'create' | 'edit'
  sessionId?: string
  products: Product[]
  initialData?: {
    name: string
    description: string
    free_delivery_enabled: boolean
    is_active: boolean
    selectedProductIds: string[]
  }
}

export default function SessionForm({
  mode,
  sessionId,
  products,
  initialData,
}: SessionFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )
  const [freeDelivery, setFreeDelivery] = useState(
    initialData?.free_delivery_enabled ?? false
  )
  const [isActive, setIsActive] = useState(
    initialData?.is_active ?? true
  )
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialData?.selectedProductIds ?? []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function selectAll() {
    setSelectedIds(products.map((p) => p.id))
  }

  function deselectAll() {
    setSelectedIds([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (freeDelivery) formData.append('free_delivery_enabled', 'on')
    if (isActive) formData.append('is_active', 'on')
    selectedIds.forEach((id) => formData.append('product_ids', id))

    const result =
      mode === 'create'
        ? await createSession(formData)
        : await updateSession(sessionId!, formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos de base */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          Informations de la session
        </h2>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Nom de la session <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Live du 15 juin - Nouveautés"
            maxLength={120}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
          <p className="mt-1 text-xs text-slate-500">
            Un slug sera généré automatiquement à partir du nom.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez cette session pour vos clients..."
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Session active
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Visible par les clients sur votre boutique.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={freeDelivery}
              onChange={(e) => setFreeDelivery(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Livraison offerte
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Vous prendrez en charge les frais de livraison pour
                les commandes de cette session.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Sélection des produits */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Produits de la session
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {selectedIds.length} sélectionné
              {selectedIds.length > 1 ? 's' : ''} sur {products.length}
            </p>
          </div>
          {products.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Tout sélectionner
              </button>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Tout désélectionner
                </button>
              )}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              Vous n&apos;avez pas encore de produit.
            </p>
            <button
              type="button"
              onClick={() =>
                router.push('/dashboard/produits/nouveau')
              }
              className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {products.map((product) => {
              const selected = selectedIds.includes(product.id)
              const outOfStock = product.totalStock === 0
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Checkbox visuel */}
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

                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
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
                        {Number(product.base_price).toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </p>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <p
                        className={`text-xs ${
                          outOfStock ? 'text-red-500' : 'text-slate-500'
                        }`}
                      >
                        {outOfStock
                          ? 'Rupture'
                          : `${product.totalStock} en stock`}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : mode === 'create' ? (
            'Créer la session'
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  )
}