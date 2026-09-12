'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'liveshop_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export default function VisitTracker({
  shopSlug,
  sessionSlug = null,
}: {
  shopSlug: string
  sessionSlug?: string | null
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Éviter de compter plusieurs fois dans la même minute
    const trackKey = `tracked_${pathname}`
    const lastTrack = sessionStorage.getItem(trackKey)
    if (lastTrack && Date.now() - Number(lastTrack) < 60_000) {
      return
    }

    const visitorId = getOrCreateVisitorId()
    if (!visitorId) return

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopSlug,
        sessionSlug,
        path: pathname,
        visitorId,
      }),
      // Ne pas bloquer le rendu
      keepalive: true,
    }).catch(() => {})

    sessionStorage.setItem(trackKey, String(Date.now()))
  }, [pathname, shopSlug, sessionSlug])

  return null
}