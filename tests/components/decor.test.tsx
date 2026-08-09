import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Blob from '@/components/decor/Blob'

describe('Blob', () => {
  it('marca o svg como aria-hidden para não poluir o leitor de tela', () => {
    const { container } = render(<Blob variante={1} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('aceita className extra', () => {
    const { container } = render(<Blob variante={2} className="opacity-50" />)
    expect(container.querySelector('svg')).toHaveClass('opacity-50')
  })

  it('renderiza a variante 3 com um path válido', () => {
    const { container } = render(<Blob variante={3} />)
    const path = container.querySelector('path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('d')).toBeTruthy()
  })
})
