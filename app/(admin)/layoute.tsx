import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const role = user.user_metadata?.role
  if (role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}