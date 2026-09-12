'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/clients'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function AdminHeader({ user }: { user: SupabaseUser }) {
  const router = useRouter()
  const supabase = createClient()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    router.push('/connexion')
    router.refresh()
  }

  const fullName = user.user_metadata?.full_name ?? 'Admin'
  const initials = fullName
    .split(' ')
    .map((n: string) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Titre mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">L</span>
        </div>
        <span className="font-bold text-white text-sm">Admin</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        {/* Infos utilisateur */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-white leading-tight">
              {fullName}
            </p>
            <p className="text-xs text-slate-500 leading-tight">
              {user.email}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {initials}
            </span>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="Déconnexion"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">
            {loggingOut ? 'Déconnexion...' : 'Déconnexion'}
          </span>
        </button>
      </div>
    </header>
  )
}