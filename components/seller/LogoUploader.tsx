'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadShopLogo, deleteShopLogo } from '@/lib/actions/upload-logo'
import { compressImage, formatBytes } from '@/lib/utils/image-compression'

export default function LogoUploader({
  shopSlug,
  currentLogoUrl,
  shopName,
}: {
  shopSlug: string
  currentLogoUrl: string | null
  shopName: string
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ============================================
     UPLOAD DU LOGO
     ============================================ */
  async function handleFile(file: File) {
    setUploading(true)
    const toastId = toast.loading('Compression du logo...')

    try {
      // ✅ Étape 1 : compression
      const compression = await compressImage(file, 'logo')

      if (!compression.success) {
        toast.error(compression.error, { id: toastId })
        setUploading(false)
        return
      }

      if (compression.warning) {
        toast.info(compression.warning, { id: toastId, duration: 3000 })
      }

      // ✅ Étape 2 : upload
      toast.loading(
        `Upload... ${formatBytes(compression.originalSize)} → ${formatBytes(
          compression.compressedSize
        )}`,
        { id: toastId }
      )

      const formData = new FormData()
      formData.append('file', compression.file)
      formData.append('shopSlug', shopSlug)

      const result = await uploadShopLogo(formData)

      if (result?.error) {
        toast.error(result.error, { id: toastId })
        setUploading(false)
        return
      }

      if (!result?.logoUrl) {
        toast.error("Aucune URL retournée par l'upload.", { id: toastId })
        setUploading(false)
        return
      }

      setLogoUrl(result.logoUrl)

      toast.success(
        compression.reduction > 0
          ? `Logo uploadé ! (-${compression.reduction}% · ${formatBytes(
              compression.compressedSize
            )})`
          : 'Logo uploadé !',
        { id: toastId }
      )
    } catch (err: any) {
      console.error('Logo upload error:', err)
      toast.error(err?.message || "Erreur lors de l'upload", { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  /* ============================================
     SUPPRESSION — Ouvre le modal
     ============================================ */
  function requestDelete() {
    setConfirmDelete(true)
  }

  /* ============================================
     SUPPRESSION — Confirmée par l'utilisateur
     ============================================ */
  async function handleConfirmDelete() {
    if (!logoUrl) return

    setDeleting(true)
    const toastId = toast.loading('Suppression...')

    try {
      const result = await deleteShopLogo(logoUrl)

      if (result?.error) {
        toast.error(result.error, { id: toastId })
        return
      }

      setLogoUrl(null)
      toast.success('Logo supprimé', { id: toastId })
    } catch (err: any) {
      console.error('Delete logo error:', err)
      toast.error(err?.message || 'Erreur lors de la suppression', {
        id: toastId,
      })
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  /* ============================================
     DRAG & DROP
     ============================================ */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <>
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
          Logo de la boutique
        </label>

        <div className="flex items-center gap-4">
          {/* Zone de prévisualisation */}
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
            className={`relative w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all shrink-0 ${
              dragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
            } ${uploading ? 'opacity-60 cursor-wait' : ''}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ''
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[9px] text-slate-500 font-medium">
                  Traitement...
                </p>
              </div>
            ) : logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={shopName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                <svg
                  className="w-6 h-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                  Ajouter
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                {logoUrl ? 'Changer' : 'Choisir un fichier'}
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={requestDelete}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
              Format carré conseillé · PNG / JPG / WEBP · Max 25 Mo
              <br />
              <span className="text-emerald-600 font-semibold">
                ✨ Compression automatique (max 150 Ko)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          MODAL DE CONFIRMATION
          ============================================ */}
      {confirmDelete && logoUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Aperçu du logo */}
            <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo à supprimer"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Supprimer le logo ?
            </h3>
            <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">
              Le logo sera retiré de votre boutique. Vous pourrez en
              uploader un autre à tout moment.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
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