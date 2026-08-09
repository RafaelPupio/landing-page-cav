import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Acordeao from '@/components/ui/Acordeao'

const ITENS = [
  { id: 'a', titulo: 'As Escrituras', conteudo: <p>Texto A</p> },
  { id: 'b', titulo: 'A Igreja', conteudo: <p>Texto B</p> },
]

describe('Acordeao', () => {
  it('começa com todos os painéis fechados', () => {
    render(<Acordeao itens={ITENS} />)
    expect(screen.getByRole('button', { name: 'As Escrituras' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Texto A')).not.toBeInTheDocument()
  })

  it('abre o painel ao clicar e liga aria-controls ao id do painel', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    const botao = screen.getByRole('button', { name: 'As Escrituras' })
    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    const painel = screen.getByText('Texto A').closest('[role="region"]')
    expect(painel).toHaveAttribute('id', botao.getAttribute('aria-controls'))
  })

  it('fecha o painel anterior ao abrir outro', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    await user.click(screen.getByRole('button', { name: 'A Igreja' }))
    expect(screen.queryByText('Texto A')).not.toBeInTheDocument()
    expect(screen.getByText('Texto B')).toBeInTheDocument()
  })

  it('abre pelo teclado com Enter', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Texto A')).toBeInTheDocument()
  })
})
