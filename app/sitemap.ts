import type { MetadataRoute } from 'next'
import { site } from '@/content/load'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.site.url, changeFrequency: 'monthly', priority: 1 }]
}
