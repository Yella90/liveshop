'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  uploadProductImage,
  deleteProductImage,
} from '@/lib/actions/upload'

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
  const inputRef = useRef<HTMLInputElement>(null)

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
        `Seules les ${remaining} premières images ont été ajoutées`
      )
    }

    setUploading(true)
    const toastId = toast.loading(
      `Upload de ${toUpload.length} image${
        toUpload.length > 1 ? 's' : ''
      }...`
    )

    const uploaded: string[] = []
    const errors: string[] = []

    for (const file of toUpload) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('shopSlug', shopSlug)

      const result = await uploadProductImage(formData)
      if (result?.error) {
        errors.push(`${file.name} : ${result.error}`)
      } else if (result?.url) {
        uploaded.push(result.url)
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded])
      toast.success(
        `${uploaded.length} image${
          uploaded.length > 1 ? 's' : ''
        } ajoutée${uploaded.length > 1 ? 's' : ''}`,
        { id: toastId }
      )
    } else {
      toast.dismiss(toastId)
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err))
    }

    setUploading(false)
  }

  async function handleRemove(url: string) {
    if (!confirm('Supprimer cette image ?')) return

    const next = images.filter((u) => u !== url)
    onChange(next)

    const toastId = toast.loading('Suppression...')
    const result = await deleteProductImage(url)

    if (result?.error) {
      toast.error(result.error, { id: toastId })
      // Restaurer en cas d'échec
      onChange(images)
    } else {
      toast.success('Image supprimée', { id: toastId })
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
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
            <p className="text-sm text-slate-600">Upload en cours...</p>
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
              JPG, PNG, WEBP, GIF · Max 5 Mo · {images.length}/{maxImages}
            </p>
          </>
        )}
      </div>

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
                onClick={() => handleRemove(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
  )
}