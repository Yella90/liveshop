'use client'

import { useEffect, useState, useCallback } from 'react'

export type CartItem = {
  productId: string
  productName: string
  image: string | null
  variantId: string
  variantName: string
  unitPrice: number
  quantity: number
  maxStock: number
}

const ITEMS_KEY_PREFIX = 'liveshop_cart_'
const SESSION_KEY_PREFIX = 'liveshop_session_'

function readItems(shopSlug: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ITEMS_KEY_PREFIX + shopSlug)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readSession(shopSlug: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(SESSION_KEY_PREFIX + shopSlug)
  } catch {
    return null
  }
}

function writeItems(shopSlug: string, items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    ITEMS_KEY_PREFIX + shopSlug,
    JSON.stringify(items)
  )
}

function writeSession(shopSlug: string, sessionSlug: string | null) {
  if (typeof window === 'undefined') return
  if (sessionSlug) {
    window.localStorage.setItem(
      SESSION_KEY_PREFIX + shopSlug,
      sessionSlug
    )
  } else {
    window.localStorage.removeItem(SESSION_KEY_PREFIX + shopSlug)
  }
}

function notifyUpdate() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('cart-updated'))
}

export function useCart(shopSlug: string) {
  const [items, setItems] = useState<CartItem[]>([])
  const [sessionSlug, setSessionSlug] = useState<string | null>(null)

  useEffect(() => {
    const reload = () => {
      setItems(readItems(shopSlug))
      setSessionSlug(readSession(shopSlug))
    }
    reload()

    window.addEventListener('cart-updated', reload)
    window.addEventListener('storage', reload)
    return () => {
      window.removeEventListener('cart-updated', reload)
      window.removeEventListener('storage', reload)
    }
  }, [shopSlug])

  const addToCart = useCallback(
    (
      product: { id: string; name: string; images: string[] },
      variant: { id: string; name: string; price: number; stock: number },
      fromSessionSlug?: string | null
    ) => {
      const current = readItems(shopSlug)
      const existing = current.find((i) => i.variantId === variant.id)

      let next: CartItem[]
      if (existing) {
        if (existing.quantity >= variant.stock) return
        next = current.map((i) =>
          i.variantId === variant.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        next = [
          ...current,
          {
            productId: product.id,
            productName: product.name,
            image: product.images[0] ?? null,
            variantId: variant.id,
            variantName: variant.name,
            unitPrice: variant.price,
            quantity: 1,
            maxStock: variant.stock,
          },
        ]
      }

      writeItems(shopSlug, next)

      // ✅ On mémorise la session d'où vient le produit
      if (fromSessionSlug) {
        writeSession(shopSlug, fromSessionSlug)
      }

      setItems(next)
      if (fromSessionSlug) setSessionSlug(fromSessionSlug)
      notifyUpdate()
    },
    [shopSlug]
  )

  const removeFromCart = useCallback(
    (variantId: string) => {
      const next = readItems(shopSlug).filter(
        (i) => i.variantId !== variantId
      )
      writeItems(shopSlug, next)
      setItems(next)
      notifyUpdate()
    },
    [shopSlug]
  )

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      if (quantity < 1) return
      const next = readItems(shopSlug).map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(quantity, i.maxStock) }
          : i
      )
      writeItems(shopSlug, next)
      setItems(next)
      notifyUpdate()
    },
    [shopSlug]
  )

  const clearCart = useCallback(() => {
    writeItems(shopSlug, [])
    writeSession(shopSlug, null)
    setItems([])
    setSessionSlug(null)
    notifyUpdate()
  }, [shopSlug])

  const setSession = useCallback(
    (slug: string | null) => {
      writeSession(shopSlug, slug)
      setSessionSlug(slug)
    },
    [shopSlug]
  )

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce(
    (s, i) => s + i.quantity * i.unitPrice,
    0
  )

  return {
    items,
    sessionSlug,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSession,
    totalItems,
    totalPrice,
  }
}