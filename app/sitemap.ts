import type { MetadataRoute } from 'next'
import { urlDoSite } from '@/lib/urlDoSite'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: urlDoSite(), changeFrequency: 'monthly', priority: 1 }]
}
