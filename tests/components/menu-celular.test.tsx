import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MenuCelular from '@/components/ui/MenuCelular'

const ITENS = [
  { rotulo: 'Mensagens', ancora: '#mensagens' },
  { rotulo: 'Visitar', ancora: '#visita' },
]

function menu(container: HTMLElement) {
  return container.querySelector('details') as HTMLDetailsElement
}

describe('MenuCelular', () => {
  it('começa fechado', () => {
    const { container } = render(<MenuCelular itens={ITENS} rotulo="Abrir menu" />)
    expect(menu(container).open).toBe(false)
  })

  it('abre ao clicar no botão', async () => {
    const user = userEvent.setup()
    const { container } = render(<MenuCelular itens={ITENS} rotulo="Abrir menu" />)
    await user.click(screen.getByLabelText('Abrir menu'))
    expect(menu(container).open).toBe(true)
  })

  // O ponto do pedido: o menu ficava aberto por cima da seção recém-escolhida.
  it('fecha ao escolher um item', async () => {
    const user = userEvent.setup()
    const { container } = render(<MenuCelular itens={ITENS} rotulo="Abrir menu" />)
    await user.click(screen.getByLabelText('Abrir menu'))
    await user.click(screen.getByRole('link', { name: 'Mensagens' }))
    expect(menu(container).open).toBe(false)
  })

  it('fecha com Esc e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    const { container } = render(<MenuCelular itens={ITENS} rotulo="Abrir menu" />)
    await user.click(screen.getByLabelText('Abrir menu'))
    await user.keyboard('{Escape}')
    expect(menu(container).open).toBe(false)
    expect(screen.getByLabelText('Abrir menu')).toHaveFocus()
  })

  it('fecha ao tocar fora', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <MenuCelular itens={ITENS} rotulo="Abrir menu" />
        <button type="button">fora</button>
      </div>,
    )
    await user.click(screen.getByLabelText('Abrir menu'))
    expect(menu(container).open).toBe(true)
    await user.click(screen.getByRole('button', { name: 'fora' }))
    expect(menu(container).open).toBe(false)
  })

  it('renderiza um link por item, apontando para a âncora', async () => {
    const user = userEvent.setup()
    render(<MenuCelular itens={ITENS} rotulo="Abrir menu" />)
    await user.click(screen.getByLabelText('Abrir menu'))
    for (const item of ITENS) {
      expect(screen.getByRole('link', { name: item.rotulo })).toHaveAttribute('href', item.ancora)
    }
  })
})
