import Link from 'next/link'

export const metadata = {
  title: "Guide du vendeur — LiveShop",
  description:
    "Apprenez à utiliser LiveShop : création de compte, ajout de produits, sessions de vente, QR codes et gestion des commandes.",
}

export default function AideVendeurPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-slate-900">LiveShop</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/aide-client"
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Aide client
            </Link>
            <Link
              href="/inscription"
              className="text-sm font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
            >
              Créer ma boutique
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -top-10 -right-20 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl animate-float delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Guide vendeur
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight animate-fade-in-up delay-100">
            Votre boutique en ligne
            <br />
            <span className="text-gradient">en 5 minutes</span>
          </h1>

          <p className="text-slate-500 mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Tout ce qu'il faut savoir pour créer votre boutique, gérer
            vos produits et recevoir vos premières commandes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-in-up delay-300">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-4 rounded-2xl hover:bg-slate-800 hover:shadow-xl active:scale-95 transition-all btn-shine"
            >
              Commencer maintenant
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
              href="#etapes"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Voir les étapes
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SOMMAIRE
          ============================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Sommaire
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 transition-colors">
                  <span className="text-xs font-black text-indigo-600 group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ÉTAPES
          ============================================ */}
      <section id="etapes" className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-12">
          {SECTIONS.map((section, sectionIndex) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              {/* Titre section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                  <span className="text-white font-black text-lg">
                    {sectionIndex + 1}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* Contenu */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
                {section.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-600">
                        {stepIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <div className="text-sm text-slate-600 mt-1 leading-relaxed space-y-2">
                        {step.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Astuce */}
                {section.tip && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                        Astuce
                      </p>
                      <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                        {section.tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          FAQ
          ============================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Questions fréquentes
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Les réponses aux questions que se posent les vendeurs.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* ============================================
          CTA CONTACT
          ============================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-black">
              Besoin d'aide ?
            </h2>
            <p className="text-slate-300 mt-3 max-w-lg mx-auto">
              Notre équipe est disponible pour vous accompagner dans
              votre lancement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="mailto:doumbialayesoma@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-100 active:scale-95 transition-all"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Envoyer un email
              </a>
              <a
                href="https://wa.me/22390692363"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/20 active:scale-95 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>

            <p className="text-xs text-slate-400 mt-6">
              Réponse en moins de 24h
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} LiveShop · Développé par
            UNITECH
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
      <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 pr-4">
          {question}
        </h3>
        <div className="w-8 h-8 rounded-xl bg-slate-100 group-open:bg-slate-900 flex items-center justify-center shrink-0 transition-colors">
          <svg
            className="w-4 h-4 text-slate-600 group-open:text-white group-open:rotate-45 transition-all"
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
        </div>
      </summary>
      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
        {answer}
      </div>
    </details>
  )
}

/* ============================================
   DONNÉES
   ============================================ */
const SECTIONS = [
  {
    id: 'compte',
    title: 'Créer votre compte',
    subtitle: 'Moins de 2 minutes',
    steps: [
      {
        title: 'Aller sur la page d\'inscription',
        content: (
          <p>
            Rendez-vous sur <strong>liveshop-dusky.vercel.app</strong> et
            cliquez sur <strong>« Créer ma boutique »</strong>.
          </p>
        ),
      },
      {
        title: 'Remplir le formulaire',
        content: (
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Nom complet</strong> : votre vrai nom
            </li>
            <li>
              <strong>Email</strong> : une adresse valide
            </li>
            <li>
              <strong>Mot de passe</strong> : 6 caractères minimum
            </li>
          </ul>
        ),
      },
      {
        title: 'Valider',
        content: (
          <p>
            Cliquez sur <strong>« Créer mon compte »</strong>. Vous serez
            redirigé vers la création de votre boutique.
          </p>
        ),
      },
    ],
    tip: 'Notez votre mot de passe quelque part de sûr. Vous en aurez besoin à chaque connexion.',
  },
  {
    id: 'boutique',
    title: 'Créer votre boutique',
    subtitle: 'Nom, lien et description',
    steps: [
      {
        title: 'Choisir un nom',
        content: (
          <p>
            Par exemple : <strong>« Fatima Boutique »</strong>. C'est ce
            nom qui apparaîtra à vos clients.
          </p>
        ),
      },
      {
        title: 'Choisir votre lien (slug)',
        content: (
          <>
            <p>
              Le lien doit être en <strong>minuscules</strong>, sans
              espaces ni accents.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2 font-mono text-xs space-y-1">
              <p className="text-emerald-600">
                ✅ fatima-boutique
              </p>
              <p className="text-emerald-600">
                ✅ mode-dakar
              </p>
              <p className="text-red-500">
                ❌ Fatima Boutique
              </p>
              <p className="text-red-500">
                ❌ Mode@Dakar
              </p>
            </div>
          </>
        ),
      },
      {
        title: 'Ajouter description et téléphone',
        content: (
          <p>
            La description et le téléphone rassurent les clients. Le
            téléphone leur permet de vous appeler pour confirmer.
          </p>
        ),
      },
      {
        title: 'Cliquer sur « Créer ma boutique »',
        content: (
          <p>
            Bienvenue sur votre dashboard ! Vous pouvez maintenant
            ajouter des produits.
          </p>
        ),
      },
    ],
    tip: 'Votre lien ne pourra plus être changé après création. Choisissez-le bien.',
  },
  {
    id: 'personnaliser',
    title: 'Personnaliser votre boutique',
    subtitle: 'Logo, adresse, réseaux sociaux',
    steps: [
      {
        title: 'Aller dans Paramètres',
        content: (
          <p>
            Dans le menu à gauche, cliquez sur{' '}
            <strong>« Paramètres »</strong>.
          </p>
        ),
      },
      {
        title: 'Ajouter un logo',
        content: (
          <p>
            Cliquez sur le carré en pointillés ou glissez une image.
            Format carré conseillé, max 25 Mo. Le système la compresse
            automatiquement.
          </p>
        ),
      },
      {
        title: 'Remplir les informations',
        content: (
          <ul className="list-disc list-inside space-y-1">
            <li>Adresse et ville</li>
            <li>WhatsApp, Instagram, TikTok</li>
            <li>Horaires d&apos;ouverture</li>
            <li>Politique de retour et livraison</li>
          </ul>
        ),
      },
      {
        title: 'Enregistrer',
        content: (
          <p>
            Cliquez sur{' '}
            <strong>« Enregistrer les modifications »</strong>.
          </p>
        ),
      },
    ],
    tip: 'Un logo et une description complète rassurent énormément les nouveaux clients.',
  },
  {
    id: 'produits',
    title: 'Ajouter vos produits',
    subtitle: 'Photos, prix, variantes',
    steps: [
      {
        title: 'Aller dans Produits',
        content: (
          <p>
            Dans le menu, cliquez sur <strong>« Produits »</strong> puis
            sur <strong>« Nouveau produit »</strong>.
          </p>
        ),
      },
      {
        title: 'Remplir les informations',
        content: (
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Nom</strong> : ex. « Robe Wax »
            </li>
            <li>
              <strong>Description</strong> : matières, dimensions,
              tailles
            </li>
            <li>
              <strong>Prix de base</strong> : en FCFA
            </li>
          </ul>
        ),
      },
      {
        title: 'Ajouter 3 à 5 photos',
        content: (
          <>
            <p>
              Cliquez sur la zone de drop ou glissez vos photos. Le
              système les compresse automatiquement.
            </p>
            <p className="mt-2">
              <strong>Conseils photo :</strong> fond neutre, lumière
              naturelle, plusieurs angles.
            </p>
          </>
        ),
      },
      {
        title: 'Ajouter des variantes',
        content: (
          <>
            <p>
              Les variantes sont les options : marque, prix, matière.
            </p>
            <p className="mt-2">
              Pour chaque variante, indiquez un <strong>nom</strong>, un{' '}
              <strong>prix</strong> et un <strong>stock</strong>.
            </p>
          </>
        ),
      },
      {
        title: 'Variantes standard',
        content: (
          <>
            <p>
             La Variante standard est la version de base du produit. Vous pouvez ajouter d'autres variantes si nécessaire.
            </p>
            <p className="mt-2">
              Faut reseigner <strong>nom</strong>, un{' '}
              <strong>prix</strong> et un <strong>stock</strong>.
            </p>
          </>
        ),
      },
      {
        title: 'Créer le produit',
        content: (
          <p>
            Cochez <strong>« Produit actif »</strong> et cliquez sur{' '}
            <strong>« Créer le produit »</strong>.
          </p>
        ),
      },
    ],
    tip: 'Ajoutez au moins 5 produits avant votre premier live. Les clients aiment avoir le choix.',
  },
  {
    id: 'session',
    title: 'Créer une session de vente',
    subtitle: 'Pour chaque live',
    steps: [
      {
        title: 'Aller dans Sessions',
        content: (
          <p>
            Dans le menu, cliquez sur <strong>« Sessions »</strong> puis
            sur <strong>« Nouvelle session »</strong>.
          </p>
        ),
      },
      {
        title: 'Nommer votre session',
        content: (
          <p>
            Par exemple : <strong>« Live du 15 juin - Nouveautés »</strong>.
            Ce nom aide vos clients à s&apos;y retrouver.
          </p>
        ),
      },
      {
        title: 'Sélectionner les produits',
        content: (
          <p>
            Cochez les produits que vous allez présenter pendant le live.
            Choisissez-en 5 à 15 pour que ce soit clair.
          </p>
        ),
      },
      {
        title: 'Activer la session',
        content: (
          <p>
            Cochez <strong>« Session active »</strong> sinon vos clients
            ne la verront pas.
          </p>
        ),
      },
    ],
    tip: 'Ne mettez pas tous vos produits dans une session. Concentrez l\'attention sur quelques articles.',
  },
  {
    id: 'qr',
    title: 'Récupérer votre lien et QR code',
    subtitle: 'Le cœur de votre live',
    steps: [
      {
        title: 'Copier le lien de session',
        content: (
          <>
            <p>
              Après création, vous verrez le lien de votre session :
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2 font-mono text-xs break-all">
              liveshop-dusky.vercel.app/fatima-boutique/session/live-du-15-juin
            </div>
            <p className="mt-2">
              Cliquez sur <strong>« Copier »</strong>.
            </p>
          </>
        ),
      },
      {
        title: 'Télécharger le QR code',
        content: (
          <p>
            À droite, cliquez sur{' '}
            <strong>« Télécharger le QR code »</strong>. Un fichier PNG
            est enregistré dans vos photos.
          </p>
        ),
      },
      {
        title: 'Partager pendant le live',
        content: (
          <>
            <p>
              <strong>Pendant votre live :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                Affichez le QR code à l&apos;écran (partage d&apos;écran)
              </li>
              <li>
                Collez le lien en commentaire épinglé
              </li>
              <li>Répétez toutes les 5 minutes</li>
            </ul>
          </>
        ),
      },
    ],
    tip: 'Affichez le QR code au moins 30 secondes au début, puis régulièrement. Certains clients ont besoin de temps pour scanner.',
  },
  {
    id: 'commandes',
    title: 'Gérer les commandes',
    subtitle: 'Réception, validation, livraison',
    steps: [
      {
        title: 'Recevoir les notifications',
        content: (
          <p>
            Dès qu&apos;un client commande, vous recevez une notification
            dans le dashboard (cloche en haut à droite avec badge rouge).
          </p>
        ),
      },
      {
        title: 'Appeler le client',
        content: (
          <p>
            Ouvrez la commande et cliquez sur <strong>« Appeler »</strong>.
            Vérifiez le produit, la variante, le quartier et les frais de
            livraison.
          </p>
        ),
      },
      {
        title: 'Valider la commande',
        content: (
          <p>
            Une fois confirmée, cliquez sur{' '}
            <strong>« Valider la commande »</strong>. Le stock est
            automatiquement décrémenté et le CA est mis à jour.
          </p>
        ),
      },
      {
        title: 'Marquer comme livrée',
        content: (
          <p>
            Après livraison, cliquez sur{' '}
            <strong>« Marquer comme livrée »</strong>. La commande est
            automatiquement marquée comme payée.
          </p>
        ),
      },
      {
        title: 'Si le client ne répond pas',
        content: (
          <p>
            Attendez 24-48h, rappelez, puis cliquez sur{' '}
            <strong>« Annuler »</strong>. Le stock est restauré
            automatiquement.
          </p>
        ),
      },
    ],
    tip: 'Appelez toujours le client avant de valider. Cela évite les commandes fantômes.',
  },
  {
    id: 'statistiques',
    title: 'Suivre votre activité',
    subtitle: 'Chiffre d\'affaires et performances',
    steps: [
      {
        title: 'Voir vos statistiques',
        content: (
          <p>
            Dans le menu, cliquez sur <strong>« Statistiques »</strong>.
            Vous verrez vos visiteurs, commandes, CA et taux de
            conversion.
          </p>
        ),
      },
      {
        title: 'Analyser les graphiques',
        content: (
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Trafic et commandes</strong> : évolution sur 30
              jours
            </li>
            <li>
              <strong>Évolution des commandes</strong> : par jour, mois
              ou année
            </li>
            <li>
              <strong>Performance par session</strong> : quelle session
              a marché
            </li>
          </ul>
        ),
      },
    ],
    tip: 'Si une session marche mieux que les autres, refaites le même format de live.',
  },
]

const FAQ = [
  {
    q: 'Combien ça coûte ?',
    a: "LiveShop propose un plan gratuit pour commencer, sans engagement. Vous ne payez que lorsque vous vendez plus. Aucun frais caché.",
  },
  {
    q: 'Mes clients doivent-ils installer une application ?',
    a: "Non, jamais. Vos clients cliquent sur un lien ou scannent un QR code, et commandent en 3 clics. Aucune installation, aucun compte à créer.",
  },
  {
    q: 'Est-ce que je dois quitter TikTok ?',
    a: "Non, surtout pas. Vous continuez à faire vos lives sur TikTok comme avant. LiveShop gère les commandes en arrière-plan, invisible pour vos spectateurs.",
  },
  {
    q: 'Comment mes clients me paient-ils ?',
    a: "Vous gardez le contrôle total. Les clients paient à la livraison (en espèces) ou par mobile money si vous l'acceptez. LiveShop ne touche jamais votre argent.",
  },
  {
    q: 'Que se passe-t-il si un client ne répond pas ?',
    a: "Vous pouvez annuler la commande à tout moment. Le stock est automatiquement restauré. Vous ne perdez rien.",
  },
  {
    q: 'Combien de produits puis-je ajouter ?',
    a: "Il n'y a pas de limite. Ajoutez autant de produits que vous voulez, avec autant de variantes que nécessaire.",
  },
  {
    q: 'Le lien de ma boutique peut-il changer ?',
    a: "Non. Une fois choisi, il reste définitif pour ne pas casser les liens que vous avez déjà partagés. Choisissez-le bien au départ.",
  },
  {
    q: 'Est-ce que ça marche sur téléphone ?',
    a: "Oui, LiveShop est pensé mobile-first. Vous pouvez tout gérer depuis votre téléphone, pendant votre live.",
  },
  {
    q: 'Combien de temps prend la mise en place ?',
    a: "Environ 15 minutes pour créer votre compte, ajouter 5 produits et créer votre première session. Ensuite, chaque nouveau produit prend 5 minutes.",
  },
  {
    q: 'Puis-je utiliser le système pour plusieurs boutiques ?',
    a: "Actuellement, un compte = une boutique. Si vous voulez gérer plusieurs boutiques, contactez-nous pour une solution adaptée.",
  },
]