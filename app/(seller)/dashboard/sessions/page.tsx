import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SessionCard from '@/components/seller/SessionCard'

export default async function SessionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('id, slug')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  // 1. Sessions
  const { data: sessions } = await supabase
    .from('publication_sessions')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  // 2. Comptes séparés
  const sessionIds = (sessions ?? []).map((s) => s.id)
  const productCountMap: Record<string, number> = {}
  const orderCountMap: Record<string, number> = {}

  if (sessionIds.length > 0) {
    const { data: sp } = await supabase
      .from('session_products')
      .select('session_id')
      .in('session_id', sessionIds)

    sp?.forEach((row) => {
      productCountMap[row.session_id] =
        (productCountMap[row.session_id] ?? 0) + 1
    })

    const { data: ord } = await supabase
      .from('orders')
      .select('session_id')
      .in('session_id', sessionIds)

    ord?.forEach((row) => {
      if (row.session_id) {
        orderCountMap[row.session_id] =
          (orderCountMap[row.session_id] ?? 0) + 1
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Sessions de publication
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Créez des sessions pour vos lives et partagez le lien à
            votre audience.
          </p>
        </div>
        <Link
          href="/dashboard/sessions/nouvelle"
          className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouvelle session
        </Link>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              1. Créez une session · 2. Affichez le QR code pendant
              votre live · 3. Vos clients scannent et commandent.
            </p>
          </div>
        </div>
      </div>

      {!sessions || sessions.length === 0 ? (
        <EmptySessions />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              shopSlug={shop.slug}
              productCount={productCountMap[session.id] ?? 0}
              orderCount={orderCountMap[session.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptySessions() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        Aucune session pour le moment
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Créez votre première session de vente en direct et partagez
        le lien à vos clients.
      </p>
      <Link
        href="/dashboard/sessions/nouvelle"
        className="inline-flex items-center gap-2 mt-5 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Créer ma première session
      </Link>
    </div>
  )
}