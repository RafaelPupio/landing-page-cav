import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { site } from '@/content/load'
import { variaveisDeTema } from '@/lib/tema'
import JsonLd from '@/components/seo/JsonLd'
import { dadosDaIgreja } from '@/lib/jsonld'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.site.url),
  title: {
    default: `${site.site.nome} — ${site.contato.cidade}/${site.contato.estado}`,
    template: `%s — ${site.site.nome}`,
  },
  description: site.site.descricao,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.site.url,
    siteName: site.site.nome,
    title: `${site.site.nome} — ${site.contato.cidade}/${site.contato.estado}`,
    description: site.site.descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.site.nome,
    description: site.site.descricao,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body style={variaveisDeTema(site.tema)} className="font-sans antialiased">
        <JsonLd dados={dadosDaIgreja(site)} />
        {children}
      </body>
    </html>
  )
}
