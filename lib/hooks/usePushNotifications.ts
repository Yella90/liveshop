'use client'

import { useState, useEffect, useCallback } from 'react'

function urlBase64ToUint8Array(
  base64String: string
): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const outputArray = new Uint8Array(buffer)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)
  const [checking, setChecking] = useState(true)

  /* ============================================
     Vérifie si la souscription existe POUR CET UTILISATEUR
     sur CET APPAREIL
     ============================================ */
  const refreshSubscription = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    try {
      const reg = await navigator.serviceWorker.ready
      const browserSub = await reg.pushManager.getSubscription()

      if (!browserSub) {
        setSubscribed(false)
        return
      }

      // ✅ Vérifier côté serveur que cette souscription
      // appartient bien à l'utilisateur connecté
      const res = await fetch('/api/push/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: browserSub.endpoint }),
      })

      if (!res.ok) {
        setSubscribed(false)
        return
      }

      const { registered } = await res.json()
      setSubscribed(!!registered)
    } catch {
      setSubscribed(false)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    setPermission(Notification.permission)
  }, [])

  useEffect(() => {
    refreshSubscription()
  }, [refreshSubscription])

  /* ============================================
     S'ABONNER
     ============================================ */
  async function subscribe(): Promise<
    { success: true } | { error: string }
  > {
    if (typeof window === 'undefined') {
      return { error: 'Fonction non disponible côté serveur.' }
    }

    if (!('serviceWorker' in navigator)) {
      return { error: 'Notifications non supportées.' }
    }

    if (!('PushManager' in window)) {
      return { error: 'Push non supporté.' }
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!publicKey) {
      return { error: 'Configuration push manquante (VAPID).' }
    }

    const perm = await Notification.requestPermission()
    setPermission(perm)

    if (perm !== 'granted') {
      return { error: 'Permission refusée.' }
    }

    const registration = await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    if (!res.ok) {
      return { error: "Erreur d'enregistrement." }
    }

    setSubscribed(true)
    return { success: true }
  }

  /* ============================================
     SE DÉSABONNER (au logout)
     ============================================ */
  async function unsubscribe(): Promise<
    { success: true } | { error: string }
  > {
    if (typeof window === 'undefined') {
      return { error: 'Non disponible.' }
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription =
        await registration.pushManager.getSubscription()

      if (subscription) {
        // 1. Supprimer de la DB
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })

        // 2. Supprimer du navigateur
        await subscription.unsubscribe()
      }

      setSubscribed(false)
      return { success: true }
    } catch {
      return { error: 'Erreur désabonnement.' }
    }
  }

  return {
    permission,
    subscribed,
    checking,
    subscribe,
    unsubscribe,
    refreshSubscription,
  }
}