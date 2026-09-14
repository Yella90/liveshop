'use client'

import { useState, useEffect } from 'react'

/* ============================================
   CONVERSION VAPID KEY
   Retourne un Uint8Array<ArrayBuffer> compatible BufferSource
   ============================================ */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  // ✅ Créer un ArrayBuffer explicite (et non ArrayBufferLike)
  const buffer = new ArrayBuffer(rawData.length)
  const outputArray = new Uint8Array(buffer)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'default'
  )
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return

    setPermission(Notification.permission)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    let cancelled = false

    async function checkSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready
        const existing =
          await registration.pushManager.getSubscription()
        if (!cancelled) setSubscribed(!!existing)
      } catch {
        // ignore
      }
    }

    checkSubscription()

    return () => {
      cancelled = true
    }
  }, [])

  async function subscribe(): Promise<
    { success: true } | { error: string }
  > {
    if (typeof window === 'undefined') {
      return { error: 'Fonction non disponible côté serveur.' }
    }

    if (!('serviceWorker' in navigator)) {
      return {
        error: "Les notifications ne sont pas supportées par ce navigateur.",
      }
    }

    if (!('PushManager' in window)) {
      return {
        error:
          'Les notifications push ne sont pas supportées par ce navigateur.',
      }
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!publicKey) {
      return {
        error: 'Configuration push manquante (VAPID).',
      }
    }

    // 1. Demander la permission
    const perm = await Notification.requestPermission()
    setPermission(perm)

    if (perm !== 'granted') {
      return { error: 'Permission refusée.' }
    }

    // 2. Attendre que le SW soit prêt
    const registration = await navigator.serviceWorker.ready

    // 3. Vérifier s'il y a déjà une souscription
    let subscription = await registration.pushManager.getSubscription()

    // 4. Sinon, créer une nouvelle souscription
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    // 5. Envoyer au serveur
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    if (!res.ok) {
      return { error: "Erreur d'enregistrement sur le serveur." }
    }

    setSubscribed(true)
    return { success: true }
  }

  async function unsubscribe(): Promise<
    { success: true } | { error: string }
  > {
    if (typeof window === 'undefined') {
      return { error: 'Fonction non disponible côté serveur.' }
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      setSubscribed(false)
      return { success: true }
    }

    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    })

    await subscription.unsubscribe()
    setSubscribed(false)
    return { success: true }
  }

  return { permission, subscribed, subscribe, unsubscribe }
}