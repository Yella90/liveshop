'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MenuItem = {
  href: string
  label: string
  icon: string
  external?: boolean
}

export default function ClientMenu({
  shopSlug,
  shopName,
  sessionSlug,
}: {
  shopSlug: string
  shopName: string
  sessionSlug?: string | null
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const items: MenuItem[] = [
    {
      href: `/${shopSlug}`,
      label: 'Accueil boutique',
      icon: 'home',
    },
    {
      href: `/${shopSlug}/boutique`,
      label: 'Tous les produits',
      icon: 'products',
    },
    ...(sessionSlug
      ? [
          {
            href: `/${shopSlug}/session/${sessionSlug}`,
            label: 'Session en cours',
            icon: 'live',
          },
        ]
      : []),
    {
      href: '/mes-commandes?from=' + shopSlug,
      label: 'Mes commandes',
      icon: 'orders',
    },
    {
      href: `/${shopSlug}/panier`,
      label: 'Mon panier',
      icon: 'cart',
    },
  ]

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 -ml-2 text-slate-900 hover:text-indigo-600 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg
          className="w-5 h-5"
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
          className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">
                {shopName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {shopName}
              </p>
              <p className="text-[10px] text-slate-500">Menu client</p>
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

        {/* Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href.split('?')[0] + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
            Propulsé par LiveShop
          </p>
        </div>
      </aside>
    </>
  )
}

function MenuIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-600'}`

  if (name === 'home')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  if (name === 'products')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  if (name === 'live')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  if (name === 'orders')
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}