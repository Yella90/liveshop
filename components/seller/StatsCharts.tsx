'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Stats = {
  shop: { id: string; name: string; slug: string }
  visitors: any[]
  sessions: any[]
  ordersByDay: any[]
  ordersByMonth: any[]
  ordersByYear: any[]
  totals: {
    totalVisits: number
    totalUnique: number
    totalOrders: number
    totalRevenue: number
    conversionRate: number
  }
}

type Period = 'day' | 'month' | 'year'

type ChartDataPoint = {
  label: string
  orders: number
  revenue: number
}

export default function StatsCharts({ stats }: { stats: Stats }) {
  const [period, setPeriod] = useState<Period>('day')

  // Fusion visiteurs + commandes par jour
  const mergedByDay = stats.visitors.map((v) => {
    const dayOrders = stats.ordersByDay.find((o) => o.date === v.date)
    return {
      date: v.date,
      visits: Number(v.total_visits),
      visitors: Number(v.unique_visitors),
      orders: Number(dayOrders?.order_count || 0),
      revenue: Number(dayOrders?.revenue || 0),
    }
  })

  stats.ordersByDay.forEach((o) => {
    if (!mergedByDay.find((m) => m.date === o.date)) {
      mergedByDay.push({
        date: o.date,
        visits: 0,
        visitors: 0,
        orders: Number(o.order_count),
        revenue: Number(o.revenue),
      })
    }
  })

  mergedByDay.sort((a, b) => a.date.localeCompare(b.date))

  const barChartData: ChartDataPoint[] =
    period === 'day'
      ? mergedByDay.map((d) => ({
          label: d.date,
          orders: d.orders,
          revenue: d.revenue,
        }))
      : period === 'month'
        ? stats.ordersByMonth.map((m) => ({
            label: m.month,
            orders: Number(m.order_count),
            revenue: Number(m.revenue),
          }))
        : stats.ordersByYear.map((y) => ({
            label: String(y.year),
            orders: Number(y.order_count),
            revenue: Number(y.revenue),
          }))

  return (
    <div className="space-y-6">
      {/* Cartes de synthèse */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Visiteurs uniques"
          value={stats.totals.totalUnique.toLocaleString('fr-FR')}
          sublabel={`${stats.totals.totalVisits.toLocaleString(
            'fr-FR'
          )} visites`}
          gradient="from-indigo-500 to-violet-600"
          icon="users"
          delay={0}
        />
        <StatCard
          label="Commandes"
          value={stats.totals.totalOrders.toLocaleString('fr-FR')}
          sublabel="30 derniers jours"
          gradient="from-emerald-500 to-emerald-700"
          icon="orders"
          delay={100}
        />
        <StatCard
          label="Chiffre d'affaires"
          value={stats.totals.totalRevenue.toLocaleString('fr-FR')}
          sublabel="FCFA"
          gradient="from-amber-500 to-orange-600"
          icon="revenue"
          delay={200}
        />
        <StatCard
          label="Taux de conversion"
          value={`${stats.totals.conversionRate.toFixed(1)}%`}
          sublabel="Commandes / visiteurs"
          gradient="from-rose-500 to-pink-600"
          icon="chart"
          delay={300}
        />
      </div>

      {/* Courbe visiteurs + commandes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Trafic et commandes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Évolution sur les 30 derniers jours
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Visiteurs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Commandes
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-80 -ml-4">
          {mergedByDay.length === 0 ? (
            <EmptyChart message="Aucune donnée de trafic pour le moment" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mergedByDay}>
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6366f1"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorOrders"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val: any) => {
                    const d = new Date(String(val))
                    return `${d.getDate()}/${d.getMonth() + 1}`
                  }}
                  stroke="#cbd5e1"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                  }}
                  labelFormatter={(val: any) =>
                    new Date(String(val)).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visiteurs uniques"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorVisitors)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Commandes"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Évolution des commandes par période */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Évolution des commandes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nombre de commandes et chiffre d&apos;affaires
            </p>
          </div>

          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            {(['day', 'month', 'year'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  period === p
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {p === 'day' ? 'Jour' : p === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 sm:h-80 -ml-4">
          {barChartData.length === 0 ? (
            <EmptyChart message="Aucune commande sur cette période" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val: any) => {
                    if (period === 'day') {
                      const d = new Date(String(val))
                      return `${d.getDate()}/${d.getMonth() + 1}`
                    }
                    if (period === 'month') {
                      const [y, m] = String(val).split('-')
                      return `${m}/${y.slice(2)}`
                    }
                    return String(val)
                  }}
                  stroke="#cbd5e1"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Chiffre d\'affaires') {
                      return [
                        `${Number(value).toLocaleString('fr-FR')} FCFA`,
                        name,
                      ]
                    }
                    return [value, name]
                  }}
                />
                <Bar
                  dataKey="orders"
                  name="Commandes"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Visiteurs par session */}
      {stats.sessions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Performance par session
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Visiteurs uniques sur chaque live
          </p>

          <div className="space-y-3">
            {stats.sessions.filter((s: any) => s.total_visits > 0).length ===
            0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                Aucune visite enregistrée sur vos sessions
              </p>
            ) : (
              stats.sessions
                .filter((s: any) => s.total_visits > 0)
                .map((s: any) => {
                  const max = Math.max(
                    ...stats.sessions.map(
                      (x: any) => x.unique_visitors || 0
                    )
                  )
                  const width =
                    max > 0
                      ? ((s.unique_visitors || 0) / max) * 100
                      : 0

                  return (
                    <div key={s.session_id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {s.session_name}
                        </p>
                        <p className="text-xs text-slate-500 shrink-0 ml-2">
                          {s.unique_visitors} visiteurs · {s.total_visits}{' '}
                          vues
                        </p>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================
   StatCard
   ============================================ */
function StatCard({
  label,
  value,
  sublabel,
  gradient,
  icon,
  delay = 0,
}: {
  label: string
  value: string
  sublabel: string
  gradient: string
  icon: 'users' | 'orders' | 'revenue' | 'chart'
  delay?: number
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-3`}
      >
        <Icon name={icon} />
      </div>
      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 truncate">
        {value}
      </p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>
    </div>
  )
}

/* ============================================
   EmptyChart
   ============================================ */
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <svg
          className="w-7 h-7 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

/* ============================================
   Icon
   ============================================ */
function Icon({ name }: { name: string }) {
  const cls = 'w-5 h-5 text-white'
  if (name === 'users')
    return (
      <svg
        className={cls}
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
    )
  if (name === 'orders')
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    )
  if (name === 'revenue')
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  return (
    <svg
      className={cls}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  )
}