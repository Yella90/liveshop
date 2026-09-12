'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { resetPasswordWithToken } from '@/lib/actions/password'

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NouveauMotDePasseContent />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 p-12 text-center animate-fade-in">
      <div className="w-12 h-12 mx-auto border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 mt-4 font-medium">
        Chargement...
      </p>
    </div>
  )
}

function NouveauMotDePasseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const passwordStrength = getPasswordStrength(password)
  const passwordsMatch =
    password.length > 0 && password === confirmPassword
  const canSubmit =
    password.length >= 6 && passwordsMatch && !loading && !!token

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!token) {
      toast.error('Token manquant. Refaire la demande.')
      return
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    setError(null)

    const toastId = toast.loading('Mise à jour...')
    const result = await resetPasswordWithToken(token, password)

    if (result?.error) {
      setError(result.error)
      toast.error(result.error, { id: toastId })
      setLoading(false)
      return
    }

    toast.success('Mot de passe mis à jour !', { id: toastId })
    setTimeout(() => {
      router.push('/connexion')
    }, 1000)
  }

  // Pas de token dans l'URL
  if (!token) {
    return (
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

        <div className="relative px-6 sm:px-8 py-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 shadow-xl shadow-red-500/30 animate-bounce-subtle">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Lien invalide
          </h2>
          <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
            Ce lien de réinitialisation est incomplet. Refaites une
            demande.
          </p>

          <Link
            href="/mot-de-passe-oublie"
            className="group inline-flex items-center gap-2 mt-8 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-xl active:scale-95 transition-all btn-shine"
          >
            Refaire une demande
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500" />

      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl animate-float delay-1000 pointer-events-none" />

      <div className="relative">
        <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 mb-4 animate-bounce-subtle">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Nouveau mot de passe
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Choisissez un mot de passe sécurisé.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-8 space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Nouveau mot de passe
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused === 'password'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                  focused === 'password'
                    ? 'text-indigo-500'
                    : 'text-slate-400'
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="6 caractères minimum"
                className="w-full pl-12 pr-12 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-3 space-y-2 animate-fade-in">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= level
                          ? passwordStrength.color
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-semibold ${passwordStrength.textColor}`}>
                    Force : {passwordStrength.label}
                  </p>
                  {passwordStrength.score === 4 && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Parfait
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Confirmer le mot de passe
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused === 'confirm'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                  focused === 'confirm'
                    ? 'text-indigo-500'
                    : 'text-slate-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
                placeholder="Retapez le mot de passe"
                className={`w-full pl-12 pr-12 py-3.5 text-base text-slate-900 bg-slate-50 border rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-emerald-300'
                      : 'border-red-300'
                    : 'border-slate-200'
                }`}
              />

              {confirmPassword.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center animate-scale-in">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center animate-scale-in">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
              <p className="text-sm text-red-700 flex items-start gap-2 font-medium">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all overflow-hidden btn-shine"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer le mot de passe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ============================================
   Utilitaire : force du mot de passe
   ============================================ */
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  textColor: string
} {
  if (password.length === 0) {
    return {
      score: 0,
      label: '',
      color: 'bg-slate-200',
      textColor: 'text-slate-400',
    }
  }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) {
    return {
      score: 1,
      label: 'Faible',
      color: 'bg-gradient-to-r from-red-400 to-red-500',
      textColor: 'text-red-600',
    }
  }
  if (score === 2) {
    return {
      score: 2,
      label: 'Moyen',
      color: 'bg-gradient-to-r from-amber-400 to-amber-500',
      textColor: 'text-amber-600',
    }
  }
  if (score === 3) {
    return {
      score: 3,
      label: 'Bon',
      color: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
      textColor: 'text-emerald-600',
    }
  }
  return {
    score: 4,
    label: 'Excellent',
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-700',
  }
}