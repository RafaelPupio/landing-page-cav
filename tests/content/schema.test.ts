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

  it('rejeita dois grupos de credo com o mesmo id', () => {
    const quebrado = structuredClone(conteudo) as { credo: { grupos: { id: string }[] } }
    quebrado.credo.grupos[1].id = quebrado.credo.grupos[0].id
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

  // mapaEmbedUrl vai direto para o `src` de um <iframe>. Diferente dos outros
  // links, o navegador não espera um clique: ele carrega esse endereço sozinho,
  // dentro da página. Um `javascript:` ou um http:// em texto puro aqui vale
  // bem mais que num link comum — por isso a trava é mais apertada que a dos
  // campos vizinhos, e por isso ela tem teste próprio.
  it.each([
    ['javascript:alert(1)', 'esquema javascript:'],
    ['http://maps.google.com/maps?output=embed', 'http sem TLS'],
    ['maps.google.com/maps?output=embed', 'endereço sem esquema'],
    ['data:text/html,<h1>oi</h1>', 'data: URI'],
  ])('rejeita %s como mapaEmbedUrl (%s)', (valor) => {
    const quebrado = structuredClone(conteudo) as { contato: { mapaEmbedUrl: string } }
    quebrado.contato.mapaEmbedUrl = valor
    const resultado = siteSchema.safeParse(quebrado)
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['contato', 'mapaEmbedUrl'])
    }
  })

  // Vazio continua válido: Visita.tsx faz `{contato.mapaEmbedUrl && ...}`, ou
  // seja, string vazia é a forma de dizer "não mostre o mapa" sem quebrar nada.
  it('aceita mapaEmbedUrl vazio — é assim que se esconde o mapa', () => {
    const semMapa = structuredClone(conteudo) as { contato: { mapaEmbedUrl: string } }
    semMapa.contato.mapaEmbedUrl = ''
    expect(siteSchema.safeParse(semMapa).success).toBe(true)
  })

  it('rejeita "Domingo" em diaSemana — exige o nome do dia em inglês, que é o que o schema.org/Google entende', () => {
    const quebrado = structuredClone(conteudo) as { horarios: { diaSemana: string }[] }
    quebrado.horarios[0].diaSemana = 'Domingo'
    const resultado = siteSchema.safeParse(quebrado)
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['horarios', 0, 'diaSemana'])
      expect(resultado.error.issues[0].message).toMatch(/inglês/)
    }
  })
})
