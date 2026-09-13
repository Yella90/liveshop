'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/clients'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useState } from 'react'
import SellerMobileMenu from './SellerMobileMenu'
import NotificationsBell from './NotificationsBell'

export default function SellerHeader({
  user,
  shopName,
}: {
  user: SupabaseUser
  shopName?: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/connexion')
    router.refresh()
  }

  const fullName = user.user_metadata?.full_name ?? 'Vendeur'
  const initials = fullName
    .split(' ')
    .map((n: string) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* ✅ Côté gauche mobile : hamburger + nom boutique */}
      <div className="flex items-center gap-2 md:hidden min-w-0">
        <SellerMobileMenu
          shopName={shopName}
          userName={user.email ?? ''}
        />
        <span className="font-semibold text-slate-900 truncate">
          {shopName ?? 'Dashboard'}
        </span>
      </div>

      {/* Placeholder desktop */}
      <div className="hidden md:block" />

      {/* Côté droit : notifications + user + logout */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* ✅ Cloche de notifications */}
        <NotificationsBell userId={user.id} />

        {/* Infos utilisateur (desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {fullName}
            </p>
            <p className="text-xs text-slate-500 leading-tight truncate max-w-[140px]">
              {user.email}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">
              {initials}
            </span>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Déconnexion"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}