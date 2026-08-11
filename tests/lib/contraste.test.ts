import { describe, expect, it } from 'vitest'
import { site } from '@/content/load'

/**
 * O design inteiro depende de um fato medível: sobre o fundo escuro o limão passa
 * AA em qualquer tamanho. Foi isso que liberou os rótulos, o subtítulo do hero e a
 * faixa de horário em limão.
 *
 * Se alguém clarear `tema.fundo` pelo /editar — voltar para o verde antigo, por
 * exemplo — essa premissa cai e metade do texto da página vira ilegível para quem
 * tem baixa visão, sem nenhum sintoma visível para quem enxerga bem.
 *
 * Por isso o teste não checa classe de cor: checa o contraste de verdade.
 */

function canalLinear(valor: number): number {
  const c = valor / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminancia(hex: string): number {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b)
}

export function contraste(a: string, b: string): number {
  const [la, lb] = [luminancia(a), luminancia(b)]
  const [claro, escuro] = la > lb ? [la, lb] : [lb, la]
  return (claro + 0.05) / (escuro + 0.05)
}

const { verdeLimao, creme, grafite, fundo, superficie } = site.tema
const AA_TEXTO_NORMAL = 4.5

describe('contraste dos tokens do tema', () => {
  it('limão passa AA de texto normal sobre o fundo', () => {
    expect(contraste(verdeLimao, fundo)).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL)
  })

  it('limão passa AA de texto normal sobre a superfície das faixas', () => {
    expect(contraste(verdeLimao, superficie)).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL)
  })

  it('creme passa AA sobre o fundo', () => {
    expect(contraste(creme, fundo)).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL)
  })

  it('creme a 90% ainda passa AA sobre o fundo', () => {
    const misturado = misturar(creme, fundo, 0.9)
    expect(contraste(misturado, fundo)).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL)
  })

  it('grafite passa AA dentro do cartão creme da visita', () => {
    expect(contraste(grafite, creme)).toBeGreaterThanOrEqual(AA_TEXTO_NORMAL)
  })

  it('o fundo é escuro o bastante para sustentar a decisão do limão', () => {
    // Documenta o valor real medido, para a próxima pessoa não precisar recalcular.
    expect(contraste(verdeLimao, fundo)).toBeGreaterThan(9)
  })
})

function misturar(frente: string, atras: string, alfa: number): string {
  const canais = (hex: string) => {
    const h = hex.replace('#', '')
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  const [f, a] = [canais(frente), canais(atras)]
  return `#${f
    .map((v, i) => Math.round(alfa * v + (1 - alfa) * a[i]).toString(16).padStart(2, '0'))
    .join('')}`
}
