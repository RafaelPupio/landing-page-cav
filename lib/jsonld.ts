import type { Site } from '@/content/schema'

export function dadosDaIgreja(site: Site, url: string = site.site.url): Record<string, unknown> {
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: site.site.nome,
    url,
    description: site.site.descricao,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contato.logradouro,
      addressLocality: site.contato.cidade,
      addressRegion: site.contato.estado,
      addressCountry: 'BR',
      ...(site.contato.cep ? { postalCode: site.contato.cep } : {}),
    },
    // Só o que se repete toda semana. O schema.org não expressa "todo primeiro
    // domingo do mês" — declarar um culto mensal aqui diria ao Google que a igreja
    // abre naquele horário todas as semanas, o que é falso em três de cada quatro.
    // O culto mensal continua visível na página, só não entra nos dados estruturados.
    openingHoursSpecification: site.horarios
      .filter((h) => h.recorrencia === 'semanal')
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.diaSemana,
        opens: h.abre,
        closes: h.fecha,
      })),
    sameAs: [site.redes.instagram, site.redes.youtube],
  }

  if (site.contato.latitude && site.contato.longitude) {
    dados.geo = {
      '@type': 'GeoCoordinates',
      latitude: site.contato.latitude,
      longitude: site.contato.longitude,
    }
  }
  if (site.contato.telefone) dados.telephone = site.contato.telefone
  if (site.contato.email) dados.email = site.contato.email

  return dados
}
