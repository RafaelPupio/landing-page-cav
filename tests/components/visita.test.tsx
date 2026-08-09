import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Visita from '@/components/sections/Visita'
import Citacao from '@/components/sections/Citacao'
import Rodape from '@/components/sections/Rodape'

const CONTATO = {
  logradouro: 'Av. das Emas, 2240W',
  bairro: 'Parque das Emas',
  cidade: 'Lucas do Rio Verde',
  estado: 'MT',
  cep: '',
  mapsUrl: 'https://maps.example/x',
  mapaEmbedUrl: 'https://maps.example/embed',
  latitude: '',
  longitude: '',
  telefone: '',
  email: '',
}

const HORARIOS = [
  { rotulo: 'Culto', quando: 'Domingos, 18h', diaSemana: 'Sunday', abre: '18:00', fecha: '20:00' },
  { rotulo: 'Grupo de Conexão', quando: 'Quartas, 20h', diaSemana: 'Wednesday', abre: '20:00', fecha: '21:30' },
]

const VISITA = {
  rotulo: 'E você',
  titulo: 'Venha nos visitar',
  texto: '',
  ctaMapsTexto: 'Abrir no Google Maps',
  ctaTelefoneTexto: 'Telefone',
  mapaTitulo: 'Mapa',
}

describe('Visita', () => {
  it('mostra endereço e horário', () => {
    render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.getByText(/Av\. das Emas, 2240W/)).toBeInTheDocument()
    expect(screen.getByText('Domingos, 18h')).toBeInTheDocument()
  })

  it('mantém cada horário no bloco do seu próprio rótulo', () => {
    render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    for (const horario of HORARIOS) {
      const dt = screen.getByText(`${horario.rotulo}:`)
      const bloco = dt.closest('div')
      expect(bloco).not.toBeNull()
      expect(bloco).toHaveTextContent(horario.quando)
    }
  })

  it('omite o botão de telefone quando o campo está vazio', () => {
    render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.queryByRole('link', { name: /telefone/i })).not.toBeInTheDocument()
  })

  it('cai para o link do Maps quando não há embed', () => {
    render(
      <Visita visita={VISITA} contato={{ ...CONTATO, mapaEmbedUrl: '' }} horarios={HORARIOS} />,
    )
    expect(screen.queryByTitle('Mapa')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Abrir no Google Maps/i })).toHaveAttribute('href', CONTATO.mapsUrl)
  })

  it('usa referrerPolicy "no-referrer" no iframe do mapa, para não vazar a URL da página ao Google', () => {
    const { container } = render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('referrerPolicy', 'no-referrer')
  })

  it('expõe a âncora #visita', () => {
    const { container } = render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(container.querySelector('section#visita')).not.toBeNull()
  })
})

describe('Citacao', () => {
  it('renderiza como blockquote', () => {
    const { container } = render(<Citacao citacao={{ texto: 'Essas crenças são a base.' }} />)
    expect(container.querySelector('blockquote')).toHaveTextContent('Essas crenças são a base.')
  })
})

describe('Rodape', () => {
  it('linka Instagram e YouTube em nova aba', () => {
    render(
      <Rodape
        nome="Comunidade Árvore da Vida"
        texto=""
        redes={{
          instagram: 'https://instagram.com/x',
          youtube: 'https://youtube.com/y',
          instagramRotulo: 'Instagram',
          youtubeRotulo: 'YouTube',
        }}
      />,
    )
    const ig = screen.getByRole('link', { name: 'Instagram' })
    expect(ig).toHaveAttribute('href', 'https://instagram.com/x')
    expect(ig).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', 'https://youtube.com/y')
  })
})
