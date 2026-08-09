import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Historia from '@/components/sections/Historia'
import Lideranca from '@/components/sections/Lideranca'

describe('Historia', () => {
  const HISTORIA = {
    rotulo: 'Abril de 2017',
    titulo: 'Começou numa garagem',
    paragrafos: ['Primeiro.', 'Segundo.', 'Terceiro.'],
  }

  it('renderiza cada parágrafo da prop no documento', () => {
    render(<Historia historia={HISTORIA} />)
    HISTORIA.paragrafos.forEach((paragrafo) => {
      expect(screen.getByText(paragrafo)).toBeInTheDocument()
    })
  })

  it('expõe a âncora #historia e o rótulo', () => {
    const { container } = render(<Historia historia={HISTORIA} />)
    expect(container.querySelector('section#historia')).not.toBeNull()
    expect(screen.getByText('Abril de 2017')).toBeInTheDocument()
  })
})

describe('Lideranca', () => {
  it('renderiza título como h2, rótulo e texto', () => {
    render(
      <Lideranca lideranca={{ rotulo: 'Quem conduz', titulo: 'Liderança', texto: 'Presbíteros.' }} />,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Liderança')
    expect(screen.getByText('Quem conduz')).toBeInTheDocument()
    expect(screen.getByText('Presbíteros.')).toBeInTheDocument()
  })
})
