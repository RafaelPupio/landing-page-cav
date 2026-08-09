import { afterEach, describe, expect, it, vi } from 'vitest'

const original = process.env.NODE_ENV

/**
 * Define `NODE_ENV` para o teste seguinte. `undefined` remove a variável de
 * fato (não deixa a string `"undefined"`) — é o caso "ninguém configurou
 * nada", que é exatamente o buraco do Achado 1 do review: uma trava
 * `=== 'production'` deixaria isso passar.
 */
function definirAmbiente(ambiente: string | undefined) {
  if (ambiente === undefined) {
    // Next.js tipa `NODE_ENV` como `readonly` em `NodeJS.ProcessEnv`
    // (node_modules/next/types/global.d.ts), então `delete
    // process.env.NODE_ENV` não compila (TS2704). `Reflect.deleteProperty`
    // faz a mesma remoção sem passar pelo operador `delete` verificado
    // pelo TypeScript.
    Reflect.deleteProperty(process.env, 'NODE_ENV')
    return
  }
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: ambiente,
    configurable: true,
    writable: true,
    enumerable: true,
  })
}

afterEach(() => {
  vi.resetModules()
  definirAmbiente(original)
})

async function carregarRota(ambiente: string | undefined) {
  definirAmbiente(ambiente)
  vi.resetModules()
  return import('@/app/api/content/route')
}

async function carregarPaginaEditar(ambiente: string | undefined) {
  definirAmbiente(ambiente)
  vi.resetModules()
  return import('@/app/editar/page')
}

// Só os dois extremos ('production' e 'development') não bastam: um
// NODE_ENV indefinido, 'test' ou 'staging' nunca seria exercitado, que é
// exatamente o buraco de uma trava fail-open (Achado 1 do review).
const ambientesQueDevemBloquear = [undefined, 'test', 'staging', 'production'] as const

describe('GET /api/content', () => {
  it('devolve o conteúdo em desenvolvimento', async () => {
    const { GET } = await carregarRota('development')
    const resposta = await GET()
    expect(resposta.status).toBe(200)
    const corpo = await resposta.json()
    expect(corpo.site.nome).toBeTruthy()
  })

  it.each(ambientesQueDevemBloquear)('responde 404 quando NODE_ENV é %s', async (ambiente) => {
    const { GET } = await carregarRota(ambiente)
    const resposta = await GET()
    expect(resposta.status).toBe(404)
  })
})

describe('PUT /api/content', () => {
  it('rejeita conteúdo inválido com 422 e a lista de erros', async () => {
    const { PUT } = await carregarRota('development')
    const resposta = await PUT(
      new Request('http://localhost/api/content', { method: 'PUT', body: JSON.stringify({ tema: {} }) }),
    )
    expect(resposta.status).toBe(422)
    const corpo = await resposta.json()
    expect(Array.isArray(corpo.erros)).toBe(true)
    expect(corpo.erros.length).toBeGreaterThan(0)
  })

  it.each(ambientesQueDevemBloquear)('responde 404 sem gravar nada quando NODE_ENV é %s', async (ambiente) => {
    const { PUT } = await carregarRota(ambiente)
    const resposta = await PUT(new Request('http://localhost/api/content', { method: 'PUT', body: '{}' }))
    expect(resposta.status).toBe(404)
  })
})

describe('página /editar', () => {
  it('renderiza o formulário em desenvolvimento', async () => {
    const { default: PaginaEditar } = await carregarPaginaEditar('development')
    expect(() => PaginaEditar()).not.toThrow()
  })

  it.each(ambientesQueDevemBloquear)('chama notFound() quando NODE_ENV é %s', async (ambiente) => {
    const { default: PaginaEditar } = await carregarPaginaEditar(ambiente)
    let erro: unknown
    try {
      PaginaEditar()
    } catch (e) {
      erro = e
    }
    expect(erro).toBeDefined()
    expect((erro as { digest?: string }).digest).toContain('404')
  })
})
