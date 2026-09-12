'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  deleteSession,
  toggleSessionActive,
} from '@/lib/actions/sessions'

type Session = {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  free_delivery_enabled: boolean
  created_at: string
}

export default function SessionCard({
  session,
  shopSlug,
  productCount,
  orderCount,
}: {
  session: Session
  shopSlug: string
  productCount: number
  orderCount: number
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const publicUrl = `/${shopSlug}/session/${session.slug}`

  async function handleToggleActive() {
    setBusy(true)
    await toggleSessionActive(session.id, !session.is_active)
    router.refresh()
    setBusy(false)
  }

  async function handleDelete() {
    setBusy(true)
    const result = await deleteSession(session.id)
    if (result?.error) {
      alert(result.error)
      setBusy(false)
      return
    }
    router.refresh()
  }

  function handleCopyLink() {
    if (typeof window === 'undefined') return
    const fullUrl = `${window.location.origin}${publicUrl}`
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Lien copié !')
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all flex flex-col">
        {/* Header */}
        <div
          className={`p-4 ${
            session.is_active
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            {session.is_active ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide bg-red-500 text-white px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                En direct
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide bg-slate-300 text-slate-700 px-2 py-1 rounded-full">
                Inactive
              </span>
            )}
            {session.free_delivery_enabled && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-500 text-white px-2 py-1 rounded-full">
                🚚 Livraison offerte
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
            {session.name}
          </h3>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col">
          {session.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {session.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 py-2 mb-3 border-y border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                Produits
              </p>
              <p className="text-sm font-bold text-slate-900">
                {productCount}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                Commandes
              </p>
              <p className="text-sm font-bold text-slate-900">
                {orderCount}
              </p>
            </div>
          </div>

          {/* Lien public */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 rounded-lg p-2 mb-3">
            <svg
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="truncate text-slate-600 font-mono">
              /{shopSlug}/session/{session.slug}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <Link
                href={`/dashboard/sessions/${session.id}`}
                className="flex-1 text-center text-xs font-semibold bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Gérer
              </Link>
              <button
                onClick={handleCopyLink}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-lg transition-colors"
                title="Copier le lien"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleToggleActive}
                disabled={busy}
                className="flex-1 text-xs font-medium text-slate-600 hover:text-slate-900 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {session.is_active ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Supprimer"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Supprimer cette session ?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              <strong>{session.name}</strong> et ses affectations
              seront définitivement supprimés. Les commandes déjà
              passées seront conservées.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={busy}
                className="flex-1 text-sm font-medium text-slate-700 py-2.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex-1 text-sm font-medium text-white bg-red-600 py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {busy ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}