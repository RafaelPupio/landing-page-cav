import { describe, expect, it } from 'vitest'
import { metadata } from '@/app/layout'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { site } from '@/content/load'

describe('robots', () => {
  const resultado = robots()

  it('bloqueia /editar e /api/, únicas rotas privadas do projeto', () => {
    const regra = Array.isArray(resultado.rules) ? resultado.rules[0] : resultado.rules
    expect(regra?.disallow).toContain('/editar')
    expect(regra?.disallow).toContain('/api/')
  })

  it('libera o resto do site para indexação', () => {
    const regra = Array.isArray(resultado.rules) ? resultado.rules[0] : resultado.rules
    expect(regra?.allow).toBe('/')
  })

  it('aponta para o sitemap da URL real do site', () => {
    expect(resultado.sitemap).toBe(`${site.site.url}/sitemap.xml`)
  })
})

describe('sitemap', () => {
  it('aponta para a URL do site definida em content/site.json', () => {
    const resultado = sitemap()
    expect(resultado).toHaveLength(1)
    expect(resultado[0].url).toBe(site.site.url)
  })
})

describe('metadata (app/layout.tsx)', () => {
  it('define canonical "/" via alternates', () => {
    expect(metadata.alternates).toMatchObject({ canonical: '/' })
  })

  it('usa locale pt_BR no Open Graph', () => {
    expect(metadata.openGraph).toMatchObject({ locale: 'pt_BR' })
  })

  it('traz a descrição vinda de content/site.json em description, Open Graph e Twitter', () => {
    expect(metadata.description).toBe(site.site.descricao)
    expect(metadata.openGraph).toMatchObject({ description: site.site.descricao })
    expect(metadata.twitter).toMatchObject({ description: site.site.descricao })
  })

  it('usa o nome do site (content/site.json) no título e no Open Graph', () => {
    expect(metadata.openGraph).toMatchObject({ siteName: site.site.nome, url: site.site.url })
    expect(metadata.twitter).toMatchObject({ title: site.site.nome })
  })

  it('define metadataBase a partir da URL do site, para resolver OG/canonical relativos', () => {
    expect(String(metadata.metadataBase)).toBe(`${site.site.url}/`)
  })
})
