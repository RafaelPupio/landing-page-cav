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
    for (const ancora of ['inicio', 'historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita']) {
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

  it('renderiza os 6 capítulos na ordem da trilha', () => {
    const { container } = render(<Pagina />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id)
    expect(ids).toEqual(['inicio', 'historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita'])
  })
})
