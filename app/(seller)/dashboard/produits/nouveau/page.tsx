import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/seller/ProductForm'

export default async function NouveauProduitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: shop } = await supabase
    .from('shops')
    .select('slug')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!shop) redirect('/onboarding')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/produits"
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
          Retour aux produits
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Nouveau produit
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Ajoutez un article à votre catalogue.
        </p>
      </div>

      <ProductForm mode="create" shopSlug={shop.slug} />
    </div>
  )
}