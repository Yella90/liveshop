import Link from 'next/link'

export const metadata = {
  title: "Aide — LiveShop",
}

export default function AidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Comment pouvons-nous <span className="text-gradient">vous aider</span> ?
          </h1>
          <p className="text-slate-500 mt-4">
            Choisissez votre profil pour accéder au guide adapté.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/aide-client"
            className="group bg-white rounded-3xl border border-slate-200 p-8 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Je suis client</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Comment commander, suivre ma commande et payer à la livraison.
            </p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 mt-4">
              Voir le guide client
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          <Link
            href="/aide-vendeur"
            className="group bg-white rounded-3xl border border-slate-200 p-8 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Je suis vendeur</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Créer ma boutique, ajouter mes produits, générer mes QR codes.
            </p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 mt-4">
              Voir le guide vendeur
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}