'use client'

import { useEffect, useState } from 'react'
import { createShop, checkSlugAvailability } from '@/lib/actions/shop'
import { slugify } from '@/lib/constants'

type SlugStatus = {
  checking: boolean
  available: boolean | null
  reason?: string
}

export default function OnboardingForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [slugStatus, setSlugStatus] = useState<SlugStatus>({
    checking: false,
    available: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Génère le slug automatiquement à partir du nom
  useEffect(() => {
    if (!slugManuallyEdited && name) {
      setSlug(slugify(name))
    }
  }, [name, slugManuallyEdited])

  // Vérifie la disponibilité du slug avec debounce
  useEffect(() => {
    if (!slug) {
      setSlugStatus({ checking: false, available: null })
      return
    }
    setSlugStatus({ checking: true, available: null })
    const timer = setTimeout(async () => {
      const result = await checkSlugAvailability(slug)
      setSlugStatus({
        checking: false,
        available: result.available,
        reason: result.reason,
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (slugStatus.available !== true) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('slug', slug)
    formData.append('description', description)
    formData.append('phone', phone)

    const result = await createShop(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const isFormValid =
    name.length >= 2 &&
    slug.length >= 3 &&
    slugStatus.available === true

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-900 mb-2"
        >
          Nom de la boutique
          <span className="text-red-500 ml-1">*</span>
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
        <p className="mt-2 text-xs text-slate-500">
          Le nom qui apparaîtra sur votre page publique.
        </p>
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-semibold text-slate-900 mb-2"
        >
          Lien de la boutique
          <span className="text-red-500 ml-1">*</span>
        </label>

        <div className="flex items-stretch rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent focus-within:bg-white transition-all">
          {/* Préfixe */}
          <span className="hidden sm:flex items-center px-4 text-sm text-slate-500 bg-slate-100 border-r border-slate-200 whitespace-nowrap">
            liveshop.com/
          </span>
          <span className="sm:hidden flex items-center pl-3 text-sm text-slate-500 whitespace-nowrap">
            /
          </span>

          {/* Input */}
          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugManuallyEdited(true)
              setSlug(e.target.value.toLowerCase())
            }}
            placeholder="fatima-boutique"
            maxLength={50}
            className="flex-1 min-w-0 px-3 sm:px-4 py-3 text-base text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          />

          {/* Indicateur */}
          <div className="flex items-center justify-center w-10 sm:w-12 shrink-0">
            {slugStatus.checking && (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
            )}
            {!slugStatus.checking && slugStatus.available === true && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
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
            {!slugStatus.checking && slugStatus.available === false && (
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Message d'aide */}
        {slugStatus.available === false && slugStatus.reason && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-600" />
            {slugStatus.reason}
          </p>
        )}
        {slugStatus.available === true && (
          <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-600" />
            Ce lien est disponible
          </p>
        )}
        {slugStatus.available === null && slug.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Vérification en cours...
          </p>
        )}
        {slug.length === 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Ce sera l&apos;adresse de votre boutique.
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-900 mb-2"
        >
          Description
          <span className="text-slate-400 font-normal ml-1">
            (optionnel)
          </span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quelques mots sur votre boutique, vos produits..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
        />
        <p className="mt-2 text-xs text-slate-500 text-right">
          {description.length}/300
        </p>
      </div>

      {/* Téléphone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-slate-900 mb-2"
        >
          Téléphone
          <span className="text-slate-400 font-normal ml-1">
            (optionnel)
          </span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+221 77 000 00 00"
          maxLength={20}
          className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
        />
        <p className="mt-2 text-xs text-slate-500">
          Vos clients pourront vous appeler pour confirmer.
        </p>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 flex items-start gap-2">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
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
            <span>{error}</span>
          </p>
        </div>
      )}

      {/* Bouton */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:active:scale-100 transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              Créer ma boutique
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-slate-500 text-center">
          En créant votre boutique, vous acceptez nos conditions
          d&apos;utilisation.
        </p>
      </div>
    </form>
  )
}