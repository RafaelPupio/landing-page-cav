import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Agenda from '@/components/sections/Agenda'

const VAZIA = {
  rotulo: 'O mês na igreja',
  titulo: 'Agenda',
  intro: 'O que vai acontecer.',
  periodo: '',
  imagem: '',
  canvaEmbedUrl: '',
  canvaUrl: '',
}

describe('Agenda', () => {
  // Degradação: sem agenda publicada, nada de moldura vazia esperando cartaz.
  it('não renderiza nada enquanto não há agenda publicada', () => {
    const { container } = render(<Agenda agenda={VAZIA} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra a imagem da agenda quando há uma publicada', () => {
    render(<Agenda agenda={{ ...VAZIA, imagem: '/agenda-agosto.png', periodo: 'Agosto de 2026' }} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/agenda-agosto.png')
    expect(img.getAttribute('alt')).toContain('Agosto de 2026')
    expect(screen.getByText('Agosto de 2026')).toBeInTheDocument()
  })

  // A imagem carrega mais rápido, não depende de terceiro no ar e não vaza dado.
  it('prefere a imagem ao Canva incorporado quando os dois existem', () => {
    const { container } = render(
      <Agenda
        agenda={{ ...VAZIA, imagem: '/agenda.png', canvaEmbedUrl: 'https://canva.com/x/view?embed' }}
      />,
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('cai para o Canva incorporado quando não há imagem', () => {
    const { container } = render(
      <Agenda agenda={{ ...VAZIA, canvaEmbedUrl: 'https://canva.com/x/view?embed' }} />,
    )
    const frame = container.querySelector('iframe')
    expect(frame).toHaveAttribute('src', 'https://canva.com/x/view?embed')
    expect(frame).toHaveAttribute('loading', 'lazy')
    // Mesma escolha de privacidade do mapa: o terceiro não recebe de onde viemos.
    expect(frame).toHaveAttribute('referrerPolicy', 'no-referrer')
  })

  it('só mostra o link de tela cheia quando há url do Canva', () => {
    const { rerender } = render(<Agenda agenda={{ ...VAZIA, imagem: '/a.png' }} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    rerender(<Agenda agenda={{ ...VAZIA, imagem: '/a.png', canvaUrl: 'https://canva.com/x/view' }} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://canva.com/x/view')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('expõe a âncora #agenda quando renderiza', () => {
    const { container } = render(<Agenda agenda={{ ...VAZIA, imagem: '/a.png' }} />)
    expect(container.querySelector('section#agenda')).not.toBeNull()
  })
})
