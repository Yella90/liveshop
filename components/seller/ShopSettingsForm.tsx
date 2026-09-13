'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateShopSettings } from '@/lib/actions/shop-settings'

type Shop = {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  delivery_payer_default: 'CLIENT' | 'SELLER'
  free_delivery_threshold: number | null
  created_at: string
}

export default function ShopSettingsForm({ shop }: { shop: Shop }) {
  const router = useRouter()

  const [name, setName] = useState(shop.name)
  const [description, setDescription] = useState(shop.description ?? '')
  const [phone, setPhone] = useState(shop.phone ?? '')
  const [deliveryPayer, setDeliveryPayer] = useState<'CLIENT' | 'SELLER'>(
    shop.delivery_payer_default
  )
  const [threshold, setThreshold] = useState(
    shop.free_delivery_threshold ? String(shop.free_delivery_threshold) : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasChanges =
    name !== shop.name ||
    description !== (shop.description ?? '') ||
    phone !== (shop.phone ?? '') ||
    deliveryPayer !== shop.delivery_payer_default ||
    threshold !==
      (shop.free_delivery_threshold
        ? String(shop.free_delivery_threshold)
        : '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('phone', phone)
    formData.append('delivery_payer_default', deliveryPayer)
    formData.append('free_delivery_threshold', threshold)

    const toastId = toast.loading('Enregistrement...')
    const result = await updateShopSettings(formData)

    if (result?.error) {
      setError(result.error)
      toast.error(result.error, { id: toastId })
      setLoading(false)
      return
    }

    toast.success('Paramètres enregistrés !', { id: toastId })
    router.refresh()
    setLoading(false)
  }

  function copyShopLink() {
    const url = `${window.location.origin}/${shop.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Lien copié !')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos boutique */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Informations de la boutique
          </h2>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
          >
            Nom de la boutique <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Fatima Boutique"
            maxLength={100}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
          <p className="mt-1 text-xs text-slate-500 text-right">
            {name.length}/100
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre boutique en quelques mots..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
          />
          <p className="mt-1 text-xs text-slate-500 text-right">
            {description.length}/500
          </p>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
          >
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+223 90 69 23 63"
            maxLength={20}
            className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
          <p className="mt-1 text-xs text-slate-500">
            Ce numéro sera affiché à vos clients pour les contacter.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Lien de la boutique
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${shop.slug}`}
              readOnly
              className="flex-1 px-4 py-3 text-sm font-mono text-slate-600 bg-slate-100 border border-slate-200 rounded-xl truncate"
            />
            <button
              type="button"
              onClick={copyShopLink}
              className="shrink-0 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copier
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ⚠️ Le lien ne peut pas être modifié (il est partagé avec vos
            clients).
          </p>
        </div>
      </section>

      {/* Livraison */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Livraison
          </h2>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
            Qui paie la livraison par défaut ?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryPayer('CLIENT')}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                deliveryPayer === 'CLIENT'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-sm font-bold text-slate-900">
                Client paie
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Les frais s&apos;ajoutent à la commande du client
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPayer('SELLER')}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                deliveryPayer === 'SELLER'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-sm font-bold text-slate-900">
                Vous payez
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Vous prenez les frais à votre charge
              </p>
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="threshold"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
          >
            Seuil de livraison gratuite
          </label>
          <div className="relative">
            <input
              id="threshold"
              type="number"
              min={0}
              step={500}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Ex : 25000"
              className="w-full px-4 py-3 pr-20 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              FCFA
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Livraison offerte automatiquement au-dessus de ce montant.
            Laissez vide pour désactiver.
          </p>
        </div>
      </section>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sticky bottom-4 sm:static">
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
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
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  )
}