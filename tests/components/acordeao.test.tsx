import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Acordeao from '@/components/ui/Acordeao'

const ITENS = [
  { id: 'a', titulo: 'As Escrituras', conteudo: <p>Texto A</p> },
  { id: 'b', titulo: 'A Igreja', conteudo: <p>Texto B</p> },
]

describe('Acordeao', () => {
  it('começa com todos os painéis fechados, mas presentes no DOM (SEO: o rastreador não clica em acordeões)', () => {
    render(<Acordeao itens={ITENS} />)
    expect(screen.getByRole('button', { name: 'As Escrituras' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Texto A')).toBeInTheDocument()
    expect(screen.getByText('Texto A')).not.toBeVisible()
  })

  it('abre o painel ao clicar e liga aria-controls ao id do painel', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    const botao = screen.getByRole('button', { name: 'As Escrituras' })
    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    const painel = screen.getByText('Texto A').closest('[role="region"]')
    expect(painel).toHaveAttribute('id', botao.getAttribute('aria-controls'))
    expect(screen.getByText('Texto A')).toBeVisible()
  })

  it('fecha o painel anterior ao abrir outro, mantendo o conteúdo fechado no DOM', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    await user.click(screen.getByRole('button', { name: 'A Igreja' }))
    expect(screen.getByText('Texto A')).toBeInTheDocument()
    expect(screen.getByText('Texto A')).not.toBeVisible()
    expect(screen.getByText('Texto B')).toBeVisible()
  })

  it('abre pelo teclado com Enter', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Texto A')).toBeVisible()
  })

  it('abre pelo teclado com Espaço', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.tab()
    await user.keyboard(' ')
    expect(screen.getByText('Texto A')).toBeVisible()
  })
})
