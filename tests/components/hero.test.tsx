import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'

const HERO = {
  titulo: 'Comunidade Árvore da Vida',
  subtitulo: 'Conhecer a Deus e torná-Lo conhecido',
  ctaTexto: 'Venha nos visitar',
  ctaAncora: '#visita',
  emblema: '/emblema-arvore-da-vida.png',
  videoLogo: '',
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

  // Antes o subtítulo precisava ser creme no mobile porque limão reprovava sobre o
  // verde antigo. No fundo #131A08 o limão mede 9,08:1 e vale em qualquer tamanho.
  it('usa limão no subtítulo, em qualquer largura', () => {
    render(<Hero hero={HERO} />)
    const sub = screen.getByText(HERO.subtitulo)
    expect(sub.className).toContain('text-verde-limao')
    expect(sub.className).not.toContain('md:text-verde-limao')
  })

  it('só monta o vídeo do logo quando há caminho cadastrado', () => {
    const { container: sem } = render(<Hero hero={{ ...HERO, videoLogo: '' }} />)
    expect(sem.querySelector('video')).toBeNull()
    const { container: com } = render(<Hero hero={{ ...HERO, videoLogo: '/logo-animado.mp4' }} />)
    const video = com.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('aria-hidden', 'true')
    // React aplica muted como propriedade, não como atributo do HTML.
    expect((video as HTMLVideoElement).muted).toBe(true)
    expect((video as HTMLVideoElement).autoplay).toBe(true)
  })

  it('esconde o vídeo de quem prefere menos movimento, sem baixá-lo', () => {
    const original = window.matchMedia
    window.matchMedia = ((q: string) => ({
      matches: true, media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
    const { container } = render(<Hero hero={{ ...HERO, videoLogo: '/logo-animado.mp4' }} />)
    expect(container.querySelector('video')).toBeNull()
    window.matchMedia = original
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

  // Sem fill-rule evenodd os subcaminhos internos não são recortados e o ícone
  // de relógio renderiza como um disco sólido. Só aparece no navegador, nunca no jsdom.
  it('recorta os subcaminhos dos ícones com fill-rule evenodd', () => {
    const { container } = render(<AcoesRapidas acoes={ACOES} />)
    const paths = container.querySelectorAll('svg path')
    expect(paths.length).toBe(ACOES.length)
    paths.forEach((path) => expect(path).toHaveAttribute('fill-rule', 'evenodd'))
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
