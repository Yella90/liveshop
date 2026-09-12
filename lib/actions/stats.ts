'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

async function getShop(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('shops')
    .select('id, name, slug')
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

export async function getSellerStats(days = 30) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const shop = await getShop(user.id)
  if (!shop) return { error: 'Boutique introuvable' }

  const [visitors, sessions, orders, months, years] = await Promise.all([
    supabase.rpc('get_visitors_by_day', {
      p_shop_id: shop.id,
      p_days: days,
    }),
    supabase.rpc('get_visitors_by_session', {
      p_shop_id: shop.id,
      p_days: days,
    }),
    supabase.rpc('get_orders_by_day', {
      p_shop_id: shop.id,
      p_days: days,
    }),
    supabase.rpc('get_orders_by_month', {
      p_shop_id: shop.id,
      p_months: 12,
    }),
    supabase.rpc('get_orders_by_year', {
      p_shop_id: shop.id,
      p_years: 5,
    }),
  ])

  // Totaux
  const totalVisits = visitors.data?.reduce(
    (s: number, v: any) => s + Number(v.total_visits || 0),
    0
  ) ?? 0
  const totalUnique = visitors.data?.reduce(
    (s: number, v: any) => s + Number(v.unique_visitors || 0),
    0
  ) ?? 0
  const totalOrders = orders.data?.reduce(
    (s: number, o: any) => s + Number(o.order_count || 0),
    0
  ) ?? 0
  const totalRevenue = orders.data?.reduce(
    (s: number, o: any) => s + Number(o.revenue || 0),
    0
  ) ?? 0

  // Taux de conversion
  const conversionRate =
    totalUnique > 0 ? (totalOrders / totalUnique) * 100 : 0

  return {
    success: true,
    shop,
    visitors: visitors.data ?? [],
    sessions: sessions.data ?? [],
    ordersByDay: orders.data ?? [],
    ordersByMonth: months.data ?? [],
    ordersByYear: years.data ?? [],
    totals: {
      totalVisits,
      totalUnique,
      totalOrders,
      totalRevenue,
      conversionRate,
    },
  }
}