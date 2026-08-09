import type { Site } from '@/content/schema'

export function dadosDaIgreja(site: Site): Record<string, unknown> {
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: site.site.nome,
    url: site.site.url,
    description: site.site.descricao,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contato.logradouro,
      addressLocality: site.contato.cidade,
      addressRegion: site.contato.estado,
      addressCountry: 'BR',
      ...(site.contato.cep ? { postalCode: site.contato.cep } : {}),
    },
    openingHoursSpecification: site.horarios.map((h) => ({
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
