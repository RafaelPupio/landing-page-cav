# Landing Page Comunidade Árvore da Vida — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma landing page única da Comunidade Árvore da Vida que seja encontrável no Google e sirva como destino do link da bio do Instagram, apresentando identidade, informações práticas e o credo completo.

**Architecture:** Next.js App Router com renderização estática. Todo o conteúdo vive em `content/site.json`, validado por Zod na importação — nenhum componente contém texto fixo. As seções são componentes puros que recebem sua fatia do conteúdo por props. O layout é a **direção D — Capítulos**: fundo verde escuro do topo ao rodapé, com uma trilha vertical em limão que atravessa a página e liga os capítulos como um tronco, de Abril de 2017 até "venha nos visitar".

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Zod, Vitest + Testing Library + jsdom.

## Global Constraints

- Node.js ≥ 20. O ambiente alvo tem Node v26 e npm 11. O `create-next-app@latest` instalou Next.js 16.3.0 — o plano foi escrito citando 15, mas o comando usa `@latest` e o 16 é o que está no projeto.
- Idioma de toda a interface e do conteúdo: **pt-BR**. `<html lang="pt-BR">`.
- Tokens de cor exatos: `verdeEscuro #44581A`, `verdeLimao #A3C63C`, `creme #F7F5EC`, `grafite #1F1F1C`.
- **Piso de opacidade para texto:** `text-creme/90` (6,23:1) é o mínimo sobre o fundo verde escuro. `/70` mede 4,497:1 e reprova AA.
- **Regra de contraste, inegociável.** Limão sobre verde escuro mede 4,02:1 — passa em texto grande, reprova em texto pequeno (AA exige 4,5:1). Portanto: limão **somente** na linha da trilha, nos nós, e em títulos de 24px ou maiores. Rótulos, corpo, botões e qualquer texto abaixo de 24px usam creme (7,24:1). Botão primário sobre fundo escuro é **fundo creme com texto verde escuro** — nunca fundo limão com texto pequeno.
- **Nenhum componente pode conter texto de conteúdo hardcoded.** Todo texto vem por props, originado de `content/site.json`. Rótulos puramente estruturais de acessibilidade (`aria-label` genérico) são a única exceção.
- Todo o texto de conteúdo é copiado **verbatim** do apêndice de `docs/superpowers/specs/2026-08-08-landing-cav-design.md`. Não reescrever, resumir ou "melhorar" o texto da igreja.
- Rotas `/editar` e `/api/content` retornam 404 quando `process.env.NODE_ENV === 'production'`.
- Mobile-first: escrever o estilo base para telas pequenas e usar prefixos `md:`/`lg:` para ampliar.
- Blobs e formas decorativas recebem `aria-hidden="true"`.
- Commits em português, no estilo `feat: ...`, `test: ...`, `chore: ...`.

---

### Task 1: Scaffold do projeto e infraestrutura de testes

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Test: `tests/smoke.test.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: `npm test` roda Vitest com jsdom; `npm run build` gera build estático; `npm run dev` sobe na porta 3000.

- [ ] **Step 1: Criar o projeto Next.js**

Rodar na raiz do repositório (a pasta já contém `docs/`, `brain/` e `.git`, então usar `.` como destino):

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --turbopack --no-install
```

Quando perguntar sobre sobrescrever arquivos existentes, aceitar — `docs/`, `brain/`, `CLAUDE.md` e `.git` não são tocados. Se o gerador reclamar de diretório não vazio e abortar, criar em `.tmp-scaffold` e mover o conteúdo para a raiz.

- [ ] **Step 2: Instalar dependências**

```bash
npm install zod && npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Configurar o Vitest**

Criar `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Criar `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Adicionar em `package.json`, dentro de `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Escrever o teste de fumaça**

Criar `tests/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function Ola() {
  return <h1>Comunidade Árvore da Vida</h1>
}

describe('infraestrutura de testes', () => {
  it('renderiza um componente React no jsdom', () => {
    render(<Ola />)
    expect(screen.getByRole('heading')).toHaveTextContent('Comunidade Árvore da Vida')
  })
})
```

- [ ] **Step 5: Rodar os testes**

Run: `npm test`
Expected: PASS — 1 teste, 1 arquivo.

- [ ] **Step 6: Verificar que o build funciona**

Run: `npm run build`
Expected: build conclui sem erro, com a rota `/` listada como estática.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + Vitest"
```

---

### Task 2: Schema, conteúdo e carregador validado

**Files:**
- Create: `content/schema.ts`, `content/site.json`, `content/load.ts`
- Modify: `tsconfig.json` (adicionar `resolveJsonModule`)
- Test: `tests/content/schema.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `siteSchema` e `type Site` (de `content/schema.ts`)
  - `site: Site` — export nomeado de `content/load.ts`, já validado
  - Tipos exportados: `Tema`, `Contato`, `Horario`, `Redes`, `GrupoCredo`, `Declaracao`

Cada capítulo da trilha tem um **rótulo** (`rotulo`) — a marca temporal ou temática que aparece acima do título, tipo "Abril de 2017" ou "Nosso alicerce". É conteúdo, não decoração, então vive no JSON.

- [ ] **Step 1: Escrever o schema**

Criar `content/schema.ts`:

```ts
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
    href: z.string().min(1),
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
    grupos: z.array(grupoCredoSchema).min(1),
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
```

- [ ] **Step 2: Escrever o teste do schema**

Criar `tests/content/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { siteSchema } from '@/content/schema'
import conteudo from '@/content/site.json'

describe('siteSchema', () => {
  it('aceita o content/site.json real', () => {
    expect(() => siteSchema.parse(conteudo)).not.toThrow()
  })

  it('rejeita quando um campo obrigatório some, apontando o caminho', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    delete (quebrado.contato as Record<string, unknown>).logradouro
    const resultado = siteSchema.safeParse(quebrado)
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['contato', 'logradouro'])
    }
  })

  it('rejeita cor fora do formato hexadecimal', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    ;(quebrado.tema as Record<string, unknown>).creme = 'bege'
    expect(siteSchema.safeParse(quebrado).success).toBe(false)
  })

  it('exige exatamente 3 pilares de cuidado', () => {
    const quebrado = structuredClone(conteudo) as Record<string, unknown>
    ;(quebrado.cuidado as { pilares: unknown[] }).pilares.pop()
    expect(siteSchema.safeParse(quebrado).success).toBe(false)
  })

  it('exige rótulo em todos os capítulos da trilha', () => {
    for (const capitulo of ['historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita']) {
      const quebrado = structuredClone(conteudo) as Record<string, Record<string, unknown>>
      delete quebrado[capitulo].rotulo
      expect(siteSchema.safeParse(quebrado).success, `${capitulo} sem rótulo`).toBe(false)
    }
  })
})
```

