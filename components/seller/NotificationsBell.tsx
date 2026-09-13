'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/clients'
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from '@/lib/actions/notifications'

type Notification = {
  id: string
  type: 'ORDER' | 'STOCK' | 'SYSTEM'
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsBell({
  userId,
}: {
  userId: string
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  /* ============================================
     Fermer au clic extérieur
     ============================================ */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /* ============================================
     Charger + s'abonner aux notifications
     ============================================ */
  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
      setNotifications((data ?? []) as Notification[])
      setLoading(false)
    }
    load()

    // Realtime : nouvelle notification
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [
            payload.new as Notification,
            ...prev,
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  /* ============================================
     Actions
     ============================================ */
  async function handleMarkAllRead() {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    )
    await markAllNotificationsAsRead()
  }

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    await markNotificationAsRead(id)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await deleteNotification(id)
  }

  /* ============================================
     Temps relatif
     ============================================ */
  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `Il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Il y a ${days}j`
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bouton cloche */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge compteur */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  Aucune notification
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Vos nouvelles commandes apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`group relative hover:bg-slate-50 transition-colors ${
                      !notif.is_read ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <Link
                      href={notif.link ?? '#'}
                      onClick={() => {
                        if (!notif.is_read) handleMarkRead(notif.id)
                        setOpen(false)
                      }}
                      className="block p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icône */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === 'ORDER'
                              ? 'bg-emerald-100 text-emerald-600'
                              : notif.type === 'STOCK'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <NotifIcon type={notif.type} />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {notif.title}
                            </p>
                            {!notif.is_read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1.5">
                            {timeAgo(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Bouton supprimer */}
                    <button
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      title="Supprimer"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer (optionnel) */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
              <Link
                href="/dashboard/commandes"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 block text-center transition-colors"
              >
                Voir toutes les commandes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ============================================
   Icônes par type
   ============================================ */
function NotifIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4'

  if (type === 'ORDER')
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    )

  if (type === 'STOCK')
    return (
      <svg
        className={cls}
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
    )

  return (
    <svg
      className={cls}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}