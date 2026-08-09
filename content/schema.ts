import { z } from 'zod'

export const temaSchema = z.object({
  verdeEscuro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  verdeLimao: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  creme: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  grafite: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const horarioSchema = z.object({
  rotulo: z.string().min(1),
  quando: z.string().min(1),
  diaSemana: z.string().min(1), // formato schema.org, ex.: "Sunday"
  abre: z.string().regex(/^\d{2}:\d{2}$/),
  fecha: z.string().regex(/^\d{2}:\d{2}$/),
})

export const contatoSchema = z.object({
  logradouro: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().length(2),
  cep: z.string(),
  mapsUrl: z.string().url(),
  mapaEmbedUrl: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  telefone: z.string(),
  email: z.string(),
})

export const redesSchema = z.object({
  instagram: z.string().url(),
  youtube: z.string().url(),
})

export const declaracaoSchema = z.object({
  titulo: z.string().min(1),
  texto: z.string().min(1),
})

export const grupoCredoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  declaracoes: z.array(declaracaoSchema).min(1),
})

export const siteSchema = z.object({
  tema: temaSchema,
  site: z.object({
    nome: z.string().min(1),
    url: z.string().url(),
    descricao: z.string().min(1),
    tagline: z.string().min(1),
  }),
  contato: contatoSchema,
  horarios: z.array(horarioSchema).min(1),
  redes: redesSchema,
  hero: z.object({
    titulo: z.string().min(1),
    subtitulo: z.string().min(1),
    ctaTexto: z.string().min(1),
    ctaAncora: z.string().min(1),
  }),
  acoesRapidas: z.array(z.object({
    rotulo: z.string().min(1),
    // Link interno sempre como "#ancora" ou "/caminho" — nunca com o domínio completo
    // (ex.: "https://arvoredavidalrv.com.br/algo"), senão o link do próprio site é tratado
    // como externo e abre numa aba nova por engano.
    href: z.string().regex(
      /^(#[^\s]+|\/[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/,
      'Link inválido em "acoesRapidas". Use um dos formatos aceitos: âncora interna (ex.: #visita), caminho interno (ex.: /contato), link completo (ex.: https://exemplo.com.br), e-mail (ex.: mailto:contato@exemplo.com.br) ou telefone (ex.: tel:+5511999999999).',
    ),
    icone: z.enum(['mapa', 'relogio', 'instagram', 'youtube']),
  })).min(1),
  historia: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    paragrafos: z.array(z.string().min(1)).min(1),
  }),
  proposito: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    missao: z.string().min(1),
    visaoTitulo: z.string().min(1),
    visao: z.array(z.string().min(1)).min(1),
    valoresTitulo: z.string().min(1),
    valores: z.array(z.string().min(1)).min(1),
  }),
  cuidado: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    intro: z.string().min(1),
    pilares: z.array(z.object({
      nome: z.string().min(1),
      subtitulo: z.string(),
      texto: z.string().min(1),
    })).length(3),
  }),
  lideranca: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    texto: z.string().min(1),
  }),
  credo: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    intro: z.string().min(1),
    grupos: z.array(grupoCredoSchema).min(1).refine(
      (grupos) => new Set(grupos.map((grupo) => grupo.id)).size === grupos.length,
      'Há dois grupos do Credo com o mesmo "id" em credo.grupos no site.json. Cada grupo precisa de um "id" único (ex.: "escrituras", "trindade") — abra o arquivo, encontre os dois grupos com o "id" repetido e troque um deles por um valor que não exista em nenhum outro grupo.',
    ),
  }),
  citacao: z.object({ texto: z.string().min(1) }),
  visita: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    texto: z.string(),
  }),
  rodape: z.object({ texto: z.string() }),
})

export type Site = z.infer<typeof siteSchema>
export type Tema = z.infer<typeof temaSchema>
export type Contato = z.infer<typeof contatoSchema>
export type Horario = z.infer<typeof horarioSchema>
export type Redes = z.infer<typeof redesSchema>
export type GrupoCredo = z.infer<typeof grupoCredoSchema>
export type Declaracao = z.infer<typeof declaracaoSchema>
