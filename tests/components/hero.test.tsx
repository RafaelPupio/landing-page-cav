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

  // Trava a regra de contraste do subtítulo: limão sozinho reprova AA no mobile.
  // Em 18px (tamanho mobile) o limite AA é 4,5:1 e o limão mede 4,02:1 sobre o
  // verde-escuro — reprova. Só a partir do md: (24px) o limite cai para 3:1 e o
  // limão passa. Por isso o subtítulo PRECISA das duas classes (creme no mobile,
  // limão só com prefixo md:); se alguém simplificar para "text-verde-limao"
  // sozinho, o texto fica ilegível no celular, que é de onde vem quase todo o
  // tráfego. Este teste existe só por isso — não é teste de estilo, não apague.
  it('subtítulo é creme no mobile e só vira limão a partir do md — sem isso reprova contraste AA em tela pequena', () => {
    render(<Hero hero={HERO} />)
    const subtitulo = screen.getByText(HERO.subtitulo)
    const classes = subtitulo.className.split(/\s+/)
    expect(classes).toContain('text-creme')
    expect(classes).toContain('md:text-verde-limao')
    expect(classes).not.toContain('text-verde-limao')
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

  // Regra de "externo" é regex explícita (^https?://), não startsWith('http') —
  // cobre os formatos de href que o schema aceita, para não reintroduzir a
  // heurística frágil por acidente.
  it('não põe target em mailto:, tel: ou caminho relativo interno', () => {
    const acoesSemAlvoExterno = [
      { rotulo: 'E-mail', href: 'mailto:contato@arvoredavida.org', icone: 'mapa' as const },
      { rotulo: 'Telefone', href: 'tel:+5511999999999', icone: 'relogio' as const },
      { rotulo: 'Contato', href: '/contato', icone: 'instagram' as const },
    ]
    render(<AcoesRapidas acoes={acoesSemAlvoExterno} />)
    expect(screen.getByRole('link', { name: /E-mail/ })).not.toHaveAttribute('target')
    expect(screen.getByRole('link', { name: /Telefone/ })).not.toHaveAttribute('target')
    expect(screen.getByRole('link', { name: /Contato/ })).not.toHaveAttribute('target')
  })

  it('põe target em URL absoluta http(s) de terceiro', () => {
    const acoesComExterno = [
      { rotulo: 'YouTube', href: 'https://youtube.com/@x', icone: 'youtube' as const },
    ]
    render(<AcoesRapidas acoes={acoesComExterno} />)
    expect(screen.getByRole('link', { name: /YouTube/ })).toHaveAttribute('target', '_blank')
  })
})
