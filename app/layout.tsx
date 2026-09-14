import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import PWARegister from '@/components/PWARegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LiveShop — Live selling pour l'Afrique",
  description:
    'Gérez vos ventes en live sur TikTok, Facebook et Instagram.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <PWARegister />
        {children}
        <Analytics />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: inter.style.fontFamily,
            },
          }}
        />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: inter.style.fontFamily,
            },
          }}
        />
      </body>
    </html>
  )
}