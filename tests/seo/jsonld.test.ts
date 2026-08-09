import { describe, expect, it } from 'vitest'
import { dadosDaIgreja } from '@/lib/jsonld'
import { site } from '@/content/load'

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
