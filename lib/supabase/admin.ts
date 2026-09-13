import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec clé service_role
 * ⚠️ Bypass toutes les RLS — À utiliser UNIQUEMENT côté serveur
 * Ne JAMAIS exposer cette clé au client
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local'
    )
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}