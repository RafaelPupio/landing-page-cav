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
    { rotulo: 'Como chegar', detalhe: '', grupo: 'principal' as const, href: '#visita', icone: 'mapa' as const },
    { rotulo: 'Instagram', detalhe: '', grupo: 'rede' as const, href: 'https://instagram.com/x', icone: 'instagram' as const },
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
      { rotulo: 'E-mail', detalhe: '', grupo: 'principal' as const, href: 'mailto:contato@arvoredavida.org', icone: 'mapa' as const },
      { rotulo: 'Telefone', detalhe: '', grupo: 'principal' as const, href: 'tel:+5511999999999', icone: 'relogio' as const },
      { rotulo: 'Contato', detalhe: '', grupo: 'rede' as const, href: '/contato', icone: 'instagram' as const },
    ]
    render(<AcoesRapidas acoes={acoesSemAlvoExterno} />)
    expect(screen.getByRole('link', { name: /E-mail/ })).not.toHaveAttribute('target')
    expect(screen.getByRole('link', { name: /Telefone/ })).not.toHaveAttribute('target')
    expect(screen.getByRole('link', { name: /Contato/ })).not.toHaveAttribute('target')
  })

  it('põe target em URL absoluta http(s) de terceiro', () => {
    const acoesComExterno = [
      { rotulo: 'YouTube', detalhe: '', grupo: 'rede' as const, href: 'https://youtube.com/@x', icone: 'youtube' as const },
    ]
    render(<AcoesRapidas acoes={acoesComExterno} />)
    expect(screen.getByRole('link', { name: /YouTube/ })).toHaveAttribute('target', '_blank')
  })
})

describe('AcoesRapidas — duas faixas e cores das plataformas', () => {
  const SETE = [
    { rotulo: 'Como chegar', detalhe: '', grupo: 'principal' as const, href: '#visita', icone: 'mapa' as const },
    { rotulo: 'No que cremos', detalhe: '', grupo: 'principal' as const, href: '#credo', icone: 'credo' as const },
    { rotulo: 'Cultos', detalhe: 'Dom, 18h', grupo: 'principal' as const, href: '#visita', icone: 'relogio' as const },
    { rotulo: 'Santa Ceia', detalhe: '1º dom, 8h', grupo: 'principal' as const, href: '#visita', icone: 'ceia' as const },
    { rotulo: 'Instagram', detalhe: '', grupo: 'rede' as const, href: 'https://instagram.com/x', icone: 'instagram' as const },
    { rotulo: 'YouTube', detalhe: '', grupo: 'rede' as const, href: 'https://youtube.com/@x', icone: 'youtube' as const },
    { rotulo: 'Spotify', detalhe: '', grupo: 'rede' as const, href: 'https://open.spotify.com/user/x', icone: 'spotify' as const },
  ]

  it('separa em duas listas: os atalhos da igreja e as redes', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const listas = container.querySelectorAll('ul')
    expect(listas).toHaveLength(2)
    expect(listas[0].querySelectorAll('li')).toHaveLength(4)
    expect(listas[1].querySelectorAll('li')).toHaveLength(3)
  })

  // Duas colunas no celular, não três: a 327px, três cartões dão 103px e metade
  // dos rótulos quebra em duas linhas.
  it('usa duas colunas no celular e quatro no desktop na faixa principal', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const principal = container.querySelectorAll('ul')[0].className
    expect(principal).toContain('grid-cols-2')
    expect(principal).toContain('md:grid-cols-4')
    expect(container.querySelectorAll('ul')[1].className).toContain('grid-cols-3')
  })

  it('mostra o detalhe dentro do cartão do seu próprio rótulo', () => {
    render(<AcoesRapidas acoes={SETE} />)
    expect(screen.getByText('Cultos').closest('a')).toHaveTextContent('Dom, 18h')
    expect(screen.getByText('Santa Ceia').closest('a')).toHaveTextContent('1º dom, 8h')
    // Detalhe vazio não deixa espaço morto no cartão.
    expect(screen.getByText('Como chegar').closest('a')?.textContent).toBe('Como chegar')
  })

  it('pinta YouTube e Spotify com as cores oficiais das plataformas', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const svgs = [...container.querySelectorAll('svg')]
    const cor = (i: number) => svgs[i].getAttribute('fill')
    expect(cor(5)).toBe('#FF0000')
    expect(cor(6)).toBe('#1DB954')
    // Os atalhos da igreja seguem herdando a cor do texto.
    expect(cor(0)).toBe('currentColor')
  })

  // A ponta roxa oficial do Instagram (#833AB4) mede 2,74:1 sobre o fundo e reprova
  // o mínimo de 3:1 para elemento gráfico. Clareada para #A855E8 (4,35:1).
  it('usa gradiente no Instagram, com o roxo clareado por contraste', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const paradas = [...container.querySelectorAll('linearGradient stop')].map((s) =>
      s.getAttribute('stop-color'),
    )
    expect(paradas).toContain('#A855E8')
    expect(paradas).not.toContain('#833AB4')
    expect(container.querySelectorAll('svg')[4].getAttribute('fill')).toContain('url(#')
  })

  // O traçado oficial do Spotify preenche a caixa 24×24 inteira, enquanto Instagram
  // e YouTube deixam folga. Sem o encolhimento o Spotify fica 20% maior que os
  // vizinhos — medido no navegador: 24px de tinta contra 20px dos outros dois.
  it('encolhe só o Spotify, para os três ícones de rede terem a mesma presença', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const caminho = (i: number) => container.querySelectorAll('svg')[i].querySelector('path')
    expect(caminho(6)).toHaveAttribute('transform', 'translate(2 2) scale(0.8333)')
    expect(caminho(4)).not.toHaveAttribute('transform')
    expect(caminho(5)).not.toHaveAttribute('transform')
  })

  it('não repete o id do gradiente no documento', () => {
    const { container } = render(<AcoesRapidas acoes={SETE} />)
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
