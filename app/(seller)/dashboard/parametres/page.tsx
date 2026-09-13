import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ShopSettingsForm from '@/components/seller/ShopSettingsForm'

export const metadata = {
  title: 'Paramètres — LiveShop',
}

export default async function ParametresPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/onboarding')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Paramètres
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Configurez votre boutique et vos préférences de livraison.
        </p>
      </div>

      <ShopSettingsForm shop={shop} />
    </div>
  )
}