import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { site } from '@/content/load'
import { variaveisDeTema } from '@/lib/tema'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: site.site.nome,
  description: site.site.descricao,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body style={variaveisDeTema(site.tema)} className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
