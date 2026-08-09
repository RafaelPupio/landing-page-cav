import bruto from './site.json'
import { siteSchema, type Site } from './schema'

const resultado = siteSchema.safeParse(bruto)

if (!resultado.success) {
  const detalhes = resultado.error.issues
    .map((i) => `  content/site.json: ${i.path.join('.')} — ${i.message}`)
    .join('\n')
  throw new Error(`Conteúdo inválido.\n${detalhes}`)
}

export const site: Site = resultado.data
