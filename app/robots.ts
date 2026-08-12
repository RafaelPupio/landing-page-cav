import type { MetadataRoute } from 'next'
import { urlDoSite } from '@/lib/urlDoSite'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/editar', '/api/'] },
    sitemap: `${urlDoSite()}/sitemap.xml`,
  }
}
