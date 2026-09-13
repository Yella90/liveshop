'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { toast } from 'sonner'

export default function ShareQRCode() {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://liveshop-dusky.vercel.app'

  useEffect(() => {
    QRCode.toDataURL(siteUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [siteUrl])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      toast.success('Lien copié !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = 'liveshop-qr-code.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handleShareWhatsApp() {
    const text = encodeURIComponent(
      `Découvrez LiveShop — la plateforme de live selling pour l'Afrique : ${siteUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function handleShareEmail() {
    const subject = encodeURIComponent('Découvrez LiveShop')
    const body = encodeURIComponent(
      `Bonjour,\n\nJe vous invite à découvrir LiveShop, la plateforme de live selling pensée pour l'Afrique francophone.\n\n${siteUrl}\n\nÀ bientôt !`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
      {/* QR Code */}
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QR code LiveShop"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-slate-50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
          Scannez ce QR code avec votre téléphone pour accéder à LiveShop
        </p>

        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="inline-flex items-center gap-2 mt-4 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Télécharger le QR code
        </button>
      </div>

      {/* Liens et partage */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Lien de LiveShop
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={siteUrl}
              readOnly
              className="flex-1 min-w-0 px-4 py-3 text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl transition-all active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              title="Copier le lien"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Copié</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Boutons de partage */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Partager
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl active:scale-95 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={handleShareEmail}
              className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-3 rounded-xl active:scale-95 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed pt-2">
          💡 Partagez ce QR code avec vos amis, collègues ou sur vos
          réseaux sociaux pour leur faire découvrir LiveShop.
        </p>
      </div>
    </div>
  )
}