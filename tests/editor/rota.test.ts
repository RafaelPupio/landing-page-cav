import { afterEach, describe, expect, it, vi } from 'vitest'

const original = process.env.NODE_ENV

afterEach(() => {
  vi.resetModules()
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: original,
    configurable: true,
    writable: true,
    enumerable: true,
  })
})

async function carregarRota(ambiente: string) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: ambiente,
    configurable: true,
    writable: true,
    enumerable: true,
  })
  vi.resetModules()
  return import('@/app/api/content/route')
}

describe('GET /api/content', () => {
  it('responde 404 em produção', async () => {
    const { GET } = await carregarRota('production')
    const resposta = await GET()
    expect(resposta.status).toBe(404)
  })

  it('devolve o conteúdo em desenvolvimento', async () => {
    const { GET } = await carregarRota('development')
    const resposta = await GET()
    expect(resposta.status).toBe(200)
    const corpo = await resposta.json()
    expect(corpo.site.nome).toBeTruthy()
  })
})

describe('PUT /api/content', () => {
  it('responde 404 em produção sem gravar nada', async () => {
    const { PUT } = await carregarRota('production')
    const resposta = await PUT(new Request('http://localhost/api/content', { method: 'PUT', body: '{}' }))
    expect(resposta.status).toBe(404)
  })

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
})
