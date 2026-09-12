import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { slug } = await params
  const { order: orderId } = await searchParams

  if (RESERVED_SLUGS.includes(slug)) notFound()

  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('name, slug, phone')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) notFound()

  let order: any = null
  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('shop_id', (await supabase.from('shops').select('id').eq('slug', slug).single()).data?.id ?? '')
      .maybeSingle()
    order = data
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Commande envoyée !
          </h1>
          <p className="text-slate-600 mt-3 max-w-md mx-auto">
            Merci pour votre commande chez{' '}
            <strong>{shop.name}</strong>. Le vendeur va vous
            contacter dans les plus brefs délais pour confirmer.
          </p>
        </div>

        {/* Récapitulatif */}
        {order && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Récapitulatif
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Commande #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {order.order_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="px-5 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.variant_name} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 shrink-0">
                    {Number(item.total).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Sous-total</span>
                <span className="font-semibold text-slate-900">
                  {Number(order.products_subtotal).toLocaleString('fr-FR')}{' '}
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Livraison</span>
                {order.delivery_visible === 'GRATUITE' ? (
                  <span className="font-semibold text-emerald-600">
                    Gratuite
                  </span>
                ) : (
                  <span className="font-semibold text-amber-600">
                    Payante
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Infos importantes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
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
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Prochaines étapes
          </h3>
          <ul className="text-sm text-amber-800 space-y-1.5">
            <li>1. Le vendeur vous appelle pour confirmer.</li>
            <li>
              2. Les frais de livraison (si applicables) vous seront
              communiqués.
            </li>
            <li>3. Vous recevez votre commande.</li>
          </ul>
        </div>

        {/* Contact vendeur */}
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="block bg-white rounded-2xl border border-slate-200 p-5 mb-6 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Contacter le vendeur
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {shop.phone}
                </p>
              </div>
            </div>
          </a>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/${shop.slug}/boutique`}
            className="block text-center bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            Continuer mes achats
          </Link>
          <Link
            href={`/${shop.slug}`}
            className="block text-center text-sm font-medium text-slate-600 hover:text-slate-900 py-2"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}