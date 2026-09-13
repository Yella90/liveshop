'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateShopSettings } from '@/lib/actions/shop-settings'
import LogoUploader from './LogoUploader'

type Shop = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  country: string | null
  whatsapp: string | null
  contact_email: string | null
  website: string | null
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  opening_hours: string | null
  return_policy: string | null
  shipping_policy: string | null
  years_experience: number | null
  delivery_payer_default: 'CLIENT' | 'SELLER'
  free_delivery_threshold: number | null
}

export default function ShopSettingsForm({ shop }: { shop: Shop }) {
  const router = useRouter()

  const [name, setName] = useState(shop.name)
  const [description, setDescription] = useState(shop.description ?? '')
  const [phone, setPhone] = useState(shop.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(shop.whatsapp ?? '')
  const [contactEmail, setContactEmail] = useState(shop.contact_email ?? '')
  const [website, setWebsite] = useState(shop.website ?? '')
  const [address, setAddress] = useState(shop.address ?? '')
  const [postalCode, setPostalCode] = useState(shop.postal_code ?? '')
  const [city, setCity] = useState(shop.city ?? '')
  const [country, setCountry] = useState(shop.country ?? 'Mali')
  const [instagram, setInstagram] = useState(shop.instagram ?? '')
  const [tiktok, setTiktok] = useState(shop.tiktok ?? '')
  const [facebook, setFacebook] = useState(shop.facebook ?? '')
  const [openingHours, setOpeningHours] = useState(shop.opening_hours ?? '')
  const [returnPolicy, setReturnPolicy] = useState(shop.return_policy ?? '')
  const [shippingPolicy, setShippingPolicy] = useState(shop.shipping_policy ?? '')
  const [yearsExperience, setYearsExperience] = useState(
    shop.years_experience ? String(shop.years_experience) : ''
  )
  const [deliveryPayer, setDeliveryPayer] = useState<'CLIENT' | 'SELLER'>(
    shop.delivery_payer_default
  )
  const [threshold, setThreshold] = useState(
    shop.free_delivery_threshold ? String(shop.free_delivery_threshold) : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('phone', phone)
    formData.append('whatsapp', whatsapp)
    formData.append('contact_email', contactEmail)
    formData.append('website', website)
    formData.append('address', address)
    formData.append('postal_code', postalCode)
    formData.append('city', city)
    formData.append('country', country)
    formData.append('instagram', instagram)
    formData.append('tiktok', tiktok)
    formData.append('facebook', facebook)
    formData.append('opening_hours', openingHours)
    formData.append('return_policy', returnPolicy)
    formData.append('shipping_policy', shippingPolicy)
    formData.append('years_experience', yearsExperience)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* IDENTITÉ */}
      <Section title="Identité de la boutique" icon="store">
        {/* ✅ Logo upload direct */}
        <LogoUploader
          shopSlug={shop.slug}
          currentLogoUrl={shop.logo_url}
          shopName={shop.name}
        />

        <Field
          id="name"
          label="Nom de la boutique"
          value={name}
          onChange={setName}
          placeholder="Ex : Fatima Boutique"
          required
          maxLength={100}
        />

        <Field
          id="description"
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Décrivez votre boutique en quelques mots..."
          multiline
          rows={3}
          maxLength={500}
          help="Ce texte apparaît sur votre page publique pour rassurer les clients."
        />

        <Field
          id="years_experience"
          label="Années d'expérience"
          value={yearsExperience}
          onChange={setYearsExperience}
          placeholder="Ex : 5"
          type="number"
          help="Affiche votre expérience pour renforcer la confiance."
        />

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
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/${shop.slug}`
                )
                toast.success('Lien copié !')
              }}
              className="shrink-0 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copier
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ⚠️ Le lien ne peut pas être modifié.
          </p>
        </div>
      </Section>

      {/* CONTACT */}
      <Section title="Contact" icon="phone">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="phone"
            label="Téléphone"
            value={phone}
            onChange={setPhone}
            placeholder="+223 90 69 23 63"
            type="tel"
            maxLength={20}
            required
          />
          <Field
            id="whatsapp"
            label="WhatsApp"
            value={whatsapp}
            onChange={setWhatsapp}
            placeholder="+223 90 69 23 63"
            type="tel"
            maxLength={20}
            help="Les clients pourront vous écrire."
          />
        </div>

        <Field
          id="contact_email"
          label="Email de contact"
          value={contactEmail}
          onChange={setContactEmail}
          placeholder="contact@exemple.com"
          type="email"
          maxLength={100}
        />
      </Section>

      {/* ADRESSE */}
      <Section title="Adresse" icon="map">
        <Field
          id="address"
          label="Adresse"
          value={address}
          onChange={setAddress}
          placeholder="Ex : Rue 234, Hamdallaye ACI"
          maxLength={200}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            id="postal_code"
            label="Code postal"
            value={postalCode}
            onChange={setPostalCode}
            placeholder="Ex : BP 1234"
            maxLength={20}
          />
          <Field
            id="city"
            label="Ville"
            value={city}
            onChange={setCity}
            placeholder="Ex : Bamako"
            maxLength={50}
          />
          <Field
            id="country"
            label="Pays"
            value={country}
            onChange={setCountry}
            placeholder="Ex : Mali"
            maxLength={50}
          />
        </div>
      </Section>

      {/* RÉSEAUX SOCIAUX */}
      <Section title="Réseaux sociaux & Site web" icon="globe">
        <Field
          id="website"
          label="Site web"
          value={website}
          onChange={setWebsite}
          placeholder="https://monsite.com"
          type="url"
          maxLength={200}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="instagram"
            label="Instagram"
            value={instagram}
            onChange={setInstagram}
            placeholder="@monshop"
            maxLength={100}
          />
          <Field
            id="tiktok"
            label="TikTok"
            value={tiktok}
            onChange={setTiktok}
            placeholder="@monshop"
            maxLength={100}
          />
        </div>
        <Field
          id="facebook"
          label="Facebook"
          value={facebook}
          onChange={setFacebook}
          placeholder="facebook.com/monshop"
          maxLength={200}
        />
      </Section>

      {/* CONFIANCE */}
      <Section title="Confiance & Informations client" icon="shield">
        <Field
          id="opening_hours"
          label="Heures d'ouverture"
          value={openingHours}
          onChange={setOpeningHours}
          placeholder="Ex : Lun-Sam : 9h-20h · Dim : fermé"
          multiline
          rows={2}
          maxLength={200}
          help="Rassure les clients sur vos horaires."
        />

        <Field
          id="return_policy"
          label="Politique de retour"
          value={returnPolicy}
          onChange={setReturnPolicy}
          placeholder="Ex : Retour accepté sous 7 jours si le produit est non utilisé."
          multiline
          rows={3}
          maxLength={500}
        />

        <Field
          id="shipping_policy"
          label="Politique de livraison"
          value={shippingPolicy}
          onChange={setShippingPolicy}
          placeholder="Ex : Livraison en 24-48h à Bamako. Paiement à la livraison accepté."
          multiline
          rows={3}
          maxLength={500}
        />
      </Section>

      {/* LIVRAISON */}
      <Section title="Livraison" icon="truck">
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
              <p className="text-sm font-bold text-slate-900">Client paie</p>
              <p className="text-xs text-slate-500 mt-1">
                Les frais s&apos;ajoutent à la commande
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
              <p className="text-sm font-bold text-slate-900">Vous payez</p>
              <p className="text-xs text-slate-500 mt-1">
                Vous prenez les frais à votre charge
              </p>
            </button>
          </div>
        </div>

        <Field
          id="free_delivery_threshold"
          label="Seuil de livraison gratuite"
          value={threshold}
          onChange={setThreshold}
          placeholder="Ex : 25000"
          type="number"
          help="Livraison offerte au-dessus de ce montant (FCFA). Laissez vide pour désactiver."
        />
      </Section>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sticky bottom-4 sm:static">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* ============================================
   SECTION
   ============================================ */
function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: 'store' | 'phone' | 'map' | 'globe' | 'shield' | 'truck'
  children: React.ReactNode
}) {
  const gradients: Record<string, string> = {
    store: 'from-indigo-500 to-violet-600',
    phone: 'from-emerald-500 to-emerald-700',
    map: 'from-amber-500 to-orange-600',
    globe: 'from-blue-500 to-blue-700',
    shield: 'from-emerald-500 to-teal-600',
    truck: 'from-violet-500 to-purple-600',
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradients[icon]} flex items-center justify-center shadow-md`}>
          <SectionIcon name={icon} />
        </div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function SectionIcon({ name }: { name: string }) {
  const cls = 'w-4 h-4 text-white'
  if (name === 'store')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  if (name === 'phone')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  if (name === 'map')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  if (name === 'globe')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  if (name === 'shield')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  )
}

/* ============================================
   FIELD
   ============================================ */
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  multiline = false,
  rows = 2,
  maxLength,
  help,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  multiline?: boolean
  rows?: number
  maxLength?: number
  help?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
        />
      )}

      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  )
}