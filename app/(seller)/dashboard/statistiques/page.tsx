import { getSellerStats } from '@/lib/actions/stats'
import StatsCharts from '@/components/seller/StatsCharts'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Statistiques — LiveShop',
  description: 'Analysez les performances de votre boutique',
}

export default async function StatistiquesPage() {
  const stats = await getSellerStats(30)

  // Erreur (pas de boutique, pas connecté, etc.)
  if (!stats?.success) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-lg font-bold text-red-900">
            Impossible de charger les statistiques
          </h2>
          <p className="text-sm text-red-700 mt-1">
            {stats?.error || 'Une erreur est survenue.'}
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-5 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Statistiques
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Performance de {stats.shop.name}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Analyse des 30 derniers jours · liveshop.com/
            {stats.shop.slug}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/${stats.shop.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Voir ma boutique
          </Link>
        </div>
      </div>

      {/* Graphiques */}
      <StatsCharts stats={stats} />
    </div>
  )
}