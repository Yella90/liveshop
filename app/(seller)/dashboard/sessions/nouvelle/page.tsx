import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SessionForm from '@/components/seller/SessionForm'

export default async function NouvelleSessionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, base_price, images, product_variants(stock)')
    .eq('shop_id', shop.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/sessions"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour aux sessions
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Nouvelle session
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Créez une session pour votre prochain live.
        </p>
      </div>

      <SessionForm
        mode="create"
        products={(products ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          base_price: p.base_price,
          image: p.images?.[0] ?? null,
          totalStock:
            p.product_variants?.reduce(
              (s: number, v: any) => s + v.stock,
              0
            ) ?? 0,
        }))}
      />
    </div>
  )
}