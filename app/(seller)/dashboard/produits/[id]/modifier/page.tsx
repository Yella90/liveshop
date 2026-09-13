import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/seller/ProductForm'

export const metadata = {
  title: 'Modifier le produit — LiveShop',
}

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // ✅ Récupérer aussi le slug pour l'upload d'images
  const { data: shop } = await supabase
    .from('shops')
    .select('id, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/onboarding')

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!product) notFound()

  // Préparer les données pour le formulaire
  const initialData = {
    name: product.name,
    description: product.description ?? '',
    base_price: product.base_price,
    images: product.images ?? [],
    active: product.active,
    variants:
      product.product_variants && product.product_variants.length > 0
        ? product.product_variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            price: String(v.price),
            stock: String(v.stock),
            sku: v.sku ?? '',
          }))
        : [{ name: 'Standard', price: '', stock: '0', sku: '' }],
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Fil d'Ariane */}
      <div>
        <Link
          href="/dashboard/produits"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
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

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
          Modifier le produit
        </h1>
        <p className="text-slate-500 mt-1 text-sm">{product.name}</p>
      </div>

      {/* Formulaire */}
      <ProductForm
        mode="edit"
        productId={product.id}
        shopSlug={shop.slug}
        initialData={initialData}
      />
    </div>
  )
}