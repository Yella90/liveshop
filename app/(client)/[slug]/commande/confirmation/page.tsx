import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESERVED_SLUGS } from '@/lib/constants'
import VisitTracker from '@/components/client/VisitTracker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.includes(slug)) return {}

  return {
    title: 'Commande confirmée — LiveShop',
    description: 'Votre commande a bien été envoyée au vendeur.',
  }
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order?: string; session?: string }>
}) {
  const { slug } = await params
  const { order: orderId, session: sessionSlug } = await searchParams

  if (RESERVED_SLUGS.includes(slug)) notFound()

  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, slug, phone')
    .eq('slug', slug)
    .maybeSingle()

  if (!shop) notFound()

  let order: any = null
  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('shop_id', shop.id)
      .maybeSingle()
    order = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 relative overflow-hidden">
      {/* ============================================
          CONFETTIS DÉCORATIFS (CSS PUR)
          ============================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <VisitTracker shopSlug={slug} />
        {/* Cercles flottants */}
        <div className="absolute top-10 left-[10%] w-3 h-3 rounded-full bg-emerald-400/60 animate-float-slow" />
        <div className="absolute top-24 right-[15%] w-2 h-2 rounded-full bg-indigo-400/60 animate-float delay-500" />
        <div className="absolute top-40 left-[20%] w-2.5 h-2.5 rounded-full bg-amber-400/60 animate-float-slow delay-700" />
        <div className="absolute top-16 right-[25%] w-3 h-3 rounded-full bg-pink-400/60 animate-float delay-1000" />
        <div className="absolute top-56 left-[8%] w-2 h-2 rounded-full bg-violet-400/60 animate-float-slow delay-300" />
        <div className="absolute top-32 right-[8%] w-2.5 h-2.5 rounded-full bg-emerald-500/60 animate-float delay-900" />

        {/* Étoiles */}
        <div className="absolute top-20 left-[35%] text-amber-400/70 animate-pulse">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="absolute top-44 right-[30%] text-amber-400/70 animate-pulse delay-500">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -top-20 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-float delay-1000" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24">
        {/* ============================================
            SUCCÈS
            ============================================ */}
        <div className="text-center mb-10 animate-fade-in-up">
          {/* Icône succès avec animation */}
          <div className="relative inline-flex items-center justify-center mb-6">
            {/* Halo pulsant */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />

            {/* Cercle principal */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-scale-in">
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 0,
                  animation: 'fade-in 0.4s ease-out 0.3s forwards',
                  opacity: 0,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Badges décoratifs */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg animate-bounce-subtle">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg animate-bounce-subtle delay-500">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-4">
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Commande enregistrée
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Merci{' '}
            <span className="text-gradient">pour votre commande !</span>
          </h1>

          <p className="text-slate-500 mt-5 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Votre commande chez{' '}
            <span className="font-bold text-slate-900">{shop.name}</span>{' '}
            a bien été envoyée. Le vendeur va vous contacter dans les
            plus brefs délais.
          </p>

          {/* Numéro de commande */}
          {order && (
            <div className="inline-flex items-center gap-2 mt-5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-xs font-bold text-slate-700">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* ============================================
            RÉCAPITULATIF
            ============================================ */}
        {order && (
          <div
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-6 animate-fade-in-up delay-200"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Récapitulatif
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    {order.order_items?.length ?? 0} article
                    {(order.order_items?.length ?? 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="divide-y divide-slate-100">
              {order.order_items?.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-slate-600">
                        {item.quantity}×
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.variant_name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900 shrink-0">
                    {Number(item.total).toLocaleString('fr-FR')}
                    <span className="text-[10px] font-medium text-slate-500 ml-1">
                      FCFA
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">
                  Sous-total
                </span>
                <span className="font-bold text-slate-900">
                  {Number(order.products_subtotal).toLocaleString(
                    'fr-FR'
                  )}{' '}
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">
                  Livraison
                </span>
                {order.delivery_visible === 'GRATUITE' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Gratuite
                  </span>
                ) : (
                  <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs">
                    Payante
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            PROCHAINES ÉTAPES
            ============================================ */}
        <div
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 mb-6 animate-fade-in-up delay-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Prochaines étapes
              </h3>
              <p className="text-[10px] text-amber-700">
                Voici ce qui va se passer
              </p>
            </div>
          </div>

          <ol className="space-y-3">
            <Step
              number={1}
              title="Le vendeur vous appelle"
              description="Il confirmera votre commande et répondra à vos questions."
            />
            <Step
              number={2}
              title="Frais de livraison"
              description="Si applicables, ils vous seront communiqués avant la livraison."
            />
            <Step
              number={3}
              title="Vous recevez votre commande"
              description="Au lieu et au moment convenus avec le vendeur."
            />
          </ol>
        </div>

        {/* ============================================
            CONTACTER LE VENDEUR
            ============================================ */}
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="group block bg-white rounded-3xl border border-slate-200 p-5 mb-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all animate-fade-in-up delay-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  Contacter le vendeur
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {shop.phone}
                </p>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-500 flex items-center justify-center transition-colors">
                <svg
                  className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>
        )}

        {/* ============================================
            ACTIONS
            ============================================ */}
        <div className="space-y-3 animate-fade-in-up delay-500">
          <Link
            href={`/${shop.slug}/boutique`}
            className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 hover:shadow-2xl active:scale-[0.98] transition-all overflow-hidden btn-shine"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Continuer mes achats
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {sessionSlug && (
            <Link
              href={`/${shop.slug}/session/${sessionSlug}`}
              className="flex items-center justify-center gap-2 w-full bg-white border-2 border-slate-200 text-slate-900 font-semibold py-3.5 px-6 rounded-2xl hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              Retour au live
            </Link>
          )}

          <Link
            href={`/${shop.slug}`}
            className="flex items-center justify-center text-sm font-semibold text-slate-500 hover:text-slate-900 py-2 transition-colors"
          >
            Retour à l&apos;accueil de {shop.name}
          </Link>
        </div>

        {/* ============================================
            FOOTER
            ============================================ */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">L</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              LiveShop
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Propulsé par LiveShop · Développé par{' '}
            <a
              href="https://unitech-qvgo.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gradient hover:opacity-80 transition-opacity"
            >
              UNITECH
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   ÉTAPE
   ============================================ */
function Step({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
        {number}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-amber-900">{title}</p>
        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  )
}