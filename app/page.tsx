import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-slate-900">LiveShop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              Créer ma boutique
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Live selling pour l'Afrique
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Faites votre live.
            <br />
            <span className="text-indigo-600">
              Nous gérons tout le reste.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mt-6 max-w-2xl">
            Vendez sur TikTok, Facebook ou Instagram. LiveShop gère vos
            commandes, votre stock et votre livraison — en temps réel.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              Créer ma boutique gratuitement
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-semibold px-6 py-4 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon="qr"
            title="QR code & lien de session"
            description="Créez une session, affichez le QR code pendant votre live. Vos clients scannent et commandent."
          />
          <FeatureCard
            icon="stock"
            title="Stock en temps réel"
            description="Le stock se met à jour automatiquement à chaque validation de commande. Zéro survente."
          />
          <FeatureCard
            icon="orders"
            title="Commandes centralisées"
            description="Recevez toutes vos commandes dans un seul endroit. Appelez, validez, encaissez."
          />
          <FeatureCard
            icon="delivery"
            title="Livraison intégrée"
            description="Offrez la livraison gratuite ou facturez-la. Vous gardez le contrôle total."
          />
          <FeatureCard
            icon="chart"
            title="Chiffre d'affaires"
            description="Suivez vos ventes en direct, par session, par produit, par période."
          />
          <FeatureCard
            icon="mobile"
            title="Mobile-first"
            description="Pensé pour le téléphone. Vos clients commandent en 3 clics, sans installer d'app."
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Prêt à vendre plus ?
          </h2>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto">
            Rejoignez les vendeurs qui utilisent LiveShop pour
            transformer leurs lives en véritable business.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-4 rounded-2xl hover:bg-slate-100 active:scale-[0.98] transition-all mt-8"
          >
            Commencer gratuitement
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              LiveShop
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LiveShop. Fait pour l'Afrique
            francophone.
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: 'qr' | 'stock' | 'orders' | 'delivery' | 'chart' | 'mobile'
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
        <FeatureIcon name={icon} />
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function FeatureIcon({
  name,
}: {
  name: 'qr' | 'stock' | 'orders' | 'delivery' | 'chart' | 'mobile'
}) {
  const cls = 'w-5 h-5 text-white'
  if (name === 'qr')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    )
  if (name === 'stock')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  if (name === 'delivery')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  if (name === 'chart')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}