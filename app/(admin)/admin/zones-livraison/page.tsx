import { createClient } from '@/lib/supabase/server'

export default async function AdminZonesPage() {
  const supabase = await createClient()

  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Zones de livraison
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Configuration des zones et tarifs de livraison
        </p>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              À propos des zones
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Les zones de livraison déterminent les tarifs appliqués
              selon le quartier du client. Cette configuration sera
              utilisée pour calculer les frais de livraison.
            </p>
          </div>
        </div>
      </div>

      {/* Liste */}
      {!zones || zones.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
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
          </div>
          <h3 className="text-base font-bold text-white">
            Aucune zone configurée
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Les zones de livraison seront affichées ici une fois
            configurées dans la base de données.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {zones.map((zone: any) => (
              <div
                key={zone.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    {zone.name}
                  </p>
                  {zone.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {zone.description}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Tarif
                  </p>
                  <p className="text-sm font-bold text-white">
                    {Number(zone.base_fee).toLocaleString('fr-FR')}{' '}
                    FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}