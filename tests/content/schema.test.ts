import { describe, expect, it } from 'vitest'
import { siteSchema } from '@/content/schema'
import conteudo from '@/content/site.json'

describe('siteSchema', () => {
  it('aceita o content/site.json real', () => {
    expect(() => siteSchema.parse(conteudo)).not.toThrow()
  })

  it('rejeita quando um campo obrigatório some, apontando o caminho', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    delete (quebrado.contato as Record<string, unknown>).logradouro
    const resultado = siteSchema.safeParse(quebrado)
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['contato', 'logradouro'])
    }
  })

  it('rejeita cor fora do formato hexadecimal', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    ;(quebrado.tema as Record<string, unknown>).creme = 'bege'
    expect(siteSchema.safeParse(quebrado).success).toBe(false)
  })

  it('exige exatamente 3 pilares de cuidado', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    ;(quebrado.cuidado as { pilares: unknown[] }).pilares.pop()
    expect(siteSchema.safeParse(quebrado).success).toBe(false)
  })

  it('rejeita href de acoesRapidas fora dos formatos aceitos (âncora, caminho, URL, mailto, tel)', () => {
    const quebrado = structuredClone(conteudo) as { acoesRapidas: { href: string }[] }
    quebrado.acoesRapidas[0].href = 'httpfoo'
    const resultado = siteSchema.safeParse(quebrado)
    expect(resultado.success).toBe(false)
  })

  it('exige rótulo em todos os capítulos da trilha', () => {
    for (const capitulo of ['historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita']) {
      const quebrado = structuredClone(conteudo) as unknown as Record<string, Record<string, unknown>>
      delete quebrado[capitulo].rotulo
      expect(siteSchema.safeParse(quebrado).success, `${capitulo} sem rótulo`).toBe(false)
    }
  })
})
