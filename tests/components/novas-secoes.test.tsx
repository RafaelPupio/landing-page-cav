import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Mensagens from '@/components/sections/Mensagens'
import Generosidade from '@/components/sections/Generosidade'
import PrimeiraVez from '@/components/sections/PrimeiraVez'

const MENSAGENS = {
  rotulo: 'Ouça de onde estiver',
  titulo: 'Mensagens',
  intro: 'As pregações ficam no canal.',
  canalTexto: 'Ver as mensagens no YouTube',
  canalUrl: 'https://youtube.com/@exemplo',
  destaques: [],
}

const COM_DESTAQUES = {
  ...MENSAGENS,
  destaques: [
    { titulo: 'A Nova Aliança', detalhe: 'Domingo · 42 min', url: 'https://youtube.com/watch?v=a' },
    { titulo: 'Grande Comissão', detalhe: 'Domingo · 51 min', url: '' },
  ],
}

describe('Mensagens', () => {
  it('expõe a âncora #mensagens e o rótulo', () => {
    const { container } = render(<Mensagens mensagens={MENSAGENS} />)
    expect(container.querySelector('section#mensagens')).not.toBeNull()
    expect(screen.getByText('Ouça de onde estiver')).toBeInTheDocument()
  })

  it('abre o canal em nova aba com rel seguro', () => {
    render(<Mensagens mensagens={MENSAGENS} />)
    const link = screen.getByRole('link', { name: MENSAGENS.canalTexto })
    expect(link).toHaveAttribute('href', MENSAGENS.canalUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  // Degradação: sem destaques cadastrados não pode sobrar lista vazia na tela.
  it('não renderiza lista quando não há destaques', () => {
    render(<Mensagens mensagens={MENSAGENS} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('mantém cada detalhe dentro do bloco do seu próprio título', () => {
    render(<Mensagens mensagens={COM_DESTAQUES} />)
    for (const destaque of COM_DESTAQUES.destaques) {
      const titulo = screen.getByRole('heading', { level: 3, name: destaque.titulo })
      expect(titulo.closest('li')).toHaveTextContent(destaque.detalhe)
    }
  })

  it('só transforma o destaque em link quando há url', () => {
    render(<Mensagens mensagens={COM_DESTAQUES} />)
    expect(screen.getByRole('link', { name: 'A Nova Aliança' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Grande Comissão' })).not.toBeInTheDocument()
  })
})

describe('Generosidade', () => {
  const BASE = {
    rotulo: 'Semeadura e colheita',
    titulo: 'Generosidade',
    texto: 'A motivação para dar deve ser o amor.',
    ctaTexto: '',
    ctaUrl: '',
  }

  it('expõe a âncora #generosidade e o texto', () => {
    const { container } = render(<Generosidade generosidade={BASE} />)
    expect(container.querySelector('section#generosidade')).not.toBeNull()
    expect(screen.getByText(BASE.texto)).toBeInTheDocument()
  })

  // Enquanto a igreja não tiver meio de contribuição, nenhum botão morto na tela.
  it('omite o botão enquanto não houver link de contribuição', () => {
    render(<Generosidade generosidade={BASE} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renderiza o botão quando o link é preenchido', () => {
    render(
      <Generosidade
        generosidade={{ ...BASE, ctaTexto: 'Contribuir', ctaUrl: 'https://exemplo.com/dar' }}
      />,
    )
    const link = screen.getByRole('link', { name: 'Contribuir' })
    expect(link).toHaveAttribute('href', 'https://exemplo.com/dar')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('não renderiza botão com texto mas sem link', () => {
    render(<Generosidade generosidade={{ ...BASE, ctaTexto: 'Contribuir', ctaUrl: '' }} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})

describe('PrimeiraVez', () => {
  const PRIMEIRA = {
    rotulo: 'Primeira vez aqui?',
    titulo: 'O que esperar',
    intro: 'Você não precisa se preparar para nada.',
    passos: [
      { titulo: 'Chegue às 18h', texto: 'O culto começa às 18h.' },
      { titulo: 'Venha como você está', texto: 'Não há código de vestimenta.' },
      { titulo: 'Fique para conversar', texto: 'Depois do culto as pessoas ficam.' },
    ],
  }

  it('expõe a âncora #primeira-vez', () => {
    const { container } = render(<PrimeiraVez primeiraVez={PRIMEIRA} />)
    expect(container.querySelector('section#primeira-vez')).not.toBeNull()
  })

  // Os passos são uma sequência de chegada — a ordem carrega informação, por isso <ol>.
  it('usa lista ordenada e mantém a ordem dos passos', () => {
    const { container } = render(<PrimeiraVez primeiraVez={PRIMEIRA} />)
    expect(container.querySelector('ol')).not.toBeNull()
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titulos).toEqual(PRIMEIRA.passos.map((p) => p.titulo))
  })

  it('mantém o texto de cada passo dentro do bloco do seu próprio título', () => {
    render(<PrimeiraVez primeiraVez={PRIMEIRA} />)
    for (const passo of PRIMEIRA.passos) {
      const titulo = screen.getByRole('heading', { level: 3, name: passo.titulo })
      expect(titulo.closest('li')).toHaveTextContent(passo.texto)
    }
  })

  it('numera os passos na ordem, com dois dígitos', () => {
    const { container } = render(<PrimeiraVez primeiraVez={PRIMEIRA} />)
    const numeros = Array.from(container.querySelectorAll('li > p:first-child')).map(
      (p) => p.textContent,
    )
    expect(numeros).toEqual(['01', '02', '03'])
  })
})

// Contraste sobre o fundo #131A08, recalculado quando o fundo escureceu:
// limão mede 9,08:1 e creme 16,31:1 — ambos passam AA em qualquer tamanho.
// O que ainda reprovaria é limão sobre o VERDE ANTIGO (#44581A, 4,03:1), então o
// teste trava que nenhuma seção volte a pintar fundo com o verde antigo.
describe('contraste das seções novas', () => {
  it('não usa o verde antigo como fundo de bloco com texto', () => {
    const { container } = render(
      <>
        <Mensagens mensagens={COM_DESTAQUES} />
        <PrimeiraVez primeiraVez={PRIMEIRA_MINIMA} />
      </>,
    )
    for (const el of container.querySelectorAll('*')) {
      expect(el.className.toString()).not.toContain('bg-verde-escuro')
    }
  })
})
const PRIMEIRA_MINIMA = {
  rotulo: 'Primeira vez aqui?',
  titulo: 'O que esperar',
  intro: 'Intro.',
  passos: [{ titulo: 'Chegue às 18h', texto: 'Começa às 18h.' }],
}
