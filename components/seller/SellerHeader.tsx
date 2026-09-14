'use client'

import { useRouter } from 'next/navigation'
import { usePushNotifications } from '@/lib/hooks/usePushNotifications'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/clients'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
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

  // ✅ État de montage pour éviter les mismatch SSR/client
  const [mounted, setMounted] = useState(false)

  // ✅ Notifications push
  const { permission, subscribed, subscribe } = usePushNotifications()
  const [enabling, setEnabling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/connexion')
    router.refresh()
  }

  async function handleEnablePush() {
    setEnabling(true)
    try {
      const result = await subscribe()

      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success('Notifications push activées !', {
          description:
            'Vous recevrez une alerte à chaque nouvelle commande.',
        })
      }
    } catch (err: any) {
      toast.error(
        err?.message || "Impossible d'activer les notifications."
      )
    } finally {
      setEnabling(false)
    }
  }

  const fullName = user.user_metadata?.full_name ?? 'Vendeur'
  const initials = fullName
    .split(' ')
    .map((n: string) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  // ✅ Afficher le bouton uniquement APRÈS le montage client
  //    + vérifier les conditions de support
  const showPushButton =
    mounted &&
    'Notification' in window &&
    permission !== 'granted' &&
    !subscribed

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Côté gauche mobile : hamburger + nom boutique */}
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

      {/* Côté droit : bouton push + notifications + user + logout */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* ✅ Bouton « Activer les alertes » */}
        {showPushButton && (
          <button
            onClick={handleEnablePush}
            disabled={enabling}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
            title="Recevoir les alertes de commandes"
          >
            {enabling ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Activation...
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Activer les alertes
              </>
            )}
          </button>
        )}

        {/* Cloche de notifications */}
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