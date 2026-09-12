'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/clients'

export default function InscriptionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const passwordStrength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (fullName.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères')
      return
    }
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'seller',
          full_name: fullName.trim(),
        },
      },
    })

    if (error) {
      setError(error.message)
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Compte créé ! Bienvenue sur LiveShop 🎉', {
      description: 'Redirection vers votre dashboard...',
    })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 overflow-hidden animate-fade-in-up">
      {/* Bande dégradé */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      {/* Blobs décoratifs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-200/40 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl animate-float delay-1000 pointer-events-none" />

      <div className="relative">
        {/* En-tête */}
        <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 mb-4 animate-bounce-subtle">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Créer un compte
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Commencez à vendre en live en quelques minutes.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-8 space-y-5"
        >
          {/* Nom */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Nom complet
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused === 'name'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                  focused === 'name' ? 'text-indigo-500' : 'text-slate-400'
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder="Ex : Fatima Diallo"
                maxLength={80}
                className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Email
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused === 'email'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                  focused === 'email' ? 'text-indigo-500' : 'text-slate-400'
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="vous@exemple.com"
                className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2"
            >
              Mot de passe
            </label>
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                focused === 'password'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                  : ''
              }`}
            >
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Indicateur de force */}
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
                  <p
                    className={`text-xs font-semibold ${passwordStrength.textColor}`}
                  >
                    Force : {passwordStrength.label}
                  </p>
                  {passwordStrength.score === 4 && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Parfait
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
              <p className="text-sm text-red-700 flex items-start gap-2 font-medium">
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden btn-shine"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                Créer mon compte
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

          {/* Lien connexion */}
          <p className="text-sm text-center text-slate-600">
            Déjà un compte ?{' '}
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