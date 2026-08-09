import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Blob from '@/components/decor/Blob'
import Circulo from '@/components/decor/Circulo'
import SeparadorXXX from '@/components/ui/SeparadorXXX'

describe('primitivas decorativas', () => {
  it('marca todas como aria-hidden para não poluir o leitor de tela', () => {
    const { container } = render(
      <>
        <Blob variante={1} />
        <Circulo tamanho="md" cor="limao" />
        <SeparadorXXX />
      </>,
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(3)
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
    })
  })

  it('aceita className extra no Blob', () => {
    const { container } = render(<Blob variante={2} className="opacity-50" />)
    expect(container.querySelector('svg')).toHaveClass('opacity-50')
  })

  it('renderiza a variante 3 do Blob com um path válido', () => {
    const { container } = render(<Blob variante={3} />)
    const path = container.querySelector('path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('d')).toBeTruthy()
  })
})
