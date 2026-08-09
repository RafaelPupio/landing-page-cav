import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Credo from '@/components/sections/Credo'

const CREDO = {
  rotulo: 'Nosso alicerce',
  titulo: 'Como Cremos',
  intro: 'Somos uma Comunidade evangélica.',
  grupos: [
    { id: 'escrituras', nome: 'As Escrituras', declaracoes: [{ titulo: 'A Bíblia', texto: 'CREMOS na inspiração divina.' }] },
    {
      id: 'trindade',
      nome: 'Deus, Cristo e o Espírito',
      declaracoes: [
        { titulo: 'Deus', texto: 'CREMOS em um único Deus.' },
        { titulo: 'Jesus Cristo', texto: 'CREMOS no Senhor Jesus Cristo.' },
      ],
    },
  ],
}

describe('Credo', () => {
  it('cria uma âncora por grupo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('#credo-escrituras')).not.toBeNull()
    expect(container.querySelector('#credo-trindade')).not.toBeNull()
  })

  it('mantém as declarações fechadas até o clique, mas presentes no DOM', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    // Presente no HTML mesmo fechado — é o que permite ao Google indexar o credo.
    expect(screen.getByText('CREMOS em um único Deus.')).toBeInTheDocument()
    expect(screen.getByText('CREMOS em um único Deus.')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Deus, Cristo e o Espírito' }))
    expect(screen.getByText('CREMOS em um único Deus.')).toBeVisible()
    expect(screen.getByText('CREMOS no Senhor Jesus Cristo.')).toBeVisible()
  })

  it('renderiza o título de cada declaração aberta como h4', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('A Bíblia')
  })

  it('expõe a âncora #credo e o rótulo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('section#credo')).not.toBeNull()
    expect(screen.getByText('Nosso alicerce')).toBeInTheDocument()
  })

  // Credo instancia um <Acordeao> por grupo (seis, no conteúdo real), cada um com
  // seu próprio estado — diferente do Acordeao isolado (testado acima em
  // acordeao.test.tsx), onde abrir um item fecha o anterior. Essa diferença é
  // intencional (cada grupo precisa de âncora própria), mas é fácil de quebrar
  // sem perceber: se alguém "simplificar" o Credo para um único Acordeao com
  // todos os grupos como itens, dois grupos abertos ao mesmo tempo passam a
  // fechar um ao outro, e ninguém pega isso sem este teste.
  it('permite dois grupos abertos ao mesmo tempo, porque cada grupo é seu próprio Acordeao', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    await user.click(screen.getByRole('button', { name: 'Deus, Cristo e o Espírito' }))
    expect(screen.getByText('CREMOS na inspiração divina.')).toBeVisible()
    expect(screen.getByText('CREMOS em um único Deus.')).toBeVisible()
    expect(screen.getByText('CREMOS no Senhor Jesus Cristo.')).toBeVisible()
  })

  it('mantém o texto de cada declaração dentro do bloco do seu próprio título', () => {
    render(<Credo credo={CREDO} />)
    for (const grupo of CREDO.grupos) {
      for (const declaracao of grupo.declaracoes) {
        // hidden: true — os painéis do acordeão começam fechados (ver teste acima),
        // então o h4 fica fora da árvore de acessibilidade padrão até o clique.
        const heading = screen.getByRole('heading', { level: 4, name: declaracao.titulo, hidden: true })
        const bloco = heading.closest('div')
        expect(bloco).not.toBeNull()
        expect(bloco).toHaveTextContent(declaracao.texto)
      }
    }
  })
})