- [ ] **Step 3: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/content/schema.test.ts`
Expected: FAIL — `Cannot find module '@/content/site.json'`.

- [ ] **Step 4: Criar `content/site.json`**

Preencher com o conteúdo **verbatim** do apêndice do spec (`docs/superpowers/specs/2026-08-08-landing-cav-design.md`). Estrutura abaixo, com o texto longo abreviado como `…` — **no arquivo real vai o texto inteiro, e nenhum `…` pode sobrar**:

```json
{
  "tema": {
    "verdeEscuro": "#44581A",
    "verdeLimao": "#A3C63C",
    "creme": "#F7F5EC",
    "grafite": "#1F1F1C"
  },
  "site": {
    "nome": "Comunidade Árvore da Vida",
    "url": "https://arvoredavidalrv.com.br",
    "descricao": "Igreja evangélica em Lucas do Rio Verde/MT. Culto aos domingos, 18h, na Av. das Emas, 2240W. Conheça nossa história, missão e no que cremos.",
    "tagline": "Conhecer a Deus e torná-Lo conhecido"
  },
  "contato": {
    "logradouro": "Av. das Emas, 2240W",
    "bairro": "Parque das Emas",
    "cidade": "Lucas do Rio Verde",
    "estado": "MT",
    "cep": "",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Av.+das+Emas+2240W+Parque+das+Emas+Lucas+do+Rio+Verde+MT",
    "mapaEmbedUrl": "https://maps.google.com/maps?q=Av.%20das%20Emas%202240W%20Lucas%20do%20Rio%20Verde&output=embed",
    "latitude": "",
    "longitude": "",
    "telefone": "",
    "email": ""
  },
  "horarios": [
    { "rotulo": "Culto", "quando": "Domingos, 18h", "diaSemana": "Sunday", "abre": "18:00", "fecha": "20:00" }
  ],
  "redes": {
    "instagram": "https://www.instagram.com/comunidadearvoredavida",
    "youtube": "https://youtube.com/@ArvoredaVidaLRV"
  },
  "hero": {
    "titulo": "Comunidade Árvore da Vida",
    "subtitulo": "Conhecer a Deus e torná-Lo conhecido",
    "ctaTexto": "Venha nos visitar",
    "ctaAncora": "#visita"
  },
  "acoesRapidas": [
    { "rotulo": "Como chegar", "href": "#visita", "icone": "mapa" },
    { "rotulo": "Domingos, 18h", "href": "#visita", "icone": "relogio" },
    { "rotulo": "Instagram", "href": "https://www.instagram.com/comunidadearvoredavida", "icone": "instagram" },
    { "rotulo": "YouTube", "href": "https://youtube.com/@ArvoredaVidaLRV", "icone": "youtube" }
  ],
  "historia": {
    "rotulo": "Abril de 2017",
    "titulo": "Começou numa garagem",
    "paragrafos": [
      "A Comunidade Árvore da Vida nasceu em Abril de 2017. …",
      "Nosso orgulho não é ser da Comunidade Árvore da Vida. …",
      "Seguimos na direção mais importante, que é cumprir a Grande Comissão …"
    ]
  },
  "proposito": {
    "rotulo": "O que nos move",
    "titulo": "Missão, visão e valores",
    "missao": "Desejamos revelar o amor do Pai …",
    "visaoTitulo": "Visão",
    "visao": ["Amar a Deus", "Pregar a Cristo", "Servir a todos", "Andar em unidade", "Manifestar o Reino"],
    "valoresTitulo": "Valores",
    "valores": [
      "Autoridade da Palavra de Deus", "Disciplina espiritual", "Obra consumada da cruz",
      "Intimidade com o Espírito Santo", "Bondade imutável de Deus", "Identidade",
      "Manifestação do sobrenatural", "Cultura do Reino", "Honra", "Discipulado",
      "Famílias fortes", "Coração ensinável", "Generosidade", "Adoração"
    ]
  },
  "cuidado": {
    "rotulo": "Nossa família",
    "titulo": "Cuidado",
    "intro": "Somos uma família vibrante de crentes cheios de esperança …",
    "pilares": [
      { "nome": "Conectar", "subtitulo": "Grupos de Conexão", "texto": "Ser igreja é muito mais do que um Culto no fim de semana. …" },
      { "nome": "Crescer", "subtitulo": "", "texto": "Pensamos em outras formas de colaborar com o crescimento dos membros …" },
      { "nome": "Servir", "subtitulo": "", "texto": "A igreja não espera cuidar de tudo para fazer algo …" }
    ]
  },
  "lideranca": {
    "rotulo": "Quem conduz",
    "titulo": "Liderança",
    "texto": "Cremos na liderança plural da Igreja, através dos Presbíteros, exemplificada no Novo Testamento."
  },
  "credo": {
    "rotulo": "Nosso alicerce",
    "titulo": "Como Cremos",
    "intro": "Somos uma Comunidade evangélica fundamentada nas Sagradas Escrituras. …",
    "grupos": [
      { "id": "escrituras", "nome": "As Escrituras", "declaracoes": [ { "titulo": "A Bíblia", "texto": "CREMOS na inspiração divina da Bíblia Sagrada …" } ] },
      { "id": "trindade", "nome": "Deus, Cristo e o Espírito", "declaracoes": [
        { "titulo": "Deus", "texto": "CREMOS em um único Deus …" },
        { "titulo": "Jesus Cristo", "texto": "CREMOS no Senhor Jesus Cristo …" },
        { "titulo": "Espírito Santo", "texto": "CREMOS no Espírito Santo …" }
      ] },
      { "id": "salvacao", "nome": "Queda e salvação", "declaracoes": [
        { "titulo": "A queda do ser humano", "texto": "CREMOS na queda do ser humano …" },
        { "titulo": "Regeneração", "texto": "CREMOS na necessidade da regeneração …" },
        { "titulo": "Salvação e livre-arbítrio", "texto": "CREMOS que a salvação é disponibilizada a todos …" },
        { "titulo": "Batismo em águas", "texto": "CREMOS no batismo ordenado por Jesus …" },
        { "titulo": "Batismo no Espírito Santo", "texto": "CREMOS no batismo no Espírito Santo, efetuado por Jesus Cristo (Lc 3.15,16)." },
        { "titulo": "Dons do Espírito", "texto": "CREMOS nos dons do Espírito Santo …" }
      ] },
      { "id": "familia", "nome": "Família e papéis", "declaracoes": [
        { "titulo": "A família", "texto": "CREMOS na família, como instituição divina …" },
        { "titulo": "Papéis do homem e da mulher", "texto": "Os papéis do homem e da mulher são bem definidos …" }
      ] },
      { "id": "igreja", "nome": "A Igreja", "declaracoes": [
        { "titulo": "Autonomia da igreja local", "texto": "CREMOS na autonomia da igreja local. …" },
        { "titulo": "Reuniões e ceia", "texto": "Tais ajuntamentos visam a pregação do evangelho …" },
        { "titulo": "Caridade", "texto": "A prática da caridade e assistência aos necessitados …" },
        { "titulo": "Disciplina", "texto": "CREMOS na prática da disciplina …" },
        { "titulo": "Sacerdócio de cada crente", "texto": "CREMOS no sacerdócio e ministério de cada crente …" }
      ] },
      { "id": "ultimas-coisas", "nome": "Generosidade e últimas coisas", "declaracoes": [
        { "titulo": "Generosidade", "texto": "CREMOS na lei da semeadura e colheita …" },
        { "titulo": "Ressurreição dos mortos", "texto": "CREMOS na ressurreição dos mortos …" },
        { "titulo": "Juízo vindouro", "texto": "CREMOS no juízo vindouro …" }
      ] }
    ]
  },
  "citacao": {
    "texto": "Essas crenças são a base do nosso alicerce. São a sustentação de quem somos. Mesmo que não sejam sempre vistas, elas permitem que toda a estrutura esteja sempre segura, forte e firme."
  },
  "visita": { "rotulo": "E você", "titulo": "Venha nos visitar", "texto": "" },
  "rodape": { "texto": "" }
}
```

Antes de seguir, conferir que os 20 títulos de declaração batem com os 20 do apêndice e que nenhum `…` sobrou.

- [ ] **Step 5: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/content/schema.test.ts`
Expected: PASS — 5 testes.

- [ ] **Step 6: Criar o carregador validado**

Criar `content/load.ts`:

```ts
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
```

Adicionar em `tsconfig.json`, dentro de `compilerOptions`:

```json
"resolveJsonModule": true
```

- [ ] **Step 7: Rodar toda a suíte e o build**

Run: `npm test && npm run build`
Expected: todos os testes passam; build conclui.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: conteúdo do site em JSON validado por Zod"
```

---

### Task 3: Tokens de tema e estilos globais no fundo escuro

**Files:**
- Create: `lib/tema.ts`
- Modify: `app/globals.css`, `app/layout.tsx`
- Test: `tests/lib/tema.test.ts`

**Interfaces:**
- Consumes: `site.tema` (Task 2).
- Produces: `variaveisDeTema(tema: Tema): CSSProperties` — objeto de estilo com `--verde-escuro`, `--verde-limao`, `--creme`, `--grafite`.

A página inteira vive no verde escuro. O `body` recebe `background: var(--verde-escuro)` e `color: var(--creme)`.

- [ ] **Step 1: Escrever o teste**

Criar `tests/lib/tema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { variaveisDeTema } from '@/lib/tema'

