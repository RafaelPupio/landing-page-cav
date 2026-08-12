import { site } from '@/content/load'

/**
 * Endereço público do site, resolvido na ordem em que a informação é confiável.
 *
 * O problema que isto resolve: `site.url` no JSON guarda o domínio que a igreja
 * pretende registrar. Enquanto ele não existir, publicar com esse valor faz o
 * canonical, o og:url e o JSON-LD apontarem para um endereço que não resolve —
 * o Google recebe dados estruturados quebrados, o que é pior que não ter nenhum.
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — escape manual, se algum dia for preciso forçar.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — a Vercel preenche sozinha. Antes do domínio
 *    próprio vale o `*.vercel.app`; depois de apontar o domínio, ela passa a valer
 *    o domínio real, sem ninguém precisar editar nada.
 * 3. `site.url` do JSON — o que vale em desenvolvimento e fora da Vercel.
 */
export function urlDoSite(): string {
  const manual = process.env.NEXT_PUBLIC_SITE_URL
  if (manual) return semBarraFinal(manual)

  const daVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (daVercel) return semBarraFinal(`https://${daVercel}`)

  return semBarraFinal(site.site.url)
}

function semBarraFinal(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
