import { z } from 'zod'
import { pt } from 'zod/locales'

// Mensagens padrão do Zod (quando um campo não define uma mensagem customizada,
// como "string vazia" ou "número esperado") saem em português. Sem isso, quem
// edita o site pelo formulário em /editar veria erros em inglês do tipo
// "Too small: expected string to have >=1 characters".
z.config(pt())

export const temaSchema = z.object({
  verdeEscuro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  verdeLimao: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  creme: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  grafite: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  // Fundo da página e das faixas alternadas. No verde quase preto o limão mede
  // 9,08:1 com o fundo — passa AA em qualquer tamanho, ao contrário do verde antigo.
  fundo: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  superficie: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const horarioSchema = z.object({
  rotulo: z.string().min(1),
  quando: z.string().min(1),
  diaSemana: z.enum(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    {
      error:
        'Dia da semana inválido em "diaSemana". Use o nome do dia em inglês (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday ou Sunday) — é esse termo que o Google reconhece para mostrar o horário de culto na busca; em português (ex.: "Domingo") o campo é ignorado silenciosamente.',
    },
  ),
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
  // Diferente de `mapsUrl` (que só vira href de um link), este endereço vai
  // para o `src` de um <iframe> em Visita.tsx: o navegador o carrega sozinho,
  // dentro da nossa página, sem ninguém clicar em nada. Por isso a trava aqui é
  // mais apertada que a dos campos vizinhos — https obrigatório, o que já exclui
  // `javascript:`, `data:` e http em texto puro. Vazio continua válido e
  // significa "não mostre o mapa", igual aos outros campos opcionais.
  mapaEmbedUrl: z.union([
    z.literal(''),
    z.string().url().refine((v) => v.startsWith('https://'), {
      message:
        'O endereço do mapa precisa começar com https:// — ele é carregado dentro da página, não apenas clicado. Copie o link do "Incorporar um mapa" no Google Maps. Deixe vazio para não mostrar mapa nenhum.',
    }),
  ]),
  latitude: z.string(),
  longitude: z.string(),
  telefone: z.string(),
  email: z.string(),
})

export const redesSchema = z.object({
  instagram: z.string().url(),
  youtube: z.string().url(),
  instagramRotulo: z.string().min(1),
  youtubeRotulo: z.string().min(1),
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

// Link opcional: vazio é válido e significa "não renderize o bloco" (regra de degradação).
// Mesmos formatos aceitos em acoesRapidas.href — link interno nunca leva o domínio completo.
const linkOpcional = z.union([
  z.literal(''),
  z.string().regex(
    /^(#[^\s]+|\/[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/,
    'Link inválido. Use um dos formatos aceitos: âncora interna (ex.: #visita), caminho interno (ex.: /contato), link completo (ex.: https://exemplo.com.br), e-mail (ex.: mailto:contato@exemplo.com.br) ou telefone (ex.: tel:+5511999999999). Deixe em branco para o bloco não aparecer.',
  ),
])

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
  faixaServico: z.object({ texto: z.string().min(1) }),
  cabecalho: z.object({
    ctaTexto: z.string().min(1),
    ctaAncora: z.string().min(1),
    menuRotulo: z.string().min(1),
    // Cinco itens ou menos: mais escolhas levam a menos decisões.
    itens: z.array(z.object({
      rotulo: z.string().min(1),
      ancora: z.string().regex(/^#[^\s]+$/, 'A âncora do menu precisa começar com # (ex.: #visita).'),
    })).min(1).max(5),
  }),
  ctaFixo: z.object({
    rotuloSecundario: z.string().min(1),
    rotuloPrimario: z.string().min(1),
    ancoraPrimaria: z.string().min(1),
  }),
  hero: z.object({
    titulo: z.string().min(1),
    subtitulo: z.string().min(1),
    ctaTexto: z.string().min(1),
    ctaAncora: z.string().min(1),
    // Caminho do emblema a partir de public/, começando com "/". Vazio esconde o
    // emblema em vez de quebrar a página — mesma regra dos outros campos opcionais.
    emblema: z
      .string()
      .refine((v) => v === '' || v.startsWith('/'), {
        message:
          'O emblema deve ser um caminho dentro de public/, começando com "/" — por exemplo "/emblema-arvore-da-vida.png". Deixe vazio para não mostrar emblema nenhum.',
      }),
    // Logo animado do hero. Vazio esconde o vídeo e deixa só o emblema estático —
    // que é também o que quem prefere menos movimento sempre vê.
    videoLogo: z
      .string()
      .refine((v) => v === '' || v.startsWith('/'), {
        message:
          'O vídeo do logo deve ser um caminho dentro de public/, começando com "/" — por exemplo "/logo-animado.mp4". Deixe vazio para não mostrar vídeo nenhum.',
      }),
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
  mensagens: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    intro: z.string().min(1),
    canalTexto: z.string().min(1),
    canalUrl: z.string().url(),
    // Nasce vazia: nenhuma pregação é cadastrada sem o link real da igreja.
    destaques: z.array(z.object({
      titulo: z.string().min(1),
      detalhe: z.string(),
      url: linkOpcional,
    })),
  }),
  generosidade: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    texto: z.string().min(1),
    ctaTexto: z.string(),
    ctaUrl: linkOpcional,
  }),
  primeiraVez: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    intro: z.string().min(1),
    passos: z.array(z.object({
      titulo: z.string().min(1),
      texto: z.string().min(1),
    })).min(1),
  }),
  visita: z.object({
    rotulo: z.string().min(1),
    titulo: z.string().min(1),
    texto: z.string(),
    ctaMapsTexto: z.string().min(1),
    ctaTelefoneTexto: z.string().min(1),
    mapaTitulo: z.string().min(1),
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
