import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/seller/OnboardingForm'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const role = user.user_metadata?.role ?? 'seller'
  if (role === 'admin') redirect('/admin')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (shop) redirect('/dashboard')

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-white font-semibold text-lg">LiveShop</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Bienvenue 👋
        </h1>
        <p className="text-slate-300 mt-2 text-sm sm:text-base">
          Créez votre boutique en quelques secondes. Vous pourrez
          ensuite ajouter vos produits et lancer votre première
          session de vente en direct.
        </p>
      </div>

      {/* Formulaire */}
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <OnboardingForm />
      </div>
    </div>
  )
}