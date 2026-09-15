/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[]
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

/* ============================================
   ✅ HANDLER PUSH — Reçoit les notifications du serveur
   ============================================ */
self.addEventListener('push', (event) => {
  console.log('[SW] Push reçu !')

  if (!event.data) {
    console.log('[SW] Pas de données dans le push')
    return
  }

  let data: any = {
    title: 'LiveShop',
    body: 'Nouvelle notification',
    url: '/dashboard',
  }

  try {
    const parsed = event.data.json()
    data = { ...data, ...parsed }
  } catch {
    try {
      data.body = event.data.text()
    } catch {}
  }

  const options: NotificationOptions = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'liveshop-notification',
    requireInteraction: true,
    data: { url: data.url || '/dashboard' },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

/* ============================================
   ✅ HANDLER CLIC — Ouvre l'app au clic
   ============================================ */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur notification')

  event.notification.close()

  const url = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher un onglet déjà ouvert
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(url)
            return client.focus()
          }
        }
        // Sinon, ouvrir un nouvel onglet
        if (self.clients.openWindow) {
          return self.clients.openWindow(url)
        }
      })
  )
})

serwist.addEventListeners()