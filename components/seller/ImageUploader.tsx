'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/clients'
import {
  compressImage,
  formatBytes,
  getReductionPercent,
} from '@/lib/utils/image-compression'

const BUCKET = 'product-images'

export default function ImageUploader({
  shopSlug,
  images,
  onChange,
  maxImages = 5,
}: {
  shopSlug: string
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files)
    const remaining = maxImages - images.length

    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images par produit`)
      return
    }

    const toUpload = list.slice(0, remaining)
    if (list.length > remaining) {
      toast.info(
        `Seules les ${remaining} premières images seront ajoutées`
      )
    }

    setUploading(true)
    const toastId = toast.loading(
      `Traitement de ${toUpload.length} image(s)...`
    )

    const uploaded: string[] = []
    let totalOriginal = 0
    let totalCompressed = 0
    const errors: string[] = []

    for (const file of toUpload) {
      try {
        const compression = await compressImage(file, 'product')

        if (!compression.success) {
          errors.push(`${file.name} : ${compression.error}`)
          continue
        }

        if (compression.warning) {
          toast.info(compression.warning, { duration: 3000 })
        }

        totalOriginal += compression.originalSize
        totalCompressed += compression.compressedSize

        const compressedFile = compression.file

        const ext =
          compressedFile.name.split('.').pop()?.toLowerCase() || 'webp'
        const fileName = `${shopSlug}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, compressedFile, {
            contentType: compressedFile.type,
            upsert: false,
          })

        if (uploadError) {
          errors.push(`${file.name} : ${uploadError.message}`)
          continue
        }

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(fileName)

        uploaded.push(data.publicUrl)
      } catch (err: any) {
        console.error('Upload error:', err)
        errors.push(`${file.name} : ${err?.message || 'erreur inconnue'}`)
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded])

      const reduction = getReductionPercent(totalOriginal, totalCompressed)
      toast.success(
        `${uploaded.length} image(s) ajoutée(s) · -${reduction}% (${formatBytes(
          totalCompressed
        )})`,
        { id: toastId }
      )
    } else {
      toast.dismiss(toastId)
    }

    errors.forEach((err) => toast.error(err))

    setUploading(false)
  }

  /* ============================================
     SUPPRESSION — Ouvre le modal
     ============================================ */
  function requestDelete(url: string) {
    setConfirmDelete(url)
  }

  /* ============================================
     SUPPRESSION — Confirmée par l'utilisateur
     ============================================ */
  async function handleConfirmDelete() {
    if (!confirmDelete) return

    setDeleting(true)
    const url = confirmDelete
    const toastId = toast.loading('Suppression...')

    // Retirer immédiatement de l'UI
    const next = images.filter((u) => u !== url)
    onChange(next)

    // Extraire le chemin
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const idx = url.indexOf(marker)

    if (idx === -1) {
      toast.error('URL invalide', { id: toastId })
      setDeleting(false)
      setConfirmDelete(null)
      return
    }

    const path = url.slice(idx + marker.length)
    const { error } = await supabase.storage.from(BUCKET).remove([path])

    if (error) {
      toast.error(error.message, { id: toastId })
      // Restaurer en cas d'échec
      onChange(images)
    } else {
      toast.success('Image supprimée', { id: toastId })
    }

    setDeleting(false)
    setConfirmDelete(null)
  }

  function handleCancelDelete() {
    setConfirmDelete(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  /* ============================================
     Index de l'image en cours de suppression
     ============================================ */
  const deleteIndex = confirmDelete
    ? images.indexOf(confirmDelete)
    : -1

  return (
    <>
      <div className="space-y-3">
        {/* Zone de drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragging(false)
          }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
          } ${uploading ? 'opacity-60 cursor-wait' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files)
              e.target.value = ''
            }}
          />

          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-600">
                Compression et upload...
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Cliquez ou glissez vos images ici
              </p>
              <p className="text-xs text-slate-500">
                JPG, PNG, WEBP · {images.length}/{maxImages}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">
                ✨ Compression automatique activée
              </p>
            </>
          )}
        </div>

        {/* Prévisualisation */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {index === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full">
                    Principale
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => requestDelete(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity shadow-lg"
                  title="Supprimer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================
          MODAL DE CONFIRMATION
          ============================================ */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Aperçu de l'image */}
            <div className="relative w-full aspect-square max-w-[180px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={confirmDelete}
                alt="Image à supprimer"
                className="w-full h-full object-cover"
              />
              {deleteIndex === 0 && (
                <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
                  Principale
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Supprimer cette image ?
            </h3>
            <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">
              {deleteIndex === 0
                ? 'Cette image est la principale. Une autre deviendra principale à sa place.'
                : "L'image sera définitivement retirée du produit."}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 text-sm font-semibold text-slate-700 py-3 rounded-2xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 text-sm font-semibold text-white bg-red-600 py-3 rounded-2xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}