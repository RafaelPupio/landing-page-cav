import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Credo from '@/components/sections/Credo'

const CREDO = {
  rotulo: 'Nosso alicerce',
  titulo: 'Como Cremos',
  intro: 'Somos uma Comunidade evangélica.',
  grupos: [
    { id: 'escrituras', nome: 'As Escrituras', declaracoes: [{ titulo: 'A Bíblia', texto: 'CREMOS na inspiração divina.' }] },
    {
      id: 'trindade',
      nome: 'Deus, Cristo e o Espírito',
      declaracoes: [
        { titulo: 'Deus', texto: 'CREMOS em um único Deus.' },
        { titulo: 'Jesus Cristo', texto: 'CREMOS no Senhor Jesus Cristo.' },
      ],
    },
  ],
}

describe('Credo', () => {
  it('cria uma âncora por grupo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('#credo-escrituras')).not.toBeNull()
    expect(container.querySelector('#credo-trindade')).not.toBeNull()
  })

  it('mantém as declarações fechadas até o clique, mas presentes no DOM', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    // Presente no HTML mesmo fechado — é o que permite ao Google indexar o credo.
    expect(screen.getByText('CREMOS em um único Deus.')).toBeInTheDocument()
    expect(screen.getByText('CREMOS em um único Deus.')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Deus, Cristo e o Espírito' }))
    expect(screen.getByText('CREMOS em um único Deus.')).toBeVisible()
    expect(screen.getByText('CREMOS no Senhor Jesus Cristo.')).toBeVisible()
  })

  it('renderiza o título de cada declaração aberta como h4', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('A Bíblia')
  })

  it('expõe a âncora #credo e o rótulo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('section#credo')).not.toBeNull()
    expect(screen.getByText('Nosso alicerce')).toBeInTheDocument()
  })
})
