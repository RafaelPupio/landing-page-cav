import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Trilha from '@/components/ui/Trilha'
import Capitulo from '@/components/ui/Capitulo'
import Chip from '@/components/ui/Chip'

describe('Trilha e Capitulo', () => {
  it('renderiza cada capítulo como section com a própria âncora', () => {
    const { container } = render(
      <Trilha>
        <Capitulo id="historia" rotulo="Abril de 2017" titulo="Começou numa garagem">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    const secao = container.querySelector('section#historia')
    expect(secao).not.toBeNull()
    expect(secao?.tagName).toBe('SECTION')
  })

  it('usa o título como h2 e o rótulo como texto de apoio', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="Nosso alicerce" titulo="Como Cremos">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Como Cremos')
    expect(screen.getByText('Nosso alicerce')).toBeInTheDocument()
  })

  it('mantém o rótulo em creme, não em limão — limão reprova contraste em texto pequeno', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="Abril de 2017" titulo="Título">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    const rotulo = screen.getByText('Abril de 2017')
    expect(rotulo.className).toContain('text-creme')
    expect(rotulo.className).not.toContain('text-verde-limao')
  })

  it('renderiza os filhos do capítulo', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="R" titulo="T">
          <p>Conteúdo interno</p>
        </Capitulo>
      </Trilha>,
    )
    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('renderiza como item de lista', () => {
    render(<ul><Chip>Honra</Chip></ul>)
    expect(screen.getByRole('listitem')).toHaveTextContent('Honra')
  })
})
