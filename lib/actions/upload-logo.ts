'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET = 'shop-logos'
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]

export async function uploadShopLogo(formData: FormData) {
  const file = formData.get('file') as File | null
  const shopSlug = formData.get('shopSlug') as string | null

  if (!file) {
    return { error: 'Aucun fichier fourni.' }
  }
  if (!shopSlug) {
    return { error: 'Boutique manquante.' }
  }

  // Validation
  if (file.size > MAX_SIZE) {
    return { error: 'Logo trop lourd (max 2 Mo).' }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Format non supporté. Utilisez PNG, JPG ou WEBP.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  // Vérifier que l'utilisateur possède bien cette boutique
  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('slug', shopSlug)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) {
    return { error: 'Boutique introuvable.' }
  }

  // Nom unique : slug/timestamp-random.ext
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const fileName = `${shopSlug}/logo-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`

  // Upload
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Logo upload error:', uploadError.message)
    return { error: 'Erreur upload : ' + uploadError.message }
  }

  // Récupérer l'URL publique
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  // Mettre à jour la boutique
  const { error: updateError } = await supabase
    .from('shops')
    .update({ logo_url: urlData.publicUrl })
    .eq('id', shop.id)

  if (updateError) {
    // Rollback du fichier uploadé
    await supabase.storage.from(BUCKET).remove([fileName])
    return { error: 'Erreur mise à jour : ' + updateError.message }
  }

  return {
    success: true,
    logoUrl: urlData.publicUrl,
    fileName,
  }
}

export async function deleteShopLogo(logoUrl: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  // Extraire le chemin depuis l'URL
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = logoUrl.indexOf(marker)
  if (idx === -1) {
    return { error: 'URL invalide.' }
  }

  const filePath = logoUrl.slice(idx + marker.length)

  // Vérifier que le fichier appartient à une boutique de cet utilisateur
  const slug = filePath.split('/')[0]
  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!shop) {
    return { error: 'Accès refusé.' }
  }

  // Supprimer du storage
  await supabase.storage.from(BUCKET).remove([filePath])

  // Vider logo_url
  await supabase
    .from('shops')
    .update({ logo_url: null })
    .eq('id', shop.id)

  return { success: true }
}