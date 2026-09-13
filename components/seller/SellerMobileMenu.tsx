'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: "Vue d'ensemble", icon: 'dashboard' },
  { href: '/dashboard/statistiques', label: 'Statistiques', icon: 'chart' },
  { href: '/dashboard/produits', label: 'Produits', icon: 'products' },
  { href: '/dashboard/sessions', label: 'Sessions', icon: 'sessions' },
  { href: '/dashboard/commandes', label: 'Commandes', icon: 'orders' },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: 'settings' },
]

export default function SellerMobileMenu({
  shopName,
  userName,
}: {
  shopName?: string
  userName?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fermer le drawer quand on change de page
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 -ml-2 text-slate-900 hover:text-indigo-600 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-[70] w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header du drawer */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">
                LiveShop
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                Espace vendeur
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600"
            aria-label="Fermer le menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Infos boutique + user */}
        {(shopName || userName) && (
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            {shopName && (
              <p className="text-xs text-slate-500 font-medium">Boutique</p>
            )}
            {shopName && (
              <p className="text-sm font-bold text-slate-900 truncate">
                {shopName}
              </p>
            )}
            {userName && (
              <p className="text-xs text-slate-500 mt-2 truncate">
                {userName}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MenuIcon name={item.icon} active={active} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
            © {new Date().getFullYear()} LiveShop · UNITECH
          </p>
        </div>
      </aside>
    </>
  )
}

function MenuIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-600'}`

  if (name === 'dashboard')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  if (name === 'chart')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  if (name === 'products')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  if (name === 'sessions')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}