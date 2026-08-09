import type { MetadataRoute } from 'next'
import { site } from '@/content/load'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/editar', '/api/'] },
    sitemap: `${site.site.url}/sitemap.xml`,
  }
}
