import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { dadosDaIgreja } from '@/lib/jsonld'
import { site } from '@/content/load'
import JsonLd from '@/components/seo/JsonLd'

describe('dadosDaIgreja', () => {
  const dados = dadosDaIgreja(site)

  it('declara o tipo Church do schema.org', () => {
    expect(dados['@context']).toBe('https://schema.org')
    expect(dados['@type']).toBe('Church')
  })

  it('inclui o endereço completo', () => {
    expect(dados.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: site.contato.logradouro,
      addressLocality: site.contato.cidade,
      addressRegion: site.contato.estado,
      addressCountry: 'BR',
    })
  })

  it('inclui o horário de culto no formato de openingHoursSpecification', () => {
    expect(dados.openingHoursSpecification).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '18:00',
        closes: '20:00',
      },
    ])
  })

  it('aponta sameAs para Instagram e YouTube', () => {
    expect(dados.sameAs).toEqual([site.redes.instagram, site.redes.youtube])
  })

  it('omite campos opcionais vazios', () => {
    expect(dados).not.toHaveProperty('telephone')
    expect(dados).not.toHaveProperty('geo')
  })

  it('gera um objeto serializável em JSON', () => {
    expect(() => JSON.stringify(dados)).not.toThrow()
    expect(JSON.parse(JSON.stringify(dados))['@type']).toBe('Church')
  })
})

describe('JsonLd (componente)', () => {
  it('escapa "</script>" em campo de texto livre, sem fechar a tag antes da hora, e preserva o valor original', () => {
    const valorMalicioso = 'Igreja</script><script>alert(1)</script>'
    const html = renderToStaticMarkup(<JsonLd dados={{ descricao: valorMalicioso }} />)

    // Só pode existir uma tag de fechamento real — a do próprio <script> do componente.
    const aberturaFim = html.indexOf('>') + 1
    const fechamentoReal = html.lastIndexOf('</script>')
    const conteudo = html.slice(aberturaFim, fechamentoReal)

    expect(conteudo).not.toContain('</script>')

    const dadosParseados = JSON.parse(conteudo)
    expect(dadosParseados.descricao).toBe(valorMalicioso)
  })
})


// Antes de existir domínio próprio, publicar com o valor do JSON faria canonical,
// og:url e JSON-LD apontarem para um endereço que não resolve. O resolvedor troca
// isso pela URL que a Vercel informa — e, quando o domínio for apontado, ela passa
// a ser o domínio real sem ninguém editar nada.
describe('urlDoSite', () => {
  const original = { ...process.env }
  afterEach(() => {
    process.env = { ...original }
    vi.resetModules()
  })

  async function resolver(env: Record<string, string | undefined>) {
    process.env = { ...original, ...env }
    vi.resetModules()
    const { urlDoSite } = await import('@/lib/urlDoSite')
    return urlDoSite()
  }

  it('usa o domínio do JSON quando não há variável de ambiente', async () => {
    expect(
      await resolver({ NEXT_PUBLIC_SITE_URL: undefined, VERCEL_PROJECT_PRODUCTION_URL: undefined }),
    ).toBe(site.site.url)
  })

  it('prefere a URL que a Vercel informa', async () => {
    expect(
      await resolver({
        NEXT_PUBLIC_SITE_URL: undefined,
        VERCEL_PROJECT_PRODUCTION_URL: 'landing-page-cav.vercel.app',
      }),
    ).toBe('https://landing-page-cav.vercel.app')
  })

  it('o escape manual vence a Vercel', async () => {
    expect(
      await resolver({
        NEXT_PUBLIC_SITE_URL: 'https://arvoredavidalrv.com.br',
        VERCEL_PROJECT_PRODUCTION_URL: 'landing-page-cav.vercel.app',
      }),
    ).toBe('https://arvoredavidalrv.com.br')
  })

  it('remove a barra final para não gerar canonical duplicado', async () => {
    expect(await resolver({ NEXT_PUBLIC_SITE_URL: 'https://exemplo.com.br/' })).toBe(
      'https://exemplo.com.br',
    )
  })
})
