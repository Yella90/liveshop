import imageCompression from 'browser-image-compression'

/* ============================================
   LIMITES DE SÉCURITÉ
   ============================================ */
export const IMAGE_LIMITS = {
  // Taille maximale acceptée AVANT compression
  maxInputSize: 25 * 1024 * 1024, // 25 Mo

  // Dimensions maximales acceptées AVANT compression
  maxInputDimension: 8000, // 8000px de côté

  // Timeout de compression (ms)
  compressionTimeout: 30000, // 30 secondes
} as const

/* ============================================
   PROFILS DE COMPRESSION
   ============================================ */
export const IMAGE_PRESETS = {
  // Logos boutique : carré, max 512px
  logo: {
    maxSizeMB: 0.15, // 150 Ko max
    maxWidthOrHeight: 512,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: 0.9,
  },

  // Photos produits : max 1200px (idéal mobile)
  product: {
    maxSizeMB: 0.3, // 300 Ko max
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: 0.85,
  },

  // Photos HD (si besoin) : max 1920px
  highQuality: {
    maxSizeMB: 0.6, // 600 Ko max
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: 0.85,
  },
} as const

export type ImagePreset = keyof typeof IMAGE_PRESETS

/* ============================================
   RÉSULTAT DE COMPRESSION
   ============================================ */
export type CompressionResult =
  | {
      success: true
      file: File
      originalSize: number
      compressedSize: number
      reduction: number
      warning?: string
    }
  | {
      success: false
      error: string
    }

/* ============================================
   VALIDER UNE IMAGE AVANT COMPRESSION
   ============================================ */
async function validateImage(
  file: File
): Promise<{ valid: true } | { valid: false; error: string }> {
  // Type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Fichier non reconnu comme image.' }
  }

  // Taille extrême
  if (file.size > IMAGE_LIMITS.maxInputSize) {
    return {
      valid: false,
      error: `Image trop lourde (${formatBytes(
        file.size
      )}). Maximum accepté : ${formatBytes(IMAGE_LIMITS.maxInputSize)}.`,
    }
  }

  // Dimension (lecture rapide des métadonnées)
  try {
    const dimensions = await getImageDimensions(file)

    if (
      dimensions.width > IMAGE_LIMITS.maxInputDimension ||
      dimensions.height > IMAGE_LIMITS.maxInputDimension
    ) {
      return {
        valid: false,
        error: `Image trop grande (${dimensions.width}×${dimensions.height}px). Maximum : ${IMAGE_LIMITS.maxInputDimension}px.`,
      }
    }
  } catch {
    // On ne bloque pas si on ne peut pas lire les dimensions
  }

  return { valid: true }
}

/* ============================================
   LIRE LES DIMENSIONS D'UNE IMAGE
   ============================================ */
function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Impossible de lire l'image"))
    }

    img.src = url
  })
}

/* ============================================
   COMPRESSER AVEC TIMEOUT
   ============================================ */
async function compressWithTimeout(
  file: File,
  preset: ImagePreset
): Promise<File> {
  const options = IMAGE_PRESETS[preset]

  const compressionPromise = imageCompression(file, options)

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(
            'La compression a pris trop de temps. Essayez une image plus petite.'
          )
        ),
      IMAGE_LIMITS.compressionTimeout
    )
  })

  return Promise.race([compressionPromise, timeoutPromise])
}

/* ============================================
   FONCTION PRINCIPALE
   ============================================ */
export async function compressImage(
  file: File,
  preset: ImagePreset = 'product'
): Promise<CompressionResult> {
  const originalSize = file.size

  // 1. Validation
  const validation = await validateImage(file)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // 2. SVG (vectoriel, pas de compression)
  if (file.type === 'image/svg+xml') {
    return {
      success: true,
      file,
      originalSize,
      compressedSize: originalSize,
      reduction: 0,
      warning: 'SVG non compressé (format vectoriel).',
    }
  }

  // 3. GIF animé (compression = perte d'animation)
  if (file.type === 'image/gif') {
    return {
      success: true,
      file,
      originalSize,
      compressedSize: originalSize,
      reduction: 0,
      warning: "GIF non compressé (préserve l'animation).",
    }
  }

  // 4. Fichier déjà léger (sauf logo qui doit toujours être optimisé)
  if (file.size < 100 * 1024 && preset !== 'logo') {
    return {
      success: true,
      file,
      originalSize,
      compressedSize: originalSize,
      reduction: 0,
    }
  }

  // 5. Compression
  try {
    const compressed = await compressWithTimeout(file, preset)

    // Renommer avec la bonne extension
    const ext =
      IMAGE_PRESETS[preset].fileType === 'image/webp' ? 'webp' : 'jpg'
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const newName = `${baseName}.${ext}`

    const resultFile = new File([compressed], newName, {
      type: IMAGE_PRESETS[preset].fileType,
      lastModified: Date.now(),
    })

    const reduction = getReductionPercent(originalSize, resultFile.size)

    // Avertissement si très grosse image d'origine
    let warning: string | undefined
    if (originalSize > 8 * 1024 * 1024) {
      warning = `Image très lourde (${formatBytes(
        originalSize
      )}) compressée avec succès.`
    }

    return {
      success: true,
      file: resultFile,
      originalSize,
      compressedSize: resultFile.size,
      reduction,
      warning,
    }
  } catch (err: any) {
    console.error('Compression error:', err)
    return {
      success: false,
      error:
        err?.message ||
        'Erreur lors de la compression. Essayez une autre image.',
    }
  }
}

/* ============================================
   HELPERS
   ============================================ */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
}

export function getReductionPercent(
  originalSize: number,
  newSize: number
): number {
  if (originalSize === 0) return 0
  return Math.round(((originalSize - newSize) / originalSize) * 100)
}