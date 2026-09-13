import Link from 'next/link'

export const metadata = {
  title: "Guide du client — LiveShop",
  description:
    "Comment commander sur LiveShop : scan du QR code, choix des produits, suivi de commande et paiement.",
}

export default function AideClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-slate-900">LiveShop</span>
          </Link>

          <Link
            href="/aide-vendeur"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            Aide vendeur
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -top-10 -right-20 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl animate-float delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Guide client
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight animate-fade-in-up delay-100">
            Commander en
            <br />
            <span className="text-gradient">3 clics</span>
          </h1>

          <p className="text-slate-500 mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Aucune application à installer. Aucun compte à créer. Juste
            un lien à ouvrir et un panier à remplir.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-in-up delay-300">
            <Link
              href="/mes-commandes"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-6 py-4 rounded-2xl hover:bg-emerald-700 hover:shadow-xl active:scale-95 transition-all"
            >
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Suivre mes commandes
            </Link>
            <Link
              href="#etapes"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Comment commander
            </Link>
          </div>
        </div>
      </section>

      {/* RASSURANCE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ReassuranceCard
            icon="shield"
            title="Vendeurs vérifiés"
            text="Chaque boutique affiche le nom, le logo et le numéro du vendeur."
            color="emerald"
          />
          <ReassuranceCard
            icon="cash"
            title="Paiement à la livraison"
            text="Vous payez quand vous recevez votre commande. Jamais avant."
            color="indigo"
          />
          <ReassuranceCard
            icon="check"
            title="Aucune app à installer"
            text="Un lien à ouvrir, un panier à remplir. C'est tout."
            color="amber"
          />
        </div>
      </section>

      {/* ÉTAPES */}
      <section id="etapes" className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comment commander ?
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            4 étapes simples, sans compte et sans application.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex items-start gap-5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                <span className="text-white font-black text-lg">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-900">
                  {step.title}
                </h3>
                <div className="text-sm text-slate-600 mt-2 leading-relaxed space-y-2">
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUIVI DE COMMANDE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Suivez votre commande
                <br />
                en temps réel
              </h2>
              <p className="text-emerald-100 mt-4 leading-relaxed">
                Votre historique de commandes est stocké sur votre
                téléphone. Vous pouvez suivre chaque commande jusqu'à la
                livraison.
              </p>

              <Link
                href="/mes-commandes"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-50 active:scale-95 transition-all mt-6"
              >
                Voir mes commandes
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

            {/* Statuts */}
            <div className="space-y-3">
              <StatusDemo
                color="amber"
                label="En attente"
                description="Le vendeur n'a pas encore confirmé"
              />
              <StatusDemo
                color="emerald"
                label="Confirmée"
                description="Le vendeur a validé, elle arrive"
              />
              <StatusDemo
                color="slate"
                label="Livrée"
                description="Vous l'avez reçue"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Questions fréquentes
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Tout ce que vous devez savoir avant de commander.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
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
   COMPOSANTS
   ============================================ */
