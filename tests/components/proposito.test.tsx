import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Proposito from '@/components/sections/Proposito'

const PROPOSITO = {
  rotulo: 'O que nos move',
  titulo: 'Missão, visão e valores',
  missao: 'Revelar o amor do Pai.',
  visaoTitulo: 'Visão',
  visao: ['Amar a Deus', 'Pregar a Cristo'],
  valoresTitulo: 'Valores',
  valores: ['Honra', 'Adoração', 'Generosidade'],
}

describe('Proposito', () => {
  it('renderiza o título do capítulo como h2', () => {
    render(<Proposito proposito={PROPOSITO} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Missão, visão e valores')
  })

  it('renderiza visão e valores como h3', () => {
    render(<Proposito proposito={PROPOSITO} />)
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titulos).toEqual(['Visão', 'Valores'])
  })

  it('renderiza um item de lista por item de visão e por valor', () => {
    render(<Proposito proposito={PROPOSITO} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('expõe a âncora #proposito', () => {
    const { container } = render(<Proposito proposito={PROPOSITO} />)
    expect(container.querySelector('section#proposito')).not.toBeNull()
  })
})
