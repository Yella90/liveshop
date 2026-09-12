'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  MapPin,
  Users,
} from 'lucide-react'

const items = [
  { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/admin/boutiques', label: 'Boutiques', icon: Store },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  {
    href: '/admin/zones-livraison',
    label: 'Zones livraison',
    icon: MapPin,
  },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold">LiveShop</h2>
        <p className="text-xs text-slate-400 mt-1">Administration</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}