function ReassuranceCard({
  icon,
  title,
  text,
  color,
}: {
  icon: string
  title: string
  text: string
  color: 'emerald' | 'indigo' | 'amber'
}) {
  const colors = {
    emerald: 'from-emerald-500 to-teal-600',
    indigo: 'from-indigo-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600',
  }

  const iconPaths: Record<string, string> = {
    shield:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    cash: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg mb-3`}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={iconPaths[icon]}
          />
        </svg>
      </div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  )
}

function StatusDemo({
  color,
  label,
  description,
}: {
  color: 'amber' | 'emerald' | 'slate'
  label: string
  description: string
}) {
  const colors = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-slate-500',
  }

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 flex items-center gap-3">
      <div className="relative shrink-0">
        <div
          className={`w-3 h-3 rounded-full ${colors[color]} animate-pulse`}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-emerald-100 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
      <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 pr-4">
          {question}
        </h3>
        <div className="w-8 h-8 rounded-xl bg-slate-100 group-open:bg-emerald-500 flex items-center justify-center shrink-0 transition-colors">
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
const STEPS = [
  {
    title: 'Scannez le QR code ou cliquez sur le lien',
    content: (
      <>
        <p>
          Pendant un live, le vendeur affiche un <strong>QR code</strong>{' '}
          ou partage un <strong>lien</strong>. Ouvrez-le avec votre
          téléphone.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          💡 Pas besoin d&apos;installer une application. Ça s&apos;ouvre
          directement dans votre navigateur.
        </p>
      </>
    ),
  },
  {
    title: 'Choisissez vos articles',
    content: (
      <>
        <p>
          Vous voyez tous les produits disponibles. Cliquez sur un
          produit pour voir ses <strong>variantes</strong> (taille,
          couleur) et son <strong>prix</strong>.
        </p>
        <p className="mt-2">
          Ajoutez au panier ce qui vous intéresse.
        </p>
      </>
    ),
  },
  {
    title: 'Remplissez vos coordonnées',
    content: (
      <>
        <p>
          Cliquez sur <strong>« Voir le panier »</strong>, puis
          remplissez :
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Votre nom complet</li>
          <li>Votre numéro de téléphone</li>
          <li>Votre quartier</li>
          <li>Le mode de récupération (domicile, point de retrait, express)</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Confirmez votre commande',
    content: (
      <>
        <p>
          Cliquez sur <strong>« Envoyer ma commande »</strong>. C&apos;est
          fait !
        </p>
        <p className="mt-2">
          Le vendeur va vous <strong>appeler</strong> pour confirmer la
          commande et vous communiquer les frais de livraison (si
          applicables).
        </p>
        <p className="mt-2 text-xs text-slate-500">
          💵 Vous payez à la réception de votre commande.
        </p>
      </>
    ),
  },
]

const FAQ = [
  {
    q: 'Dois-je créer un compte ?',
    a: "Non. Vous n'avez aucun compte à créer. Vous remplissez juste un petit formulaire avec votre nom et votre téléphone pour que le vendeur puisse vous appeler.",
  },
  {
    q: 'Dois-je installer une application ?',
    a: "Non, jamais. Tout se passe dans votre navigateur. Le lien ou le QR code ouvre directement la boutique du vendeur.",
  },
  {
    q: 'Quand est-ce que je paie ?',
    a: "Vous payez quand vous recevez votre commande (paiement à la livraison). Vous pouvez aussi payer par mobile money si le vendeur vous le propose, mais jamais avant d'avoir validé avec lui.",
  },
  {
    q: 'Comment savoir si le vendeur est fiable ?',
    a: "Chaque boutique affiche le nom du vendeur, son logo, son adresse, ses années d'expérience et son numéro de téléphone. Vous pouvez l'appeler avant de commander pour vous rassurer.",
  },
  {
    q: 'Puis-je annuler une commande ?',
    a: "Oui. Si vous changez d'avis, vous pouvez dire au vendeur quand il vous appelle. Ou ne répondez pas à son appel — la commande sera automatiquement annulée après 48h.",
  },
  {
    q: 'Que se passe-t-il si je ne reçois pas ma commande ?',
    a: "Vous pouvez rappeler le vendeur directement sur le numéro affiché sur sa page. En cas de problème persistant, contactez-nous à doumbialayesoma@gmail.com.",
  },
  {
    q: 'Comment suivre ma commande ?',
    a: "Après avoir commandé, allez sur la page « Mes commandes » (lien en haut de la boutique). Vous verrez l'évolution : en attente, confirmée, livrée.",
  },
  {
    q: 'Mes données sont-elles en sécurité ?',
    a: "Nous ne stockons que votre nom, téléphone et quartier — uniquement pour que le vendeur vous contacte. Aucun paiement n'est effectué sur notre plateforme.",
  },
  {
    q: 'Puis-je commander chez plusieurs vendeurs ?',
    a: "Oui. Chaque vendeur a sa propre boutique. Vous pouvez commander chez plusieurs vendeurs en même temps. Vos commandes apparaîtront toutes dans « Mes commandes ».",
  },
  {
    q: 'Que faire si le vendeur ne répond pas ?',
    a: "Attendez 24-48h et rappelez-le. Si toujours rien, envoyez-nous un email à doumbialayesoma@gmail.com avec le nom de la boutique et votre numéro de commande.",
  },
]