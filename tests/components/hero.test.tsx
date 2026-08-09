import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'

const HERO = {
  titulo: 'Comunidade Árvore da Vida',
  subtitulo: 'Conhecer a Deus e torná-Lo conhecido',
  ctaTexto: 'Venha nos visitar',
  ctaAncora: '#visita',
}

describe('Hero', () => {
  it('usa o título como único h1 da seção', () => {
    render(<Hero hero={HERO} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HERO.titulo)
  })

  it('liga o CTA à âncora recebida', () => {
    render(<Hero hero={HERO} />)
    expect(screen.getByRole('link', { name: HERO.ctaTexto })).toHaveAttribute('href', '#visita')
  })

  it('usa fundo creme no CTA — fundo limão reprovaria contraste em texto pequeno', () => {
    render(<Hero hero={HERO} />)
    const cta = screen.getByRole('link', { name: HERO.ctaTexto })
    expect(cta.className).toContain('bg-creme')
    expect(cta.className).toContain('text-verde-escuro')
  })
})

describe('AcoesRapidas', () => {
  const ACOES = [
    { rotulo: 'Como chegar', href: '#visita', icone: 'mapa' as const },
    { rotulo: 'Instagram', href: 'https://instagram.com/x', icone: 'instagram' as const },
  ]

  it('renderiza um link por ação', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('abre links externos em nova aba com rel seguro', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    const externo = screen.getByRole('link', { name: /Instagram/ })
    expect(externo).toHaveAttribute('target', '_blank')
    expect(externo).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('não põe target em links internos de âncora', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    expect(screen.getByRole('link', { name: /Como chegar/ })).not.toHaveAttribute('target')
  })
})
