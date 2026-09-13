import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SellerSidebar from '@/components/seller/SellerSidebar'
import SellerHeader from '@/components/seller/SellerHeader'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const role = user.user_metadata?.role ?? 'seller'
  if (role === 'admin') redirect('/admin')

  const { data: shop } = await supabase
    .from('shops')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* ✅ Passer le nom de la boutique */}
          <SellerHeader user={user} shopName={shop.name} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}