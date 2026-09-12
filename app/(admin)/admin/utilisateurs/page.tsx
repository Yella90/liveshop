import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export default async function AdminUtilisateursPage() {
  const admin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: usersData } = await admin.auth.admin.listUsers({
    perPage: 200,
  })

  const supabase = await createClient()
  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, slug, user_id')

  const shopByUser = new Map(
    shops?.map((s) => [s.user_id, s]) ?? []
  )

  const users = usersData?.users ?? []

  const admins = users.filter(
    (u) => u.user_metadata?.role === 'admin'
  ).length
  const sellers = users.filter(
    (u) => (u.user_metadata?.role ?? 'seller') === 'seller'
  ).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} ·{' '}
          {sellers} vendeur{sellers > 1 ? 's' : ''} · {admins} admin
          {admins > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatBox
          label="Total utilisateurs"
          value={users.length}
          gradient="from-indigo-500 to-violet-600"
        />
        <StatBox
          label="Vendeurs"
          value={sellers}
          gradient="from-emerald-500 to-emerald-700"
        />
        <StatBox
          label="Administrateurs"
          value={admins}
          gradient="from-rose-500 to-pink-600"
        />
      </div>

      {/* Liste */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Tous les utilisateurs
          </h2>
        </div>
        <div className="divide-y divide-slate-800">
          {users.map((user) => {
            const shop = shopByUser.get(user.id)
            const role = user.user_metadata?.role ?? 'seller'
            const fullName =
              user.user_metadata?.full_name || 'Sans nom'

            return (
              <div
                key={user.id}
                className="p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-800/30 transition-colors"
              >
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-lg ${
                    role === 'admin'
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                  }`}
                >
                  {fullName.charAt(0).toUpperCase()}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white truncate">
                      {fullName}
                    </p>
                    {role === 'admin' && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                  {shop && (
                    <p className="text-xs text-slate-600 mt-0.5 truncate font-mono">
                      /{shop.slug}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Inscrit
                  </p>
                  <p className="text-xs font-semibold text-slate-300">
                    {new Date(user.created_at).toLocaleDateString(
                      'fr-FR',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  gradient,
}: {
  label: string
  value: number
  gradient: string
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-3`}
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </div>
  )
}