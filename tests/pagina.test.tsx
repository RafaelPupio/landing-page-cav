import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Pagina from '@/app/page'
import { site } from '@/content/load'

describe('página inicial', () => {
  it('tem exatamente um h1', () => {
    render(<Pagina />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('expõe todas as âncoras de seção', () => {
    const { container } = render(<Pagina />)
    for (const ancora of [
      'inicio',
      'historia',
      'proposito',
      'mensagens',
      'cuidado',
      'lideranca',
      'credo',
      'generosidade',
      'primeira-vez',
      'visita',
    ]) {
      expect(container.querySelector(`#${ancora}`), `âncora #${ancora}`).not.toBeNull()
    }
  })

  it('renderiza os 14 valores do conteúdo real', () => {
    const { container } = render(<Pagina />)
    // Escopado à seção de Propósito: "Generosidade" também é título de uma
    // declaração do Credo (grupo "Generosidade e últimas coisas"), então uma
    // busca sem escopo por esse valor encontra 2 elementos na página.
    const secaoProposito = container.querySelector('#proposito')
    expect(secaoProposito, 'seção #proposito').not.toBeNull()
    for (const valor of site.proposito.valores) {
      expect(within(secaoProposito as HTMLElement).getByText(valor)).toBeInTheDocument()
    }
  })

  it('renderiza hero e os 6 capítulos na ordem esperada', () => {
    const { container } = render(<Pagina />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id)
    expect(ids).toEqual([
      'inicio',
      'historia',
      'proposito',
      'mensagens',
      'cuidado',
      'lideranca',
      'credo',
      'generosidade',
      'primeira-vez',
      'visita',
    ])
  })

  // Já foi esquecido uma vez: os links do rodapé ficaram sem anel de foco algum
  // tempo, caindo no outline default do navegador. Trava para todo elemento
  // interativo da página, não só o rodapé, para não repetir o esquecimento em
  // outro lugar.
  it('todo elemento interativo usa a utility anel-de-foco/anel-de-foco-escuro, nunca o outline default', () => {
    render(<Pagina />)
    const interativos = [...screen.getAllByRole('link'), ...screen.getAllByRole('button')]
    expect(interativos.length).toBeGreaterThan(0)
    interativos.forEach((el) => {
      expect(el.className).toMatch(/focus-visible:anel-de-foco(-escuro)?\b/)
    })
  })

  // hidden: true inclui os h4 do Credo, que ficam dentro de painéis de acordeão
  // fechados por padrão (hidden nativo, não desmontados — Task 5). Sem essa opção
  // a query só enxergaria até h3 e o teste não provaria nada sobre h4.
  it('não pula nível na hierarquia de cabeçalhos (h1→h2→h3→h4, nenhum nível pulado)', () => {
    render(<Pagina />)
    const niveis = screen
      .getAllByRole('heading', { hidden: true })
      .map((h) => Number(h.tagName[1]))
    expect(niveis[0]).toBe(1)
    expect(niveis).toContain(4) // prova que os h4 do Credo entraram na checagem
    for (let i = 1; i < niveis.length; i++) {
      expect(niveis[i], `heading #${i}: h${niveis[i - 1]} → h${niveis[i]}`).toBeLessThanOrEqual(
        niveis[i - 1] + 1,
      )
    }
  })

  // Bug real, já corrigido uma vez sem rede de teste (ver comentário em app/page.tsx):
  // um <footer> descendente de <main> perde o papel de contentinfo e some da
  // navegação por landmarks.
  it('o <footer> não é descendente de <main>', () => {
    const { container } = render(<Pagina />)
    const main = container.querySelector('main')
    const footer = container.querySelector('footer')
    expect(main).not.toBeNull()
    expect(footer).not.toBeNull()
    expect(main?.contains(footer)).toBe(false)
  })
})
