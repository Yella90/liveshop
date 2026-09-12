'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET = 'product-images'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file') as File | null
  const shopSlug = formData.get('shopSlug') as string | null

  if (!file) return { error: 'Aucun fichier.' }
  if (!shopSlug) return { error: 'Boutique manquante.' }

  if (file.size > MAX_SIZE) {
    return { error: 'Image trop lourde (max 5 MB).' }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error: 'Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  // Nom unique : shopSlug/timestamp-random.ext
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${shopSlug}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return { error: 'Erreur upload : ' + error.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return { url: data.publicUrl }
}

export async function deleteProductImage(url: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  // Extraire le chemin depuis l'URL publique
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return { error: 'URL invalide.' }

  const path = url.slice(idx + marker.length)

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) return { error: error.message }

  return { success: true }
}