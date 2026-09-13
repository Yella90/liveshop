'use client'

import { useEffect, useState, useCallback } from 'react'

const KEY = 'liveshop_my_orders'
const MAX_ORDERS = 20

export type StoredOrder = {
  id: string
  shopSlug: string
  shopName: string
  total: number
  createdAt: string
}

function read(): StoredOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(orders: StoredOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(orders))
  window.dispatchEvent(new Event('my-orders-updated'))
}

export function useMyOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([])

  useEffect(() => {
    const reload = () => setOrders(read())
    reload()
    window.addEventListener('my-orders-updated', reload)
    window.addEventListener('storage', reload)
    return () => {
      window.removeEventListener('my-orders-updated', reload)
      window.removeEventListener('storage', reload)
    }
  }, [])

  const saveOrder = useCallback((order: StoredOrder) => {
    const current = read()
    // Éviter les doublons
    const filtered = current.filter((o) => o.id !== order.id)
    // Ajouter au début + limiter à 20
    const next = [order, ...filtered].slice(0, MAX_ORDERS)
    write(next)
    setOrders(next)
  }, [])

  const removeOrder = useCallback((id: string) => {
    const next = read().filter((o) => o.id !== id)
    write(next)
    setOrders(next)
  }, [])

  const clearAll = useCallback(() => {
    write([])
    setOrders([])
  }, [])

  return { orders, saveOrder, removeOrder, clearAll, count: orders.length }
}