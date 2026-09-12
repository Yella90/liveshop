import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/seller/ProductCard'

export default async function ProduitsPage() {
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
    .select('*, product_variants(*)')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Produits
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {products?.length ?? 0} produit
            {(products?.length ?? 0) > 1 ? 's' : ''} dans votre
            catalogue.
          </p>
        </div>
        <Link
          href="/dashboard/produits/nouveau"
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
          Nouveau produit
        </Link>
      </div>

      {/* Liste */}
      {!products || products.length === 0 ? (
        <EmptyProducts />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variants={product.product_variants ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyProducts() {
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        Aucun produit pour le moment
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Ajoutez votre premier produit pour commencer à vendre lors de
        vos sessions en direct.
      </p>
      <Link
        href="/dashboard/produits/nouveau"
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
        Ajouter un produit
      </Link>
    </div>
  )
}