import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function Ola() {
  return <h1>Comunidade Árvore da Vida</h1>
}

describe('infraestrutura de testes', () => {
  it('renderiza um componente React no jsdom', () => {
    render(<Ola />)
    expect(screen.getByRole('heading')).toHaveTextContent('Comunidade Árvore da Vida')
  })
})
