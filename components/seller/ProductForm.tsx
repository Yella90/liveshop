'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  createProduct,
  updateProduct,
} from '@/lib/actions/products'
import ImageUploader from '@/components/seller/ImageUploader'

type Variant = {
  id?: string
  name: string
  price: string
  stock: string
  sku: string
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  shopSlug: string
  productId?: string
  initialData?: {
    name: string
    description: string
    base_price: number
    images: string[]
    active: boolean
    variants: Variant[]
  }
}

export default function ProductForm({
  mode,
  shopSlug,
  productId,
  initialData,
}: ProductFormProps) {
  const router = useRouter()

  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )
  const [basePrice, setBasePrice] = useState(
    initialData ? String(initialData.base_price) : ''
  )
  const [images, setImages] = useState<string[]>(
    initialData?.images ?? []
  )
  const [active, setActive] = useState(initialData?.active ?? true)
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants ?? [
      { name: 'Standard', price: '', stock: '0', sku: '' },
    ]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addVariant() {
    setVariants([
      ...variants,
      { name: '', price: basePrice, stock: '0', sku: '' },
    ])
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) {
      toast.error('Au moins une variante est requise')
      return
    }
    setVariants(variants.filter((_, i) => i !== index))
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string
  ) {
    setVariants(
      variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validations locales
    if (name.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères')
      return
    }
    if (!basePrice || Number(basePrice) < 0) {
      toast.error('Veuillez saisir un prix de base valide')
      return
    }
    if (variants.length === 0) {
      toast.error('Ajoutez au moins une variante')
      return
    }
    const invalidVariant = variants.find(
      (v) => !v.name.trim() || !v.price
    )
    if (invalidVariant) {
      toast.error('Chaque variante doit avoir un nom et un prix')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('base_price', basePrice || '0')
    formData.append('images', JSON.stringify(images))
    formData.append('variants', JSON.stringify(variants))
    if (active) formData.append('active', 'on')

    const toastId = toast.loading(
      mode === 'create'
        ? 'Création du produit...'
        : 'Enregistrement des modifications...'
    )

    try {
      const result =
        mode === 'create'
          ? await createProduct(formData)
          : await updateProduct(productId!, formData)

      if (result?.error) {
        toast.error(result.error, { id: toastId })
        setError(result.error)
        setLoading(false)
        return
      }

      toast.success(
        mode === 'create'
          ? 'Produit créé avec succès !'
          : 'Modifications enregistrées !',
        { id: toastId }
      )

      // La redirection est gérée par le server action (redirect())
    } catch (err) {
      toast.error('Une erreur est survenue', { id: toastId })
      setLoading(false)
    }
  }

  const isValid =
    name.trim().length >= 2 &&
    basePrice !== '' &&
    variants.length > 0 &&
    variants.every((v) => v.name.trim() && v.price)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations du produit */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
          Informations du produit
        </h2>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Nom du produit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Robe Wax"
            maxLength={120}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre produit, ses matériaux, ses dimensions..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
          />
          <p className="mt-1 text-xs text-slate-500 text-right">
            {description.length}/500
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Prix de base (FCFA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min={0}
            step={50}
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Ex : 15000"
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
          <p className="mt-1 text-xs text-slate-500">
            Prix par défaut. Chaque variante peut avoir son propre prix.
          </p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Photos du produit
          </label>
          <ImageUploader
            shopSlug={shopSlug}
            images={images}
            onChange={setImages}
            maxImages={5}
          />
          <p className="mt-2 text-xs text-slate-500">
            La première image sera utilisée comme image principale.
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-900">
            Produit actif (visible dans la boutique)
          </span>
        </label>
      </section>

      {/* Variantes */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Variantes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Chaque variante a son propre prix et stock.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="col-span-12 sm:col-span-4">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(index, 'name', e.target.value)
                  }
                  placeholder="Ex : Taille M"
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Prix (FCFA)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={50}
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, 'price', e.target.value)
                  }
                  placeholder="15000"
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, 'stock', e.target.value)
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-10 sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) =>
                    updateVariant(index, 'sku', e.target.value)
                  }
                  placeholder="Optionnel"
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={variants.length <= 1}
                  className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Supprimer la variante"
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
          ))}
        </div>
      </section>

      {/* Erreur globale */}
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
          disabled={loading || !isValid}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : mode === 'create' ? (
            'Créer le produit'
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </div>
    </form>
  )
}