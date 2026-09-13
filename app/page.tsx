import Link from 'next/link'
import ShareQRCode from '@/components/ShareQRCode'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              LiveShop
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/aide"
              className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Aide
            </Link>
            <Link
              href="https://unitech-qvgo.onrender.com/services"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Services
            </Link>
            <Link
              href="https://unitech-qvgo.onrender.com/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Assistant IA
            </Link>
            <Link
              href="/connexion"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="text-sm font-semibold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 transition-all btn-shine"
            >
              Créer ma boutique
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-violet-400/30 rounded-full blur-3xl animate-float delay-1000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float-slow delay-500" />
        </div>

        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full mb-6 shadow-sm animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live selling pour l'Afrique
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight animate-fade-in-up delay-100">
                Faites votre live.
                <br />
                <span className="text-gradient">Nous gérons tout.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mt-6 max-w-xl leading-relaxed animate-fade-in-up delay-200">
                Vendez sur TikTok, Facebook ou Instagram. LiveShop gère
                vos commandes, votre stock et votre livraison —{' '}
                <span className="font-semibold text-slate-900">
                  en temps réel
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-10 animate-fade-in-up delay-300">
                <Link
                  href="/inscription"
                  className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold px-7 py-4 rounded-2xl hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 transition-all btn-shine"
                >
                  Créer ma boutique
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-semibold px-7 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg active:scale-95 transition-all"
                >
                  J'ai déjà un compte
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-10 animate-fade-in-up delay-400">
                <div className="flex -space-x-2">
                  {['F', 'A', 'M', 'S'].map((initial, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-amber-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adopté par les vendeurs TikTok
                  </p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 rounded-3xl blur-3xl opacity-30 animate-pulse-glow" />

                <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-3 border border-slate-200 rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-4 aspect-[9/19] flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-5 bg-black rounded-full" />
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-xs font-bold uppercase tracking-wide">
                          En direct
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-3 animate-fade-in delay-500">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600" />
                          <div className="flex-1">
                            <p className="text-white text-xs font-semibold">
                              Robe Wax
                            </p>
                            <p className="text-white/60 text-[10px]">
                              15 000 FCFA
                            </p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur rounded-xl p-3 animate-fade-in delay-700">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600" />
                          <div className="flex-1">
                            <p className="text-white text-xs font-semibold">
                              Sac Cuir
                            </p>
                            <p className="text-white/60 text-[10px]">
                              25 000 FCFA
                            </p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-500/20 border border-emerald-400/30 backdrop-blur rounded-xl p-2.5 animate-fade-in delay-1000">
                        <p className="text-white text-[10px] font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Nouvelle commande reçue
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 text-xs font-bold">
                          Voir le panier
                        </span>
                        <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 animate-float border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-600"
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
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">
                        Stock mis à jour
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        Temps réel
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 animate-float delay-500 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">
                        Scan QR code
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        Sans app
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          MARQUEE
          ============================================ */}
      <section className="py-8 border-y border-slate-200 bg-white overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {[
                '🚀 Temps réel',
                '📦 Stock automatique',
                '🎯 Validation manuelle',
                '📱 Mobile-first',
                '🔔 Notifications live',
                '🚚 Livraison intégrée',
                '💰 Suivi du CA',
                '🇲🇱 Made in Africa',
              ].map((item, j) => (
                <span
                  key={j}
                  className="text-sm font-semibold text-slate-500 tracking-wide"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          FONDATEUR — UNITECH
          ============================================ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 sm:p-14 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float delay-700" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 glass-dark text-white text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Notre fondateur
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  Développé par{' '}
                  <span className="text-gradient-light">UNITECH</span>
                </h2>

                <p className="text-slate-300 mt-6 text-base sm:text-lg leading-relaxed">
                  UNITECH développe des solutions SaaS innovantes pour
                  l'éducation, le commerce local et la gestion
                  énergétique intelligente. LiveShop est né de cette
                  vision :{' '}
                  <span className="text-white font-semibold">
                    bâtir l'infrastructure intelligente de demain
                  </span>
                  .
                </p>

                <p className="text-slate-400 mt-4 text-sm flex items-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Bamako, Mali · Solutions technologiques sur mesure
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    href="https://unitech-qvgo.onrender.com/services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-3 rounded-xl hover:bg-slate-100 active:scale-95 transition-all text-sm btn-shine"
                  >
                    Découvrir nos services
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
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
                    className="inline-flex items-center gap-2 glass-dark text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-sm"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnitechServiceCard
                  title="Développement Web & SaaS"
                  description="Applications web sur mesure et performantes"
                  icon="web"
                  delay={0}
                />
                <UnitechServiceCard
                  title="Agents IA"
                  description="DONA & HARVEY, vos assistants intelligents"
                  icon="ai"
                  delay={150}
                />
                <UnitechServiceCard
                  title="IoT & Automatisation"
                  description="Solutions de connectivité pour l'industrie"
                  icon="iot"
                  delay={300}
                />
                <UnitechServiceCard
                  title="Formations Tech"
                  description="Programmes pour développer vos compétences"
                  icon="training"
                  delay={450}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ASSISTANT IA
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

          <div className="relative bg-white rounded-3xl border border-slate-200 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce-subtle">
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
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Besoin d'aide ? Parlez à nos agents IA
                </h3>
                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                  <span className="font-semibold text-slate-700">DONA</span>{' '}
                  et{' '}
                  <span className="font-semibold text-slate-700">HARVEY</span>{' '}
                  vous renseignent 24/7 sur nos services, projets et
                  formations.
                </p>
              </div>

              <Link
                href="https://unitech-qvgo.onrender.com/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3.5 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all whitespace-nowrap w-full sm:w-auto btn-shine"
              >
                <svg
                  className="w-5 h-5 group-hover/btn:scale-110 transition-transform"
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
                Discuter maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS
          ============================================ */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <StatItem value="3+" label="Projets en dév." delay={0} />
            <StatItem value="12" label="Membres équipe" delay={100} />
            <StatItem value="2" label="SaaS en production" delay={200} />
            <StatItem value="5+" label="Solutions innovantes" delay={300} />
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES LIVESHOP
          ============================================ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Fonctionnalités
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Pourquoi <span className="text-gradient">LiveShop</span> ?
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
              Tout ce dont vous avez besoin pour transformer vos lives
              en véritable business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon="qr"
              title="QR code & lien de session"
              description="Créez une session, affichez le QR code pendant votre live. Vos clients scannent et commandent."
              delay={0}
            />
            <FeatureCard
              icon="stock"
              title="Stock en temps réel"
              description="Le stock se met à jour automatiquement à chaque validation de commande. Zéro survente."
              delay={100}
            />
            <FeatureCard
              icon="orders"
              title="Commandes centralisées"
              description="Recevez toutes vos commandes dans un seul endroit. Appelez, validez, encaissez."
              delay={200}
            />
            <FeatureCard
              icon="delivery"
              title="Livraison flexible"
              description="Offrez la livraison gratuite ou facturez-la. Vous gardez le contrôle total."
              delay={300}
            />
            <FeatureCard
              icon="chart"
              title="Chiffre d'affaires"
              description="Suivez vos ventes en direct, par session, par produit, par période."
              delay={400}
            />
            <FeatureCard
              icon="mobile"
              title="Mobile-first"
              description="Pensé pour le téléphone. Vos clients commandent en 3 clics, sans installer d'app."
              delay={500}
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/aide-vendeur"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Voir le guide complet du vendeur
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
          CTA FINAL
          ============================================ */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 rounded-[2.5rem] p-8 sm:p-16 text-center overflow-hidden shadow-2xl animate-gradient">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float delay-500" />

            <div className="absolute top-8 left-12 w-1 h-1 rounded-full bg-white/80 animate-pulse" />
            <div className="absolute top-20 right-20 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse delay-300" />
            <div className="absolute bottom-16 left-1/4 w-1 h-1 rounded-full bg-white/80 animate-pulse delay-700" />
            <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse delay-1000" />

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Prêt à vendre plus ?
              </h2>
              <p className="text-indigo-100 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
                Rejoignez les vendeurs qui utilisent LiveShop pour
                transformer leurs lives en véritable business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link
                  href="/inscription"
                  className="group inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-4 rounded-2xl hover:bg-indigo-50 hover:shadow-2xl active:scale-95 transition-all btn-shine"
                >
                  Commencer gratuitement
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  href="https://unitech-qvgo.onrender.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition-all border border-white/20"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ✅ PARTAGER LIVESHOP — QR CODE
          ============================================ */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 overflow-hidden relative">
            {/* Blob décoratif */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* En-tête */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Partager LiveShop
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Faites découvrir la plateforme
                </h2>
                <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
                  Partagez ce QR code ou ce lien avec vos amis, votre
                  famille ou sur vos réseaux sociaux.
                </p>
              </div>

              {/* QR Code + Liens */}
              <ShareQRCode />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  LiveShop
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                La plateforme de live selling pensée pour l'Afrique
                francophone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                Produit
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/inscription"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Créer une boutique
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/connexion"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Se connecter
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mes-commandes"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Mes commandes
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Mot de passe oublié
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                Aide
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/aide"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Centre d'aide
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aide-vendeur"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Guide vendeur
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aide-client"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Guide client
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                UNITECH
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Site officiel
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Nos services
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Assistant IA
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://unitech-qvgo.onrender.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 group"
                  >
                    Contact
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:doumbialayesoma@gmail.com"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors break-all"
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

          <div className="border-t border-slate-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} LiveShop. Tous droits
              réservés.
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              Développé avec ❤️ par
              <Link
                href="https://unitech-qvgo.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gradient hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                UNITECH
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ============================================
   COMPOSANTS
   ============================================ */
function UnitechServiceCard({
  title,
  description,
  icon,
  delay = 0,
}: {
  title: string
  description: string
  icon: 'web' | 'ai' | 'iot' | 'training'
  delay?: number
}) {
  return (
    <div
      className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <UnitechIcon name={icon} />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
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
  const cls = 'w-5 h-5 text-indigo-300'
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

function StatItem({
  value,
  label,
  delay = 0,
}: {
  value: string
  label: string
  delay?: number
}) {
  return (
    <div
      className="text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-gradient-light">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: 'qr' | 'stock' | 'orders' | 'delivery' | 'chart' | 'mobile'
  title: string
  description: string
  delay?: number
}) {
  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 card-3d animate-fade-in-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/50 to-violet-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
          <FeatureIcon name={icon} />
        </div>
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function FeatureIcon({
  name,
}: {
  name: 'qr' | 'stock' | 'orders' | 'delivery' | 'chart' | 'mobile'
}) {
  const cls = 'w-6 h-6 text-white'
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