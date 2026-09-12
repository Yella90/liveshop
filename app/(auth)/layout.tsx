import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-slate-900">LiveShop</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* Contenu centré */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Logo mobile + titre */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
              <span className="text-white font-bold text-xl sm:text-2xl">
                L
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              LiveShop
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Vendez en live, simplement.
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}