'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { requestPasswordReset } from '@/lib/actions/password'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await requestPasswordReset(email)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success('Demande enregistrée !', {
      description: 'Vous recevrez un email dans quelques instants.',
    })
    setSent(true)
    setLoading(false)
  }

  // ============================================
  // Vue « Email programmé »
  // ============================================
  if (sent) {
    return (
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 overflow-hidden animate-fade-in-up">
        {/* Bande dégradé */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600" />

        {/* Blobs décoratifs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl animate-float delay-1000 pointer-events-none" />

        <div className="relative px-6 sm:px-8 py-10 text-center">
          {/* Icône succès */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-scale-in">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Demande enregistrée
          </h2>

          <p className="text-sm text-slate-500 mt-3">
            Un lien de réinitialisation sera envoyé à
          </p>

          <p className="text-sm font-bold text-slate-900 mt-2 break-all bg-slate-100 px-4 py-2.5 rounded-xl inline-block">
            {email}
          </p>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Délai d'envoi
                </p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  L'email sera envoyé sous{' '}
                  <strong>1 à 2 minutes</strong>. Pensez à vérifier
                  vos <strong>spams</strong>.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Le lien expire dans <strong>1 heure</strong>.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              className="w-full text-sm font-semibold text-slate-700 py-3.5 rounded-2xl hover:bg-slate-100 active:scale-[0.98] transition-all"
            >
              Renvoyer avec un autre email
            </button>
            <Link
              href="/connexion"
              className="block w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 py-2 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // Vue formulaire
  // ============================================
  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 overflow-hidden animate-fade-in-up">
      {/* Bande dégradé */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      {/* Blobs décoratifs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl animate-float delay-1000 pointer-events-none" />

      <div className="relative">
        {/* En-tête */}
        <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 mb-4 animate-bounce-subtle">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mot de passe oublié ?
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Saisissez votre email pour recevoir un lien de
            réinitialisation.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Email
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                  focused ? 'text-indigo-500' : 'text-slate-400'
                }`}
              >
                <svg
                  className="w-5 h-5"
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
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="vous@exemple.com"
                className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden btn-shine"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Envoyer le lien
              </>
            )}
          </button>

          {/* Séparateur */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                ou
              </span>
            </div>
          </div>

          <p className="text-sm text-center text-slate-600">
            Vous vous en souvenez ?{' '}
            <Link
              href="/connexion"
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}