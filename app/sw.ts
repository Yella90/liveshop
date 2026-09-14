/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'

// ✅ Déclaration globale pour __SW_MANIFEST injecté par Serwist
declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (string | { url: string; revision: string | null })[]
  }
}

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

serwist.addEventListeners()