import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Cuidado from '@/components/sections/Cuidado'

const CUIDADO = {
  rotulo: 'Nossa família',
  titulo: 'Cuidado',
  intro: 'Somos uma família vibrante.',
  pilares: [
    { nome: 'Conectar', subtitulo: 'Grupos de Conexão', texto: 'Texto conectar.' },
    { nome: 'Crescer', subtitulo: '', texto: 'Texto crescer.' },
    { nome: 'Servir', subtitulo: '', texto: 'Texto servir.' },
  ],
}

describe('Cuidado', () => {
  it('renderiza os três pilares como h3', () => {
    render(<Cuidado cuidado={CUIDADO} />)
    const nomes = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(nomes).toEqual(['Conectar', 'Crescer', 'Servir'])
  })

  it('mostra o subtítulo apenas quando preenchido', () => {
    const { container } = render(<Cuidado cuidado={CUIDADO} />)
    expect(screen.getByText('Grupos de Conexão')).toBeInTheDocument()
    // só Conectar tem subtítulo
    expect(container.querySelectorAll('[data-subtitulo]')).toHaveLength(1)
  })

  it('expõe a âncora #cuidado', () => {
    const { container } = render(<Cuidado cuidado={CUIDADO} />)
    expect(container.querySelector('section#cuidado')).not.toBeNull()
  })

  it('mantém o texto de cada pilar dentro do bloco do seu próprio nome', () => {
    render(<Cuidado cuidado={CUIDADO} />)
    for (const pilar of CUIDADO.pilares) {
      const heading = screen.getByRole('heading', { level: 3, name: pilar.nome })
      const card = heading.closest('div')
      expect(card).not.toBeNull()
      expect(card).toHaveTextContent(pilar.texto)
    }
  })
})