describe('variaveisDeTema', () => {
  it('converte os tokens em custom properties CSS', () => {
    const estilo = variaveisDeTema({
      verdeEscuro: '#44581A',
      verdeLimao: '#A3C63C',
      creme: '#F7F5EC',
      grafite: '#1F1F1C',
    })
    expect(estilo).toEqual({
      '--verde-escuro': '#44581A',
      '--verde-limao': '#A3C63C',
      '--creme': '#F7F5EC',
      '--grafite': '#1F1F1C',
    })
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/lib/tema.test.ts`
Expected: FAIL — `Cannot find module '@/lib/tema'`.

- [ ] **Step 3: Implementar**

Criar `lib/tema.ts`:

```ts
import type { CSSProperties } from 'react'
import type { Tema } from '@/content/schema'

export function variaveisDeTema(tema: Tema): CSSProperties {
  return {
    '--verde-escuro': tema.verdeEscuro,
    '--verde-limao': tema.verdeLimao,
    '--creme': tema.creme,
    '--grafite': tema.grafite,
  } as CSSProperties
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/lib/tema.test.ts`
Expected: PASS.

- [ ] **Step 5: Ligar os tokens ao Tailwind**

Substituir `app/globals.css` por:

```css
@import "tailwindcss";

@theme inline {
  --color-verde-escuro: var(--verde-escuro);
  --color-verde-limao: var(--verde-limao);
  --color-creme: var(--creme);
  --color-grafite: var(--grafite);
  --font-sans: var(--font-poppins);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--verde-escuro);
  color: var(--creme);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 6: Aplicar tema e fonte no layout**

Substituir `app/layout.tsx` por:

```tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { site } from '@/content/load'
import { variaveisDeTema } from '@/lib/tema'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: site.site.nome,
  description: site.site.descricao,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body style={variaveisDeTema(site.tema)} className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Rodar testes e build**

Run: `npm test && npm run build`
Expected: PASS; build conclui.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: tokens de tema, fundo escuro e fonte Poppins"
```

---

### Task 4: Primitivas decorativas

**Files:**
- Create: `components/decor/Blob.tsx`, `components/decor/Circulo.tsx`, `components/ui/SeparadorXXX.tsx`
- Test: `tests/components/decor.test.tsx`

**Interfaces:**
- Consumes: nada além de CSS.
- Produces:
  - `<Blob variante={1|2|3} className?: string />`
  - `<Circulo tamanho={'sm'|'md'|'lg'} cor={'escuro'|'limao'|'creme'} className?: string />`
  - `<SeparadorXXX />`

  Todos renderizam SVG com `aria-hidden="true"` e `focusable="false"`.

A grade pontilhada do folder não entra: no fundo escuro ela vira ruído. Menos um acessório.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/decor.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Blob from '@/components/decor/Blob'
import Circulo from '@/components/decor/Circulo'
import SeparadorXXX from '@/components/ui/SeparadorXXX'

describe('primitivas decorativas', () => {
  it('marca todas como aria-hidden para não poluir o leitor de tela', () => {
    const { container } = render(
      <>
        <Blob variante={1} />
        <Circulo tamanho="md" cor="limao" />
        <SeparadorXXX />
      </>,
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(3)
    svgs.forEach((svg) => expect(svg).toHaveAttribute('aria-hidden', 'true'))
  })

  it('aceita className extra no Blob', () => {
    const { container } = render(<Blob variante={2} className="opacity-50" />)
    expect(container.querySelector('svg')).toHaveClass('opacity-50')
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/decor.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar**

Criar `components/decor/Blob.tsx`:

```tsx
const CAMINHOS: Record<number, string> = {
  1: 'M154 12c48 8 92 40 106 88 14 48-2 112-44 148-42 36-110 44-158 20C10 244-8 190 3 140 14 90 50 42 92 22c20-10 42-14 62-10Z',
  2: 'M180 6c40 22 62 76 54 128-8 52-46 102-96 118-50 16-112 0-142-40-30-40-28-108 4-152C32 16 88-6 128 2c18 4 36 0 52 4Z',
  3: 'M120 0c62 0 118 52 128 116 10 64-26 132-84 156-58 24-138 4-158-56C-14 156 6 76 56 32 76 14 98 0 120 0Z',
}

export default function Blob({
  variante,
  className = '',
}: {
  variante: 1 | 2 | 3
  className?: string
}) {
  return (
    <svg viewBox="0 0 260 280" aria-hidden="true" focusable="false" className={className}>
      <path d={CAMINHOS[variante]} fill="currentColor" />
    </svg>
  )
}
```

Criar `components/decor/Circulo.tsx`:

```tsx
const TAMANHOS = { sm: 16, md: 32, lg: 56 } as const
const CORES = {
  escuro: 'var(--verde-escuro)',
  limao: 'var(--verde-limao)',
  creme: 'var(--creme)',
} as const

export default function Circulo({
  tamanho,
  cor,
  className = '',
}: {
  tamanho: keyof typeof TAMANHOS
  cor: keyof typeof CORES
  className?: string
}) {
  const d = TAMANHOS[tamanho]
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill={CORES[cor]} />
    </svg>
  )
}
```

Criar `components/ui/SeparadorXXX.tsx`:

```tsx
export default function SeparadorXXX() {
  return (
    <svg
      width="72"
      height="20"
      viewBox="0 0 72 20"
      aria-hidden="true"
      focusable="false"
      className="mx-auto my-10 text-verde-limao"
    >
      {[6, 28, 50].map((x) => (
        <g key={x} stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <line x1={x} y1="4" x2={x + 14} y2="16" />
          <line x1={x + 14} y1="4" x2={x} y2="16" />
        </g>
      ))}
    </svg>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/decor.test.tsx`
Expected: PASS — 2 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: primitivas decorativas (blob, círculo, separador xxx)"
```

---

### Task 5: Primitivas de interface — Trilha, Capítulo, Chip e Acordeão

**Files:**
- Create: `components/ui/Trilha.tsx`, `components/ui/Capitulo.tsx`, `components/ui/Chip.tsx`, `components/ui/Acordeao.tsx`
- Test: `tests/components/trilha.test.tsx`, `tests/components/acordeao.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 3).
- Produces:
  - `<Trilha>{children}</Trilha>` — o tronco. Renderiza a linha vertical em limão via pseudo-elemento e recua o conteúdo à direita dela.
  - `<Capitulo id rotulo titulo>{children}</Capitulo>` — `<section>` com âncora, nó na linha, rótulo em creme, `<h2>` grande em limão (≥24px, dentro da regra de contraste).
  - `<Chip>{children}</Chip>` — `<li>` com contorno creme translúcido.
  - `<Acordeao itens={{ id, titulo, conteudo }[]} />` — client component, um item aberto por vez, `aria-expanded`/`aria-controls`, operável por Enter e Espaço.

**Regra de contraste aplicada aqui:** o `rotulo` do capítulo é texto pequeno, então é **creme**, não limão. O `<h2>` é `text-2xl` (24px) ou maior, então pode ser limão.

- [ ] **Step 1: Escrever os testes**

Criar `tests/components/trilha.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Trilha from '@/components/ui/Trilha'
import Capitulo from '@/components/ui/Capitulo'
import Chip from '@/components/ui/Chip'

describe('Trilha e Capitulo', () => {
  it('renderiza cada capítulo como section com a própria âncora', () => {
    const { container } = render(
      <Trilha>
        <Capitulo id="historia" rotulo="Abril de 2017" titulo="Começou numa garagem">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    const secao = container.querySelector('section#historia')
    expect(secao).not.toBeNull()
    expect(secao?.tagName).toBe('SECTION')
  })

  it('usa o título como h2 e o rótulo como texto de apoio', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="Nosso alicerce" titulo="Como Cremos">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Como Cremos')
    expect(screen.getByText('Nosso alicerce')).toBeInTheDocument()
  })

  it('mantém o rótulo em creme, não em limão — limão reprova contraste em texto pequeno', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="Abril de 2017" titulo="Título">
          <p>Texto.</p>
        </Capitulo>
      </Trilha>,
    )
    const rotulo = screen.getByText('Abril de 2017')
    expect(rotulo.className).toContain('text-creme')
    expect(rotulo.className).not.toContain('text-verde-limao')
  })

  it('renderiza os filhos do capítulo', () => {
    render(
      <Trilha>
        <Capitulo id="c" rotulo="R" titulo="T">
          <p>Conteúdo interno</p>
        </Capitulo>
      </Trilha>,
    )
    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('renderiza como item de lista', () => {
    render(<ul><Chip>Honra</Chip></ul>)
    expect(screen.getByRole('listitem')).toHaveTextContent('Honra')
  })
})
```

Criar `tests/components/acordeao.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Acordeao from '@/components/ui/Acordeao'

const ITENS = [
  { id: 'a', titulo: 'As Escrituras', conteudo: <p>Texto A</p> },
  { id: 'b', titulo: 'A Igreja', conteudo: <p>Texto B</p> },
]

describe('Acordeao', () => {
  it('começa com todos os painéis fechados', () => {
    render(<Acordeao itens={ITENS} />)
    expect(screen.getByRole('button', { name: 'As Escrituras' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Texto A')).not.toBeInTheDocument()
  })

  it('abre o painel ao clicar e liga aria-controls ao id do painel', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    const botao = screen.getByRole('button', { name: 'As Escrituras' })
    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    const painel = screen.getByText('Texto A').closest('[role="region"]')
    expect(painel).toHaveAttribute('id', botao.getAttribute('aria-controls'))
  })

  it('fecha o painel anterior ao abrir outro', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    await user.click(screen.getByRole('button', { name: 'A Igreja' }))
    expect(screen.queryByText('Texto A')).not.toBeInTheDocument()
    expect(screen.getByText('Texto B')).toBeInTheDocument()
  })

  it('abre pelo teclado com Enter', async () => {
    const user = userEvent.setup()
    render(<Acordeao itens={ITENS} />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Texto A')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar os testes para vê-los falhar**

Run: `npm test -- tests/components/trilha.test.tsx tests/components/acordeao.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar Trilha, Capitulo e Chip**

Criar `components/ui/Trilha.tsx`:

```tsx
import type { ReactNode } from 'react'

export default function Trilha({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-10 md:px-10">
      <div
        aria-hidden="true"
        className="absolute left-[1.875rem] top-14 bottom-14 w-px bg-gradient-to-b from-verde-limao via-verde-limao/60 to-transparent md:left-[2.875rem]"
      />
      <div className="pl-8 md:pl-10">{children}</div>
    </div>
  )
}
```

Criar `components/ui/Capitulo.tsx`:

```tsx
import type { ReactNode } from 'react'

export default function Capitulo({
  id,
  rotulo,
  titulo,
  children,
}: {
  id: string
  rotulo: string
  titulo: string
  children: ReactNode
}) {
  return (
    <section id={id} className="relative scroll-mt-12 pb-16">
      <span
        aria-hidden="true"
        className="absolute -left-8 top-2 block h-3 w-3 rounded-full bg-verde-limao md:-left-10"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-creme">{rotulo}</p>
      <h2 className="mt-2 text-2xl font-bold uppercase leading-tight text-verde-limao md:text-3xl">
        {titulo}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
```

Criar `components/ui/Chip.tsx`:

```tsx
import type { ReactNode } from 'react'

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-creme/35 px-4 py-2 text-sm text-creme">
      {children}
    </li>
  )
}
```

- [ ] **Step 4: Implementar o Acordeão**

Criar `components/ui/Acordeao.tsx`:

```tsx
'use client'

import { useState, type ReactNode } from 'react'

export type ItemAcordeao = {
  id: string
  titulo: string
  conteudo: ReactNode
}

export default function Acordeao({ itens }: { itens: ItemAcordeao[] }) {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <div className="divide-y divide-creme/20 border-y border-creme/20">
      {itens.map((item) => {
        const estaAberto = aberto === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`gatilho-${item.id}`}
                aria-expanded={estaAberto}
                aria-controls={`painel-${item.id}`}
                onClick={() => setAberto(estaAberto ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
              >
                {item.titulo}
                <span aria-hidden="true" className="text-2xl leading-none text-verde-limao">
                  {estaAberto ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              role="region"
              id={`painel-${item.id}`}
              aria-labelledby={`gatilho-${item.id}`}
              hidden={!estaAberto}
              className="pb-8"
            >
              {item.conteudo}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Rodar os testes para vê-los passar**

Run: `npm test -- tests/components/trilha.test.tsx tests/components/acordeao.test.tsx`
Expected: PASS — 9 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: trilha, capítulo, chip e acordeão acessível"
```

---

### Task 6: Hero e Ações Rápidas

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/AcoesRapidas.tsx`
- Test: `tests/components/hero.test.tsx`

**Interfaces:**
- Consumes: `site.hero`, `site.acoesRapidas`, `Blob` (Task 4).
- Produces: `<Hero hero={site['hero']} />`, `<AcoesRapidas acoes={site['acoesRapidas']} />`

**Regra de contraste aplicada aqui:** o CTA primário tem **fundo creme e texto verde escuro** (7,24:1). Fundo limão com texto pequeno mediria 4,02:1 e reprovaria.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'

const HERO = {
  titulo: 'Comunidade Árvore da Vida',
  subtitulo: 'Conhecer a Deus e torná-Lo conhecido',
  ctaTexto: 'Venha nos visitar',
  ctaAncora: '#visita',
}

describe('Hero', () => {
  it('usa o título como único h1 da seção', () => {
    render(<Hero hero={HERO} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HERO.titulo)
  })

  it('liga o CTA à âncora recebida', () => {
    render(<Hero hero={HERO} />)
    expect(screen.getByRole('link', { name: HERO.ctaTexto })).toHaveAttribute('href', '#visita')
  })

  it('usa fundo creme no CTA — fundo limão reprovaria contraste em texto pequeno', () => {
    render(<Hero hero={HERO} />)
    const cta = screen.getByRole('link', { name: HERO.ctaTexto })
    expect(cta.className).toContain('bg-creme')
    expect(cta.className).toContain('text-verde-escuro')
  })
})

describe('AcoesRapidas', () => {
  const ACOES = [
    { rotulo: 'Como chegar', href: '#visita', icone: 'mapa' as const },
    { rotulo: 'Instagram', href: 'https://instagram.com/x', icone: 'instagram' as const },
  ]

  it('renderiza um link por ação', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('abre links externos em nova aba com rel seguro', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    const externo = screen.getByRole('link', { name: /Instagram/ })
    expect(externo).toHaveAttribute('target', '_blank')
    expect(externo).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('não põe target em links internos de âncora', () => {
    render(<AcoesRapidas acoes={ACOES} />)
    expect(screen.getByRole('link', { name: /Como chegar/ })).not.toHaveAttribute('target')
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/hero.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar o Hero**

Criar `components/sections/Hero.tsx`:

```tsx
import Blob from '@/components/decor/Blob'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 pt-20 pb-14 md:pt-28">
      <Blob
        variante={2}
        className="pointer-events-none absolute -right-28 -top-32 w-80 text-verde-limao/25 md:w-[30rem]"
      />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold uppercase leading-[1.02] tracking-tight text-creme md:text-6xl">
          {hero.titulo}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light text-creme md:text-2xl md:text-verde-limao">
          {hero.subtitulo}
        </p>
        <a
          href={hero.ctaAncora}
          className="mt-10 inline-block rounded-full bg-creme px-8 py-4 text-base font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
        >
          {hero.ctaTexto}
        </a>
      </div>
    </section>
  )
}
```

O subtítulo é creme em telas pequenas (18px exige 4,5:1) e vira limão só a partir de `md:`, onde chega a 24px e o limite cai para 3:1. É por isso que ele carrega as duas classes de cor.

- [ ] **Step 4: Implementar as Ações Rápidas**

Criar `components/sections/AcoesRapidas.tsx`:

```tsx
import type { Site } from '@/content/schema'

const ICONES: Record<Site['acoesRapidas'][number]['icone'], string> = {
  mapa: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
  relogio: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6V6h-2v7.4l5.2 3.1 1-1.7-4.2-2.2Z',
  instagram: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm3.4 15a3.4 3.4 0 0 1-3.4 3.4H7A3.4 3.4 0 0 1 3.6 17V7A3.4 3.4 0 0 1 7 3.6h10A3.4 3.4 0 0 1 20.4 7v10Z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z',
}

export default function AcoesRapidas({ acoes }: { acoes: Site['acoesRapidas'] }) {
  return (
    <nav aria-label="Ações rápidas" className="px-6 pb-8">
      <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
        {acoes.map((acao) => {
          const externo = acao.href.startsWith('http')
          return (
            <li key={acao.rotulo}>
              <a
                href={acao.href}
                {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-creme/30 p-4 text-sm font-semibold text-creme transition hover:border-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor">
                  <path d={ICONES[acao.icone]} />
                </svg>
                {acao.rotulo}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 5: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/hero.test.tsx`
Expected: PASS — 6 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: hero e faixa de ações rápidas"
```

---

### Task 7: Capítulos de História e Liderança

**Files:**
- Create: `components/sections/Historia.tsx`, `components/sections/Lideranca.tsx`
- Test: `tests/components/textos.test.tsx`

**Interfaces:**
- Consumes: `site.historia`, `site.lideranca`, `Capitulo` (Task 5).
- Produces: `<Historia historia={site['historia']} />`, `<Lideranca lideranca={site['lideranca']} />`

Ambos renderizam um `<Capitulo>` — a âncora e o `<h2>` vêm de lá, não do componente de seção.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/textos.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Historia from '@/components/sections/Historia'
import Lideranca from '@/components/sections/Lideranca'

describe('Historia', () => {
  const HISTORIA = {
    rotulo: 'Abril de 2017',
    titulo: 'Começou numa garagem',
    paragrafos: ['Primeiro.', 'Segundo.', 'Terceiro.'],
  }

  it('renderiza um parágrafo por item', () => {
    const { container } = render(<Historia historia={HISTORIA} />)
    expect(container.querySelectorAll('section#historia p')).toHaveLength(4) // 3 + o rótulo
  })

  it('expõe a âncora #historia e o rótulo', () => {
    const { container } = render(<Historia historia={HISTORIA} />)
    expect(container.querySelector('section#historia')).not.toBeNull()
    expect(screen.getByText('Abril de 2017')).toBeInTheDocument()
  })
})

describe('Lideranca', () => {
  it('renderiza título como h2, rótulo e texto', () => {
    render(
      <Lideranca lideranca={{ rotulo: 'Quem conduz', titulo: 'Liderança', texto: 'Presbíteros.' }} />,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Liderança')
    expect(screen.getByText('Quem conduz')).toBeInTheDocument()
    expect(screen.getByText('Presbíteros.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/textos.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar**

Criar `components/sections/Historia.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Historia({ historia }: { historia: Site['historia'] }) {
  return (
    <Capitulo id="historia" rotulo={historia.rotulo} titulo={historia.titulo}>
      <div className="space-y-5 text-base font-light leading-relaxed text-creme/90">
        {historia.paragrafos.map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}
      </div>
    </Capitulo>
  )
}
```

Criar `components/sections/Lideranca.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Lideranca({ lideranca }: { lideranca: Site['lideranca'] }) {
  return (
    <Capitulo id="lideranca" rotulo={lideranca.rotulo} titulo={lideranca.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{lideranca.texto}</p>
    </Capitulo>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/textos.test.tsx`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: capítulos de história e liderança"
```

---

### Task 8: Capítulo de Propósito — missão, visão e valores

**Files:**
- Create: `components/sections/Proposito.tsx`
- Test: `tests/components/proposito.test.tsx`

**Interfaces:**
- Consumes: `site.proposito`, `Capitulo`, `Chip`.
- Produces: `<Proposito proposito={site['proposito']} />`

Um capítulo só, com três blocos internos: a missão em destaque, a visão e os valores. A visão é `<ul>`, não `<ol>` — ninguém confirmou que a ordem dos cinco compromissos carrega hierarquia, e uma lista ordenada faria o leitor de tela anunciar "item 1 de 5", afirmando algo que não sabemos. Os `<h3>` de visão e valores são texto pequeno, logo **creme**.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/proposito.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Proposito from '@/components/sections/Proposito'

const PROPOSITO = {
  rotulo: 'O que nos move',
  titulo: 'Missão, visão e valores',
  missao: 'Revelar o amor do Pai.',
  visaoTitulo: 'Visão',
  visao: ['Amar a Deus', 'Pregar a Cristo'],
  valoresTitulo: 'Valores',
  valores: ['Honra', 'Adoração', 'Generosidade'],
}

describe('Proposito', () => {
  it('renderiza o título do capítulo como h2', () => {
    render(<Proposito proposito={PROPOSITO} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Missão, visão e valores')
  })

  it('renderiza visão e valores como h3', () => {
    render(<Proposito proposito={PROPOSITO} />)
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titulos).toEqual(['Visão', 'Valores'])
  })

  it('renderiza um item de lista por item de visão e por valor', () => {
    render(<Proposito proposito={PROPOSITO} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('expõe a âncora #proposito', () => {
    const { container } = render(<Proposito proposito={PROPOSITO} />)
    expect(container.querySelector('section#proposito')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/proposito.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/Proposito.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import Chip from '@/components/ui/Chip'
import type { Site } from '@/content/schema'

export default function Proposito({ proposito }: { proposito: Site['proposito'] }) {
  return (
    <Capitulo id="proposito" rotulo={proposito.rotulo} titulo={proposito.titulo}>
      <p className="text-lg font-light leading-relaxed text-creme md:text-xl">
        {proposito.missao}
      </p>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-creme">
        {proposito.visaoTitulo}
      </h3>
      <ul className="mt-4 space-y-2">
        {proposito.visao.map((item, i) => (
          <li
            key={i}
            className="border-b border-creme/15 pb-2 text-base font-light text-creme/90"
          >
            {item}
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-creme">
        {proposito.valoresTitulo}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {proposito.valores.map((item, i) => (
          <Chip key={i}>{item}</Chip>
        ))}
      </ul>
    </Capitulo>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/proposito.test.tsx`
Expected: PASS — 4 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: capítulo de propósito (missão, visão, valores)"
```

---

### Task 9: Capítulo de Cuidado — Conectar, Crescer, Servir

**Files:**
- Create: `components/sections/Cuidado.tsx`
- Test: `tests/components/cuidado.test.tsx`

**Interfaces:**
- Consumes: `site.cuidado`, `Capitulo`.
- Produces: `<Cuidado cuidado={site['cuidado']} />`

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/cuidado.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Cuidado from '@/components/sections/Cuidado'

const CUIDADO = {
  rotulo: 'Nossa família',
  titulo: 'Cuidado',
  intro: 'Somos uma família vibrante.',
  pilares: [
    { nome: 'Conectar', subtitulo: 'Grupos de Conexão', texto: 'Texto conectar.' },
    { nome: 'Crescer', subtitulo: '', texto: 'Texto crescer.' },
    { nome: 'Servir', subtitulo: '', texto: 'Texto servir.' },
  ],
}

describe('Cuidado', () => {
  it('renderiza os três pilares como h3', () => {
    render(<Cuidado cuidado={CUIDADO} />)
    const nomes = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(nomes).toEqual(['Conectar', 'Crescer', 'Servir'])
  })

  it('mostra o subtítulo apenas quando preenchido', () => {
    const { container } = render(<Cuidado cuidado={CUIDADO} />)
    expect(screen.getByText('Grupos de Conexão')).toBeInTheDocument()
    // só Conectar tem subtítulo
    expect(container.querySelectorAll('[data-subtitulo]')).toHaveLength(1)
  })

  it('expõe a âncora #cuidado', () => {
    const { container } = render(<Cuidado cuidado={CUIDADO} />)
    expect(container.querySelector('section#cuidado')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/cuidado.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/Cuidado.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Cuidado({ cuidado }: { cuidado: Site['cuidado'] }) {
  return (
    <Capitulo id="cuidado" rotulo={cuidado.rotulo} titulo={cuidado.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{cuidado.intro}</p>

      <div className="mt-8 space-y-6">
        {cuidado.pilares.map((pilar, i) => (
          <div key={i} className="rounded-2xl border border-creme/25 p-5">
            <h3 className="text-lg font-bold uppercase tracking-wide text-creme">{pilar.nome}</h3>
            {pilar.subtitulo && (
              <p
                data-subtitulo
                className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-creme/90"
              >
                {pilar.subtitulo}
              </p>
            )}
            <p className="mt-3 text-sm font-light leading-relaxed text-creme/90">{pilar.texto}</p>
          </div>
        ))}
      </div>
    </Capitulo>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/cuidado.test.tsx`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: capítulo de cuidado (conectar, crescer, servir)"
```

---

### Task 10: Capítulo do Credo

**Files:**
- Create: `components/sections/Credo.tsx`
- Test: `tests/components/credo.test.tsx`

**Interfaces:**
- Consumes: `site.credo`, `Capitulo`, `Acordeao` e `ItemAcordeao` (Task 5).
- Produces: `<Credo credo={site['credo']} />`

Cada grupo vira uma `<div id="credo-<id>">` com seu próprio `Acordeao` de um item. A âncora é responsabilidade do `Credo`, não do `Acordeao` — mantém o acordeão genérico. Custo aceito: grupos vizinhos não se fecham entre si.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/credo.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Credo from '@/components/sections/Credo'

const CREDO = {
  rotulo: 'Nosso alicerce',
  titulo: 'Como Cremos',
  intro: 'Somos uma Comunidade evangélica.',
  grupos: [
    { id: 'escrituras', nome: 'As Escrituras', declaracoes: [{ titulo: 'A Bíblia', texto: 'CREMOS na inspiração divina.' }] },
    {
      id: 'trindade',
      nome: 'Deus, Cristo e o Espírito',
      declaracoes: [
        { titulo: 'Deus', texto: 'CREMOS em um único Deus.' },
        { titulo: 'Jesus Cristo', texto: 'CREMOS no Senhor Jesus Cristo.' },
      ],
    },
  ],
}

describe('Credo', () => {
  it('cria uma âncora por grupo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('#credo-escrituras')).not.toBeNull()
    expect(container.querySelector('#credo-trindade')).not.toBeNull()
  })

  it('mantém as declarações fechadas até o clique, mas presentes no DOM', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    // Presente no HTML mesmo fechado — é o que permite ao Google indexar o credo.
    expect(screen.getByText('CREMOS em um único Deus.')).toBeInTheDocument()
    expect(screen.getByText('CREMOS em um único Deus.')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Deus, Cristo e o Espírito' }))
    expect(screen.getByText('CREMOS em um único Deus.')).toBeVisible()
    expect(screen.getByText('CREMOS no Senhor Jesus Cristo.')).toBeVisible()
  })

  it('renderiza o título de cada declaração aberta como h4', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    await user.click(screen.getByRole('button', { name: 'As Escrituras' }))
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('A Bíblia')
  })

  it('expõe a âncora #credo e o rótulo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('section#credo')).not.toBeNull()
    expect(screen.getByText('Nosso alicerce')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/credo.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/Credo.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import Acordeao, { type ItemAcordeao } from '@/components/ui/Acordeao'
import type { Site } from '@/content/schema'

export default function Credo({ credo }: { credo: Site['credo'] }) {
  const itens: ItemAcordeao[] = credo.grupos.map((grupo) => ({
    id: grupo.id,
    titulo: grupo.nome,
    conteudo: (
      <div className="space-y-6">
        {grupo.declaracoes.map((declaracao, i) => (
          <div key={i}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-creme">
              {declaracao.titulo}
            </h4>
            <p className="mt-2 text-sm font-light leading-relaxed text-creme/90">
              {declaracao.texto}
            </p>
          </div>
        ))}
      </div>
    ),
  }))

  return (
    <Capitulo id="credo" rotulo={credo.rotulo} titulo={credo.titulo}>
      <p className="mb-8 text-base font-light leading-relaxed text-creme/90">{credo.intro}</p>
      {itens.map((item) => (
        <div key={item.id} id={`credo-${item.id}`} className="scroll-mt-12">
          <Acordeao itens={[item]} />
        </div>
      ))}
    </Capitulo>
  )
}
```

O `<h4>` da declaração é creme, não limão: em `text-sm` o limão reprovaria AA. O limão aparece nesta seção só no `+`/`−` do acordeão, que é decorativo.

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/credo.test.tsx`
Expected: PASS — 4 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: capítulo do credo com acordeão por grupo"
```

---

### Task 11: Citação, Visita e Rodapé

**Files:**
- Create: `components/sections/Citacao.tsx`, `components/sections/Visita.tsx`, `components/sections/Rodape.tsx`
- Test: `tests/components/visita.test.tsx`

**Interfaces:**
- Consumes: `site.citacao`, `site.visita`, `site.contato`, `site.horarios`, `site.redes`, `site.site`, `Capitulo`.
- Produces:
  - `<Citacao citacao={site['citacao']} />`
  - `<Visita visita={…} contato={…} horarios={…} />`
  - `<Rodape nome={…} redes={…} texto={…} />`

A `Visita` é o último capítulo e o momento de chegada: **cartão creme com texto grafite**, invertendo o fundo escuro da página. Alto contraste, e visualmente diz "acabou a jornada, é aqui".

Regra de degradação (do spec): campo vazio não renderiza bloco vazio. `contato.telefone === ''` → sem botão de telefone. `contato.mapaEmbedUrl === ''` → só o link "Abrir no Google Maps".

A citação usa limão em texto grande (≥24px), o único lugar onde limão é permitido em texto.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/visita.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Visita from '@/components/sections/Visita'
import Citacao from '@/components/sections/Citacao'
import Rodape from '@/components/sections/Rodape'

const CONTATO = {
  logradouro: 'Av. das Emas, 2240W',
  bairro: 'Parque das Emas',
  cidade: 'Lucas do Rio Verde',
  estado: 'MT',
  cep: '',
  mapsUrl: 'https://maps.example/x',
  mapaEmbedUrl: 'https://maps.example/embed',
  latitude: '',
  longitude: '',
  telefone: '',
  email: '',
}

const HORARIOS = [
  { rotulo: 'Culto', quando: 'Domingos, 18h', diaSemana: 'Sunday', abre: '18:00', fecha: '20:00' },
]

const VISITA = { rotulo: 'E você', titulo: 'Venha nos visitar', texto: '' }

describe('Visita', () => {
  it('mostra endereço e horário', () => {
    render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.getByText(/Av\. das Emas, 2240W/)).toBeInTheDocument()
    expect(screen.getByText('Domingos, 18h')).toBeInTheDocument()
  })

  it('omite o botão de telefone quando o campo está vazio', () => {
    render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.queryByRole('link', { name: /telefone/i })).not.toBeInTheDocument()
  })

  it('cai para o link do Maps quando não há embed', () => {
    render(
      <Visita visita={VISITA} contato={{ ...CONTATO, mapaEmbedUrl: '' }} horarios={HORARIOS} />,
    )
    expect(screen.queryByTitle('Mapa')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Abrir no Google Maps/i })).toHaveAttribute('href', CONTATO.mapsUrl)
  })

  it('expõe a âncora #visita', () => {
    const { container } = render(<Visita visita={VISITA} contato={CONTATO} horarios={HORARIOS} />)
    expect(container.querySelector('section#visita')).not.toBeNull()
  })
})

describe('Citacao', () => {
  it('renderiza como blockquote', () => {
    const { container } = render(<Citacao citacao={{ texto: 'Essas crenças são a base.' }} />)
    expect(container.querySelector('blockquote')).toHaveTextContent('Essas crenças são a base.')
  })
})

describe('Rodape', () => {
  it('linka Instagram e YouTube em nova aba', () => {
    render(
      <Rodape
        nome="Comunidade Árvore da Vida"
        texto=""
        redes={{ instagram: 'https://instagram.com/x', youtube: 'https://youtube.com/y' }}
      />,
    )
    const ig = screen.getByRole('link', { name: 'Instagram' })
    expect(ig).toHaveAttribute('href', 'https://instagram.com/x')
    expect(ig).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', 'https://youtube.com/y')
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/visita.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar**

Criar `components/sections/Citacao.tsx`:

```tsx
import type { Site } from '@/content/schema'

export default function Citacao({ citacao }: { citacao: Site['citacao'] }) {
  return (
    <section className="px-6 py-12">
      <blockquote className="mx-auto max-w-3xl text-2xl font-bold leading-snug text-verde-limao md:text-4xl">
        {citacao.texto}
      </blockquote>
    </section>
  )
}
```

Criar `components/sections/Visita.tsx`:

```tsx
import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Visita({
  visita,
  contato,
  horarios,
}: {
  visita: Site['visita']
  contato: Site['contato']
  horarios: Site['horarios']
}) {
  const endereco = `${contato.logradouro} — ${contato.bairro}, ${contato.cidade}/${contato.estado}`

  return (
    <Capitulo id="visita" rotulo={visita.rotulo} titulo={visita.titulo}>
      <div className="rounded-3xl bg-creme p-6 text-grafite md:p-8">
        {visita.texto && <p className="font-light leading-relaxed">{visita.texto}</p>}

        <p className="text-lg font-light">{endereco}</p>

        <dl className="mt-5 space-y-1">
          {horarios.map((horario) => (
            <div key={horario.rotulo} className="flex gap-2">
              <dt className="font-semibold">{horario.rotulo}:</dt>
              <dd className="font-light">{horario.quando}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={contato.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-verde-escuro px-6 py-3 font-semibold text-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
          >
            Abrir no Google Maps
          </a>
          {contato.telefone && (
            <a
              href={`tel:${contato.telefone.replace(/\D/g, '')}`}
              className="rounded-full border border-verde-escuro px-6 py-3 font-semibold text-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
            >
              Telefone
            </a>
          )}
        </div>

        {contato.mapaEmbedUrl && (
          <iframe
            title="Mapa"
            src={contato.mapaEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-7 h-64 w-full rounded-2xl border-0"
          />
        )}
      </div>
    </Capitulo>
  )
}
```

Criar `components/sections/Rodape.tsx`:

```tsx
import type { Site } from '@/content/schema'

export default function Rodape({
  nome,
  texto,
  redes,
}: {
  nome: string
  texto: string
  redes: Site['redes']
}) {
  return (
    <footer className="px-6 pb-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border-t border-creme/20 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-creme">{nome}</p>
        {texto && <p className="text-sm font-light text-creme/80">{texto}</p>}
        <ul className="flex gap-6 text-sm font-semibold text-creme">
          <li>
            <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              Instagram
            </a>
          </li>
          <li>
            <a href={redes.youtube} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              YouTube
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/visita.test.tsx`
Expected: PASS — 6 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: citação, capítulo de visita e rodapé"
```

---

### Task 12: Montagem da página

**Files:**
- Modify: `app/page.tsx`
- Test: `tests/pagina.test.tsx`

**Interfaces:**
- Consumes: todas as seções (Tasks 6–11), `Trilha` (Task 5) e `site` (Task 2).
- Produces: `/` renderizando hero, ações rápidas, a trilha com 6 capítulos, citação e rodapé.

- [ ] **Step 1: Escrever o teste**

Criar `tests/pagina.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Pagina from '@/app/page'
import { site } from '@/content/load'

describe('página inicial', () => {
  it('tem exatamente um h1', () => {
    render(<Pagina />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('expõe todas as âncoras de seção', () => {
    const { container } = render(<Pagina />)
    for (const ancora of ['inicio', 'historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita']) {
      expect(container.querySelector(`#${ancora}`), `âncora #${ancora}`).not.toBeNull()
    }
  })

  it('renderiza os 14 valores do conteúdo real', () => {
    render(<Pagina />)
    for (const valor of site.proposito.valores) {
      expect(screen.getByText(valor)).toBeInTheDocument()
    }
  })

  it('renderiza os 6 capítulos na ordem da trilha', () => {
    const { container } = render(<Pagina />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id)
    expect(ids).toEqual(['inicio', 'historia', 'proposito', 'cuidado', 'lideranca', 'credo', 'visita'])
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/pagina.test.tsx`
Expected: FAIL — a página ainda é a do scaffold.

- [ ] **Step 3: Implementar**

Substituir `app/page.tsx` por:

```tsx
import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'
import Trilha from '@/components/ui/Trilha'
import Historia from '@/components/sections/Historia'
import Proposito from '@/components/sections/Proposito'
import Cuidado from '@/components/sections/Cuidado'
import Lideranca from '@/components/sections/Lideranca'
import Credo from '@/components/sections/Credo'
import Citacao from '@/components/sections/Citacao'
import Visita from '@/components/sections/Visita'
import Rodape from '@/components/sections/Rodape'
import { site } from '@/content/load'

export default function Pagina() {
  return (
    <main>
      <Hero hero={site.hero} />
      <AcoesRapidas acoes={site.acoesRapidas} />
      <Trilha>
        <Historia historia={site.historia} />
        <Proposito proposito={site.proposito} />
        <Cuidado cuidado={site.cuidado} />
        <Lideranca lideranca={site.lideranca} />
        <Credo credo={site.credo} />
        <Visita visita={site.visita} contato={site.contato} horarios={site.horarios} />
      </Trilha>
      <Citacao citacao={site.citacao} />
      <Rodape nome={site.site.nome} texto={site.rodape.texto} redes={site.redes} />
    </main>
  )
}
```

- [ ] **Step 4: Rodar toda a suíte e o build**

Run: `npm test && npm run build`
Expected: todos os testes passam; build conclui com `/` estática.

- [ ] **Step 5: Verificar no navegador**

Subir o dev server e conferir em 375px e 1280px: hero legível, ações rápidas acima da dobra no celular, linha da trilha contínua ligando todos os nós, acordeão do credo abrindo, cartão creme da visita destacando do fundo, mapa carregando.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: montagem da página com a trilha de capítulos"
```

---

### Task 13: SEO — metadados, JSON-LD, sitemap e robots

**Files:**
- Create: `components/seo/JsonLd.tsx`, `lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`
- Test: `tests/seo/jsonld.test.ts`

**Interfaces:**
- Consumes: `site` (Task 2).
- Produces: `dadosDaIgreja(site: Site): Record<string, unknown>`; `<JsonLd dados={…} />`.

- [ ] **Step 1: Escrever o teste**

Criar `tests/seo/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { dadosDaIgreja } from '@/lib/jsonld'
import { site } from '@/content/load'

describe('dadosDaIgreja', () => {
  const dados = dadosDaIgreja(site)

  it('declara o tipo Church do schema.org', () => {
    expect(dados['@context']).toBe('https://schema.org')
    expect(dados['@type']).toBe('Church')
  })

  it('inclui o endereço completo', () => {
    expect(dados.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: site.contato.logradouro,
      addressLocality: site.contato.cidade,
      addressRegion: site.contato.estado,
      addressCountry: 'BR',
    })
  })

  it('inclui o horário de culto no formato de openingHoursSpecification', () => {
    expect(dados.openingHoursSpecification).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '18:00',
        closes: '20:00',
      },
    ])
  })

  it('aponta sameAs para Instagram e YouTube', () => {
    expect(dados.sameAs).toEqual([site.redes.instagram, site.redes.youtube])
  })

  it('omite campos opcionais vazios', () => {
    expect(dados).not.toHaveProperty('telephone')
    expect(dados).not.toHaveProperty('geo')
  })

  it('gera um objeto serializável em JSON', () => {
    expect(() => JSON.stringify(dados)).not.toThrow()
    expect(JSON.parse(JSON.stringify(dados))['@type']).toBe('Church')
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/seo/jsonld.test.ts`
Expected: FAIL — `Cannot find module '@/lib/jsonld'`.

- [ ] **Step 3: Implementar o JSON-LD**

Criar `lib/jsonld.ts`:

```ts
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
```

Criar `components/seo/JsonLd.tsx`:

```tsx
export default function JsonLd({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/seo/jsonld.test.ts`
Expected: PASS — 6 testes.

- [ ] **Step 5: Completar os metadados e injetar o JSON-LD**

Em `app/layout.tsx`, substituir o bloco `metadata` por:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.site.url),
  title: {
    default: `${site.site.nome} — ${site.contato.cidade}/${site.contato.estado}`,
    template: `%s — ${site.site.nome}`,
  },
  description: site.site.descricao,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.site.url,
    siteName: site.site.nome,
    title: `${site.site.nome} — ${site.contato.cidade}/${site.contato.estado}`,
    description: site.site.descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.site.nome,
    description: site.site.descricao,
  },
}
```

Adicionar os imports `import JsonLd from '@/components/seo/JsonLd'` e `import { dadosDaIgreja } from '@/lib/jsonld'`, e dentro do `<body>`, antes de `{children}`:

```tsx
        <JsonLd dados={dadosDaIgreja(site)} />
```

- [ ] **Step 6: Criar sitemap e robots**

Criar `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { site } from '@/content/load'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.site.url, changeFrequency: 'monthly', priority: 1 }]
}
```

Criar `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { site } from '@/content/load'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/editar', '/api/'] },
    sitemap: `${site.site.url}/sitemap.xml`,
  }
}
```

- [ ] **Step 7: Verificar o HTML gerado**

Run: `npm run build && npm start` e, em outro terminal, `curl -s localhost:3000 | grep -c 'application/ld+json'`
Expected: `1`. Conferir também que `/robots.txt` e `/sitemap.xml` respondem.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: SEO — metadados, JSON-LD Church, sitemap e robots"
```

---

### Task 14: Editor visual exclusivo de desenvolvimento

**Files:**
- Create: `app/api/content/route.ts`, `app/editar/page.tsx`, `components/editor/FormularioConteudo.tsx`
- Test: `tests/editor/rota.test.ts`

**Interfaces:**
- Consumes: `siteSchema` (Task 2).
- Produces: `GET /api/content` devolve o JSON atual; `PUT /api/content` valida com Zod e grava `content/site.json`; ambos 404 em produção. `/editar` renderiza o formulário.

- [ ] **Step 1: Escrever o teste**

Criar `tests/editor/rota.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

const original = process.env.NODE_ENV

afterEach(() => {
  vi.resetModules()
  Object.defineProperty(process.env, 'NODE_ENV', { value: original, configurable: true })
})

async function carregarRota(ambiente: string) {
  Object.defineProperty(process.env, 'NODE_ENV', { value: ambiente, configurable: true })
  vi.resetModules()
  return import('@/app/api/content/route')
}

describe('GET /api/content', () => {
  it('responde 404 em produção', async () => {
    const { GET } = await carregarRota('production')
    const resposta = await GET()
    expect(resposta.status).toBe(404)
  })

  it('devolve o conteúdo em desenvolvimento', async () => {
    const { GET } = await carregarRota('development')
    const resposta = await GET()
    expect(resposta.status).toBe(200)
    const corpo = await resposta.json()
    expect(corpo.site.nome).toBeTruthy()
  })
})

describe('PUT /api/content', () => {
  it('responde 404 em produção sem gravar nada', async () => {
    const { PUT } = await carregarRota('production')
    const resposta = await PUT(new Request('http://localhost/api/content', { method: 'PUT', body: '{}' }))
    expect(resposta.status).toBe(404)
  })

  it('rejeita conteúdo inválido com 422 e a lista de erros', async () => {
    const { PUT } = await carregarRota('development')
    const resposta = await PUT(
      new Request('http://localhost/api/content', { method: 'PUT', body: JSON.stringify({ tema: {} }) }),
    )
    expect(resposta.status).toBe(422)
    const corpo = await resposta.json()
    expect(Array.isArray(corpo.erros)).toBe(true)
    expect(corpo.erros.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/editor/rota.test.ts`
Expected: FAIL — `Cannot find module '@/app/api/content/route'`.

- [ ] **Step 3: Implementar a rota**

Criar `app/api/content/route.ts`:

```ts
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { siteSchema } from '@/content/schema'

const ARQUIVO = path.join(process.cwd(), 'content', 'site.json')

function apenasEmDesenvolvimento(): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 })
  }
  return null
}

export async function GET() {
  const bloqueio = apenasEmDesenvolvimento()
  if (bloqueio) return bloqueio

  const conteudo = await readFile(ARQUIVO, 'utf8')
  return NextResponse.json(JSON.parse(conteudo))
}

export async function PUT(request: Request) {
  const bloqueio = apenasEmDesenvolvimento()
  if (bloqueio) return bloqueio

  const enviado = await request.json()
  const resultado = siteSchema.safeParse(enviado)

  if (!resultado.success) {
    return NextResponse.json(
      { erros: resultado.error.issues.map((i) => `${i.path.join('.')} — ${i.message}`) },
      { status: 422 },
    )
  }

  await writeFile(ARQUIVO, `${JSON.stringify(resultado.data, null, 2)}\n`, 'utf8')
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/editor/rota.test.ts`
Expected: PASS — 4 testes.

- [ ] **Step 5: Implementar o formulário**

Criar `components/editor/FormularioConteudo.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'

type Valor = string | number | boolean | null | Valor[] | { [k: string]: Valor }

function achatar(objeto: Valor, prefixo = ''): [string, string][] {
  if (typeof objeto !== 'object' || objeto === null) return [[prefixo, String(objeto)]]
  return Object.entries(objeto).flatMap(([chave, valor]) =>
    achatar(valor as Valor, prefixo ? `${prefixo}.${chave}` : chave),
  )
}

function definir(alvo: Record<string, unknown>, caminho: string, valor: string) {
  const partes = caminho.split('.')
  let atual: Record<string, unknown> = alvo
  for (const parte of partes.slice(0, -1)) {
    atual = atual[parte] as Record<string, unknown>
  }
  atual[partes[partes.length - 1]] = valor
}

export default function FormularioConteudo() {
  const [conteudo, setConteudo] = useState<Record<string, unknown> | null>(null)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then(setConteudo)
  }, [])

  if (!conteudo) return <p className="p-8">Carregando…</p>

  const campos = achatar(conteudo as Valor)

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const copia = structuredClone(conteudo) as Record<string, unknown>
    for (const [caminho, valor] of dados.entries()) {
      definir(copia, caminho, String(valor))
    }
    const resposta = await fetch('/api/content', { method: 'PUT', body: JSON.stringify(copia) })
    const corpo = await resposta.json()
    setMensagem(resposta.ok ? 'Salvo.' : `Erros: ${corpo.erros.join(' | ')}`)
  }

  return (
    <form onSubmit={salvar} className="mx-auto max-w-3xl space-y-4 bg-creme p-8 text-grafite">
      <h1 className="text-2xl font-bold">Editar conteúdo do site</h1>
      {campos.map(([caminho, valor]) => (
        <label key={caminho} className="block">
          <span className="block font-mono text-xs text-grafite/70">{caminho}</span>
          <textarea
            name={caminho}
            defaultValue={valor}
            rows={valor.length > 120 ? 5 : 1}
            className="w-full rounded border border-grafite/30 p-2 text-sm"
          />
        </label>
      ))}
      <button type="submit" className="rounded-full bg-verde-escuro px-6 py-3 font-semibold text-creme">
        Salvar
      </button>
      {mensagem && <p role="status">{mensagem}</p>}
    </form>
  )
}
```

Criar `app/editar/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import FormularioConteudo from '@/components/editor/FormularioConteudo'

export const dynamic = 'force-dynamic'

export default function PaginaEditar() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <FormularioConteudo />
}
```

- [ ] **Step 6: Verificar manualmente**

Rodar `npm run dev`, abrir `/editar`, mudar `visita.texto`, salvar, conferir que `content/site.json` mudou e que `/` reflete a mudança.

Depois: `npm run build && npm start`, e conferir que `/editar` responde 404.

- [ ] **Step 7: Rodar toda a suíte e o build**

Run: `npm test && npm run build`
Expected: todos os testes passam; build conclui.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: editor visual de conteúdo restrito a desenvolvimento"
```

---

## Fora do escopo deste plano

Registrado aqui para não virar surpresa:

- **Registro do domínio** (`arvoredavidalrv.com.br` no Registro.br) e **deploy na Vercel** — dependem de contas da igreja e de decisão do Rafael.
- **Perfil da Empresa no Google** — ação fora do código, mas é o que mais afeta a busca local.
- **Fotos reais** — nenhum arquivo recebido.
- **Preenchimento dos marcadores** — WhatsApp, e-mail, CEP, coordenadas, horários de GCs.
- **Imagem de Open Graph** — precisa de arte 1200×630; hoje o card do link fica sem imagem.
- **Animação de scroll na trilha** — a direção D pede que a linha "cresça" conforme a rolagem. Fica para depois do site no ar: exige JS, precisa respeitar `prefers-reduced-motion`, e a página funciona sem isso.
- **Decap CMS** sobre o mesmo `site.json`, para edição pelo celular.
