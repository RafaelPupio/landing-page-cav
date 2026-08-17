import { describe, expect, it } from 'vitest'
import nextConfig from '../../next.config'

/**
 * Os cabeçalhos de segurança são configuração, não código de tela: não tem
 * componente para renderizar nem rota para chamar. O que dá para verificar é
 * que `next.config.ts` realmente devolve cada um deles para todas as rotas —
 * se alguém apagar o bloco `headers()` numa refatoração, isso some em silêncio
 * e ninguém percebe, porque o site continua funcionando igual.
 */
async function cabecalhosDaRaiz(): Promise<Record<string, string>> {
  const regras = await nextConfig.headers!()
  const paraTodasAsRotas = regras.find((regra) => regra.source === '/:caminho*')
  if (!paraTodasAsRotas) throw new Error('Nenhuma regra de cabeçalho cobrindo todas as rotas')
  return Object.fromEntries(paraTodasAsRotas.headers.map(({ key, value }) => [key, value]))
}

describe('cabeçalhos de segurança', () => {
  it('aplica os cabeçalhos a todas as rotas', async () => {
    const regras = await nextConfig.headers!()
    expect(regras.some((regra) => regra.source === '/:caminho*')).toBe(true)
  })

  it.each([
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ])('define %s', async (nome) => {
    const cabecalhos = await cabecalhosDaRaiz()
    expect(cabecalhos[nome]).toBeTruthy()
  })

  it('nega enquadramento do site por terceiros', async () => {
    const { 'Content-Security-Policy': csp } = await cabecalhosDaRaiz()
    expect(csp).toMatch(/frame-ancestors 'none'/)
  })

  it('bloqueia plugins e sequestro da tag <base>', async () => {
    const { 'Content-Security-Policy': csp } = await cabecalhosDaRaiz()
    expect(csp).toMatch(/object-src 'none'/)
    expect(csp).toMatch(/base-uri 'self'/)
  })

  // A única origem de terceiros que a página carrega é o mapa do Google, num
  // <iframe> em Visita.tsx. Se `frame-src` deixar de listá-la, o mapa some da
  // página em produção — e some sem erro visível, só um retângulo vazio.
  it('libera o mapa do Google em frame-src, que é a única origem de terceiros da página', async () => {
    const { 'Content-Security-Policy': csp } = await cabecalhosDaRaiz()
    expect(csp).toMatch(/frame-src[^;]*maps\.google\.com/)
  })

  // Nenhum script vem de fora: o Next serve os próprios chunks a partir de
  // /_next/, e next/font/google baixa a Poppins no build (vira /_next/static).
  it('não libera nenhum domínio externo para scripts', async () => {
    const { 'Content-Security-Policy': csp } = await cabecalhosDaRaiz()
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!
    expect(scriptSrc).not.toMatch(/https?:\/\//)
  })
})
