import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="border-b border-slate-100 bg-white/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-slate-900">LiveShop</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="https://unitech-qvgo.onrender.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Services
            </Link>
            <Link
              href="https://unitech-qvgo.onrender.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/connexion"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              Connexion
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

      {/* ============================================
          HERO
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
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

          {/* Stats rapides */}
          <div className="flex flex-wrap gap-6 sm:gap-8 mt-12 pt-8 border-t border-slate-200">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                3+
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Projets en développement
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                12
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Membres dans l'équipe
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                2
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                SaaS en production
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                5+
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Solutions innovantes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION FONDATEUR — UNITECH
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          {/* Motif décoratif */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 right-16 w-32 h-32 bg-white/5 rounded-full translate-y-16" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Texte */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Notre fondateur
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Développé par{' '}
                <span className="text-indigo-400">UNITECH</span>
              </h2>

              <p className="text-slate-300 mt-6 text-base sm:text-lg leading-relaxed">
                UNITECH développe des solutions SaaS innovantes pour
                l'éducation, le commerce local et la gestion
                énergétique intelligente. LiveShop est né de cette
                vision : bâtir l'infrastructure intelligente de
                demain.
              </p>

              <p className="text-slate-400 mt-4 text-sm">
                Basé à Bamako, Mali · Solutions technologiques sur
                mesure
              </p>

              {/* Liens UNITECH */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="https://unitech-qvgo.onrender.com/services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-3 rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all text-sm"
                >
                  Découvrir nos services
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
                <Link
                  href="https://unitech-qvgo.onrender.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 active:scale-[0.98] transition-all text-sm"
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Cartes services UNITECH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitechServiceCard
                title="Développement Web & SaaS"
                description="Applications web sur mesure, responsives et performantes"
                icon="web"
              />
              <UnitechServiceCard
                title="Agent IA Intelligent"
                description="Assistants virtuels et chatbots intelligents"
                icon="ai"
              />
              <UnitechServiceCard
                title="IoT & Automatisation"
                description="Solutions de connectivité pour l'industrie"
                icon="iot"
              />
              <UnitechServiceCard
                title="Formations Tech"
                description="Programmes pour développer vos compétences"
                icon="training"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ASSISTANT IA
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Besoin d'aide ? Parlez à notre assistant IA
              </h3>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Propulsé par DONA et HARVEY, nos agents IA vous
                renseignent 24/7 sur nos services, nos projets et nos
                formations.
              </p>
            </div>

            <Link
              href="https://unitech-qvgo.onrender.com/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all whitespace-nowrap w-full sm:w-auto"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Discuter avec l'IA
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          FONCTIONNALITÉS LIVESHOP
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Pourquoi LiveShop ?
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour transformer vos lives
            en véritable business.
          </p>
        </div>

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

      {/* ============================================
          CTA FINAL
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Prêt à vendre plus ?
            </h2>
            <p className="text-indigo-100 mt-4 max-w-xl mx-auto">
              Rejoignez les vendeurs qui utilisent LiveShop pour
              transformer leurs lives en véritable business.
            </p>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-4 rounded-2xl hover:bg-indigo-50 active:scale-[0.98] transition-all mt-8"
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
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Colonne 1 — Logo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-semibold text-slate-900">
                  LiveShop
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                La plateforme de live selling pensée pour l'Afrique
                francophone.
              </p>
            </div>

            {/* Colonne 2 — Produit */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Produit
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/inscription"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Créer une boutique
                  </Link>
                </li>
                <li>
                  <Link
                    href="/connexion"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Mot de passe oublié
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 — UNITECH */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                UNITECH
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Site officiel
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Nos services
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Assistant IA
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 4 — Contact */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Contact
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="mailto:doumbialayesoma@gmail.com"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    doumbialayesoma@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+22390692363"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    +223 90 69 23 63
                  </a>
                </li>
                <li>
                  <span className="text-sm text-slate-500">
                    Bamako, Mali
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bas du footer */}
          <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} LiveShop. Tous droits
              réservés.
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              Développé par
              <Link
                href="https://unitech-qvgo.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
              >
                UNITECH
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ============================================
   COMPOSANT : Carte service UNITECH
   ============================================ */
function UnitechServiceCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: 'web' | 'ai' | 'iot' | 'training'
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
        <UnitechIcon name={icon} />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function UnitechIcon({
  name,
}: {
  name: 'web' | 'ai' | 'iot' | 'training'
}) {
  const cls = 'w-5 h-5 text-white'
  if (name === 'web')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  if (name === 'ai')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  if (name === 'iot')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  )
}

/* ============================================
   COMPOSANT : Carte fonctionnalité LiveShop
   ============================================ */
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