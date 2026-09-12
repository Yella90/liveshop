'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getShop() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, shop: null }

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  return { supabase, shop }
}

type VariantInput = {
  name: string
  price: string | number
  stock: string | number
  sku?: string | null
}

function parseVariants(json: string, basePrice: number): VariantInput[] {
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return []
    return arr
      .filter((v) => v && (v.name || v.price))
      .map((v) => ({
        name: String(v.name || 'Standard').trim(),
        price: Number(v.price) || basePrice,
        stock: parseInt(String(v.stock)) || 0,
        sku: v.sku ? String(v.sku).trim() : null,
      }))
  } catch {
    return []
  }
}

/* ============================================
   CREATE
   ============================================ */
export async function createProduct(formData: FormData) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const basePrice = Number(formData.get('base_price')) || 0
  const active = formData.get('active') === 'on'
  const variants = parseVariants(
    (formData.get('variants') as string) || '[]',
    basePrice
  )

  const imagesJson = (formData.get('images') as string) || '[]'
  let images: string[] = []
  try {
    const arr = JSON.parse(imagesJson)
    if (Array.isArray(arr)) {
      images = arr.filter((u) => typeof u === 'string' && u.trim())
    }
  } catch {
    images = []
  }

  if (!name || name.length < 2) {
    return { error: 'Le nom est requis (min 2 caractères).' }
  }
  if (variants.length === 0) {
    return { error: 'Ajoutez au moins une variante.' }
  }

  const { data: product, error: prodError } = await supabase
    .from('products')
    .insert({
      shop_id: shop.id,
      name,
      description,
      base_price: basePrice,
      images,
      active,
    })
    .select('id')
    .single()

  if (prodError || !product) {
    return { error: 'Erreur création produit : ' + prodError?.message }
  }

  const { error: varError } = await supabase
    .from('product_variants')
    .insert(
      variants.map((v) => ({
        product_id: product.id,
        name: v.name,
        price: v.price,
        stock: v.stock,
        sku: v.sku,
      }))
    )

  if (varError) {
    await supabase.from('products').delete().eq('id', product.id)
    return { error: 'Erreur variantes : ' + varError.message }
  }

  revalidatePath('/dashboard/produits')
  redirect('/dashboard/produits')
}

/* ============================================
   UPDATE
   ============================================ */
export async function updateProduct(id: string, formData: FormData) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  // Vérifier que le produit appartient à cette boutique
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!existing) return { error: 'Produit introuvable.' }

  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const basePrice = Number(formData.get('base_price')) || 0
  const active = formData.get('active') === 'on'
  const variants = parseVariants(
    (formData.get('variants') as string) || '[]',
    basePrice
  )

  const imagesJson = (formData.get('images') as string) || '[]'
  let images: string[] = []
  try {
    const arr = JSON.parse(imagesJson)
    if (Array.isArray(arr)) {
      images = arr.filter((u) => typeof u === 'string' && u.trim())
    }
  } catch {
    images = []
  }

  if (!name || name.length < 2) {
    return { error: 'Le nom est requis (min 2 caractères).' }
  }
  if (variants.length === 0) {
    return { error: 'Ajoutez au moins une variante.' }
  }

  const { error: updateError } = await supabase
    .from('products')
    .update({ name, description, base_price: basePrice, images, active })
    .eq('id', id)

  if (updateError) {
    return { error: 'Erreur mise à jour : ' + updateError.message }
  }

  // Stratégie simple : supprimer les anciennes variantes et recréer
  await supabase.from('product_variants').delete().eq('product_id', id)

  const { error: varError } = await supabase
    .from('product_variants')
    .insert(
      variants.map((v) => ({
        product_id: id,
        name: v.name,
        price: v.price,
        stock: v.stock,
        sku: v.sku,
      }))
    )

  if (varError) {
    return { error: 'Erreur variantes : ' + varError.message }
  }

  revalidatePath('/dashboard/produits')
  redirect('/dashboard/produits')
}

/* ============================================
   DELETE
   ============================================ */
export async function deleteProduct(id: string) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('shop_id', shop.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/produits')
  return { success: true }
}

/* ============================================
   TOGGLE ACTIVE
   ============================================ */
export async function toggleProductActive(id: string, active: boolean) {
  const { supabase, shop } = await getShop()
  if (!shop) return { error: 'Boutique introuvable.' }

  const { error } = await supabase
    .from('products')
    .update({ active })
    .eq('id', id)
    .eq('shop_id', shop.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/produits')
  return { success: true }
}