# Landing Page Comunidade Árvore da Vida — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma landing page única da Comunidade Árvore da Vida que seja encontrável no Google e sirva como destino do link da bio do Instagram, apresentando identidade, informações práticas e o credo completo.

**Architecture:** Next.js App Router com renderização estática. Todo o conteúdo vive em `content/site.json`, validado por Zod na importação — nenhum componente contém texto fixo. As seções são componentes puros que recebem sua fatia do conteúdo por props. Layout bento no corpo da página, com a seção do credo em painel lateral fixo (desktop) / acordeão (mobile).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Zod, Vitest + Testing Library + jsdom.

## Global Constraints

- Node.js ≥ 20. O ambiente alvo tem Node v26 e npm 11.
- Idioma de toda a interface e do conteúdo: **pt-BR**. `<html lang="pt-BR">`.
- Tokens de cor exatos: `verdeEscuro #44581A`, `verdeLimao #A3C63C`, `creme #F7F5EC`, `grafite #1F1F1C`.
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

Rodar na raiz do repositório (a pasta já contém `docs/` e `.git`, então usar `.` como destino):

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --turbopack --no-install
```

Quando perguntar sobre sobrescrever arquivos existentes, aceitar — `docs/` e `.git` não são tocados.

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
- Test: `tests/content/schema.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `siteSchema: ZodType<Site>` e `type Site` (de `content/schema.ts`)
  - `site: Site` — default export nomeado de `content/load.ts`, já validado
  - Tipos de seção exportados: `Tema`, `Contato`, `Horario`, `Redes`, `Hero`, `SecaoTexto`, `Cuidado`, `Credo`, `GrupoCredo`, `Declaracao`, `Visita`

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
    titulo: z.string().min(1),
    paragrafos: z.array(z.string().min(1)).min(1),
  }),
  missao: z.object({ titulo: z.string().min(1), texto: z.string().min(1) }),
  visao: z.object({ titulo: z.string().min(1), itens: z.array(z.string().min(1)).min(1) }),
  valores: z.object({ titulo: z.string().min(1), itens: z.array(z.string().min(1)).min(1) }),
  cuidado: z.object({
    titulo: z.string().min(1),
    intro: z.string().min(1),
    pilares: z.array(z.object({
      nome: z.string().min(1),
      subtitulo: z.string(),
      texto: z.string().min(1),
    })).length(3),
  }),
  lideranca: z.object({ titulo: z.string().min(1), texto: z.string().min(1) }),
  credo: z.object({
    titulo: z.string().min(1),
    intro: z.string().min(1),
    grupos: z.array(grupoCredoSchema).min(1),
  }),
  citacao: z.object({ texto: z.string().min(1) }),
  visita: z.object({ titulo: z.string().min(1), texto: z.string() }),
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
})
```

- [ ] **Step 3: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/content/schema.test.ts`
Expected: FAIL — `Cannot find module '@/content/site.json'`.

- [ ] **Step 4: Criar `content/site.json`**

Preencher com o conteúdo **verbatim** do apêndice do spec (`docs/superpowers/specs/2026-08-08-landing-cav-design.md`). Estrutura, com o texto longo abreviado aqui como `…` — no arquivo real vai o texto inteiro:

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
    "titulo": "História",
    "paragrafos": [
      "A Comunidade Árvore da Vida nasceu em Abril de 2017. …",
      "Nosso orgulho não é ser da Comunidade Árvore da Vida. …",
      "Seguimos na direção mais importante, que é cumprir a Grande Comissão …"
    ]
  },
  "missao": { "titulo": "Missão", "texto": "Desejamos revelar o amor do Pai …" },
  "visao": {
    "titulo": "Visão",
    "itens": ["Amar a Deus", "Pregar a Cristo", "Servir a todos", "Andar em unidade", "Manifestar o Reino"]
  },
  "valores": {
    "titulo": "Valores",
    "itens": [
      "Autoridade da Palavra de Deus", "Disciplina espiritual", "Obra consumada da cruz",
      "Intimidade com o Espírito Santo", "Bondade imutável de Deus", "Identidade",
      "Manifestação do sobrenatural", "Cultura do Reino", "Honra", "Discipulado",
      "Famílias fortes", "Coração ensinável", "Generosidade", "Adoração"
    ]
  },
  "cuidado": {
    "titulo": "Cuidado",
    "intro": "Somos uma família vibrante de crentes cheios de esperança …",
    "pilares": [
      { "nome": "Conectar", "subtitulo": "Grupos de Conexão", "texto": "Ser igreja é muito mais do que um Culto no fim de semana. …" },
      { "nome": "Crescer", "subtitulo": "", "texto": "Pensamos em outras formas de colaborar com o crescimento dos membros …" },
      { "nome": "Servir", "subtitulo": "", "texto": "A igreja não espera cuidar de tudo para fazer algo …" }
    ]
  },
  "lideranca": {
    "titulo": "Liderança",
    "texto": "Cremos na liderança plural da Igreja, através dos Presbíteros, exemplificada no Novo Testamento."
  },
  "credo": {
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
  "visita": { "titulo": "Venha nos visitar", "texto": "" },
  "rodape": { "texto": "" }
}
```

Antes de seguir, conferir que os 20 títulos de declaração batem com os 20 do apêndice e que nenhum `…` sobrou no arquivo.

- [ ] **Step 5: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/content/schema.test.ts`
Expected: PASS — 4 testes.

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

Habilitar import de JSON em `tsconfig.json` (dentro de `compilerOptions`):

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

### Task 3: Tokens de tema e estilos globais

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `lib/tema.ts`
- Test: `tests/lib/tema.test.ts`

**Interfaces:**
- Consumes: `site.tema` (Task 2).
- Produces: `variaveisDeTema(tema: Tema): React.CSSProperties` — retorna um objeto de estilo com as custom properties `--verde-escuro`, `--verde-limao`, `--creme`, `--grafite`.

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
  background-color: var(--creme);
  color: var(--grafite);
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
git commit -m "feat: tokens de tema como variáveis CSS e fonte Poppins"
```

---

### Task 4: Primitivas decorativas

**Files:**
- Create: `components/decor/Blob.tsx`, `components/decor/Circulo.tsx`, `components/decor/GradePontilhada.tsx`, `components/ui/SeparadorXXX.tsx`
- Test: `tests/components/decor.test.tsx`

**Interfaces:**
- Consumes: classes Tailwind dos tokens (Task 3).
- Produces:
  - `<Blob variante={1|2|3} className?: string />`
  - `<Circulo tamanho={'sm'|'md'|'lg'} cor={'escuro'|'limao'} className?: string />`
  - `<GradePontilhada className?: string />`
  - `<SeparadorXXX />`

  Todos renderizam SVG com `aria-hidden="true"` e `focusable="false"`.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/decor.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Blob from '@/components/decor/Blob'
import Circulo from '@/components/decor/Circulo'
import GradePontilhada from '@/components/decor/GradePontilhada'
import SeparadorXXX from '@/components/ui/SeparadorXXX'

describe('primitivas decorativas', () => {
  it('marca todas como aria-hidden para não poluir o leitor de tela', () => {
    const { container } = render(
      <>
        <Blob variante={1} />
        <Circulo tamanho="md" cor="escuro" />
        <GradePontilhada />
        <SeparadorXXX />
      </>,
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(4)
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

- [ ] **Step 3: Implementar as primitivas**

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
    <svg
      viewBox="0 0 260 280"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={CAMINHOS[variante]} fill="currentColor" />
    </svg>
  )
}
```

Criar `components/decor/Circulo.tsx`:

```tsx
const TAMANHOS = { sm: 16, md: 32, lg: 56 } as const

export default function Circulo({
  tamanho,
  cor,
  className = '',
}: {
  tamanho: keyof typeof TAMANHOS
  cor: 'escuro' | 'limao'
  className?: string
}) {
  const d = TAMANHOS[tamanho]
  const fill = cor === 'escuro' ? 'var(--verde-escuro)' : 'var(--verde-limao)'
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill={fill} />
    </svg>
  )
}
```

Criar `components/decor/GradePontilhada.tsx`:

```tsx
export default function GradePontilhada({ className = '' }: { className?: string }) {
  return (
    <svg
      width="72"
      height="24"
      viewBox="0 0 72 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <pattern id="grade-pontilhada" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="var(--verde-escuro)" />
        </pattern>
      </defs>
      <rect width="72" height="24" fill="url(#grade-pontilhada)" />
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
      className="mx-auto my-10 text-verde-escuro"
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
git commit -m "feat: primitivas decorativas (blob, círculo, grade, separador xxx)"
```

---

### Task 5: Primitivas de interface — Card, Chip e Acordeão

**Files:**
- Create: `components/ui/Card.tsx`, `components/ui/Chip.tsx`, `components/ui/Acordeao.tsx`
- Test: `tests/components/acordeao.test.tsx`, `tests/components/card.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 3).
- Produces:
  - `<Card tom={'creme'|'escuro'|'limao'} className?: string>{children}</Card>` — `<article>` com cantos arredondados.
  - `<Chip>{children}</Chip>` — `<li>` estilizado.
  - `<Acordeao itens={{ id: string; titulo: string; conteudo: ReactNode }[]} />` — client component, um item aberto por vez, `aria-expanded`/`aria-controls` corretos, operável por Enter e Espaço.

- [ ] **Step 1: Escrever os testes**

Criar `tests/components/card.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'

describe('Card', () => {
  it('renderiza o conteúdo e aplica o tom', () => {
    render(<Card tom="escuro">Missão</Card>)
    const card = screen.getByText('Missão')
    expect(card).toHaveClass('bg-verde-escuro')
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

Run: `npm test -- tests/components/acordeao.test.tsx tests/components/card.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar Card e Chip**

Criar `components/ui/Card.tsx`:

```tsx
import type { ReactNode } from 'react'

const TONS = {
  creme: 'bg-creme text-grafite',
  escuro: 'bg-verde-escuro text-creme',
  limao: 'bg-verde-limao text-verde-escuro',
} as const

export default function Card({
  tom,
  className = '',
  children,
}: {
  tom: keyof typeof TONS
  className?: string
  children: ReactNode
}) {
  return (
    <article className={`rounded-3xl p-6 md:p-8 ${TONS[tom]} ${className}`}>
      {children}
    </article>
  )
}
```

Criar `components/ui/Chip.tsx`:

```tsx
import type { ReactNode } from 'react'

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-verde-escuro/30 px-4 py-2 text-sm text-verde-escuro">
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
    <div className="divide-y divide-verde-escuro/20 border-y border-verde-escuro/20">
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
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
              >
                {item.titulo}
                <span aria-hidden="true" className="text-2xl leading-none">
                  {estaAberto ? '−' : '+'}
                </span>
              </button>
            </h3>
            {estaAberto && (
              <div
                role="region"
                id={`painel-${item.id}`}
                aria-labelledby={`gatilho-${item.id}`}
                className="pb-8"
              >
                {item.conteudo}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Rodar os testes para vê-los passar**

Run: `npm test -- tests/components/acordeao.test.tsx tests/components/card.test.tsx`
Expected: PASS — 6 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: primitivas de interface — card, chip e acordeão acessível"
```

---

### Task 6: Hero e Ações Rápidas

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/AcoesRapidas.tsx`
- Test: `tests/components/hero.test.tsx`

**Interfaces:**
- Consumes: `site.hero`, `site.acoesRapidas`, `Blob`, `Circulo` (Task 4).
- Produces:
  - `<Hero hero={site['hero']} />`
  - `<AcoesRapidas acoes={site['acoesRapidas']} />`

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
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/hero.test.tsx`
Expected: FAIL — módulos não encontrados.

- [ ] **Step 3: Implementar o Hero**

Criar `components/sections/Hero.tsx`:

```tsx
import Blob from '@/components/decor/Blob'
import Circulo from '@/components/decor/Circulo'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28">
      <Blob variante={1} className="pointer-events-none absolute -right-24 -top-32 w-80 text-verde-escuro/90 md:w-[28rem]" />
      <Blob variante={3} className="pointer-events-none absolute -left-32 bottom-0 w-72 text-verde-limao/40" />
      <div className="relative mx-auto max-w-4xl">
        <Circulo tamanho="md" cor="limao" className="mb-6" />
        <h1 className="text-4xl font-bold uppercase leading-tight tracking-tight text-verde-escuro md:text-6xl">
          {hero.titulo}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light text-grafite md:text-2xl">
          {hero.subtitulo}
        </p>
        <a
          href={hero.ctaAncora}
          className="mt-10 inline-block rounded-full bg-verde-escuro px-8 py-4 text-base font-semibold text-creme transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
        >
          {hero.ctaTexto}
        </a>
      </div>
    </section>
  )
}
```

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
    <nav aria-label="Ações rápidas" className="px-6 pb-16">
      <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
        {acoes.map((acao) => {
          const externo = acao.href.startsWith('http')
          return (
            <li key={acao.rotulo}>
              <a
                href={acao.href}
                {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-verde-escuro/20 bg-white/60 p-4 text-sm font-semibold text-verde-escuro transition hover:border-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
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
Expected: PASS — 4 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: hero e faixa de ações rápidas"
```

---

### Task 7: História e Liderança

**Files:**
- Create: `components/sections/Historia.tsx`, `components/sections/Lideranca.tsx`
- Test: `tests/components/textos.test.tsx`

**Interfaces:**
- Consumes: `site.historia`, `site.lideranca`, `Blob`, `SeparadorXXX`.
- Produces: `<Historia historia={site['historia']} />`, `<Lideranca lideranca={site['lideranca']} />`

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/textos.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Historia from '@/components/sections/Historia'
import Lideranca from '@/components/sections/Lideranca'

describe('Historia', () => {
  const HISTORIA = { titulo: 'História', paragrafos: ['Primeiro.', 'Segundo.', 'Terceiro.'] }

  it('renderiza um parágrafo por item', () => {
    const { container } = render(<Historia historia={HISTORIA} />)
    expect(container.querySelectorAll('p')).toHaveLength(3)
  })

  it('expõe a âncora #historia', () => {
    const { container } = render(<Historia historia={HISTORIA} />)
    expect(container.querySelector('#historia')).not.toBeNull()
  })
})

describe('Lideranca', () => {
  it('renderiza título e texto', () => {
    render(<Lideranca lideranca={{ titulo: 'Liderança', texto: 'Presbíteros.' }} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Liderança')
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
import Blob from '@/components/decor/Blob'
import type { Site } from '@/content/schema'

export default function Historia({ historia }: { historia: Site['historia'] }) {
  return (
    <section id="historia" className="relative overflow-hidden px-6 py-16">
      <Blob variante={2} className="pointer-events-none absolute -left-40 top-10 w-96 text-verde-limao/25" />
      <div className="relative mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold uppercase text-verde-limao md:text-4xl">
          {historia.titulo}
        </h2>
        <div className="mt-6 space-y-5 text-base font-light leading-relaxed text-grafite md:text-lg">
          {historia.paragrafos.map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Criar `components/sections/Lideranca.tsx`:

```tsx
import type { Site } from '@/content/schema'

export default function Lideranca({ lideranca }: { lideranca: Site['lideranca'] }) {
  return (
    <section id="lideranca" className="px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl bg-verde-escuro p-8 text-creme md:p-12">
        <h2 className="text-3xl font-bold uppercase md:text-4xl">{lideranca.titulo}</h2>
        <p className="mt-4 text-lg font-light leading-relaxed">{lideranca.texto}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/textos.test.tsx`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seções de história e liderança"
```

---

### Task 8: Missão, Visão e Valores em grade bento

**Files:**
- Create: `components/sections/MissaoVisaoValores.tsx`
- Test: `tests/components/missao.test.tsx`

**Interfaces:**
- Consumes: `site.missao`, `site.visao`, `site.valores`, `Card`, `Chip`.
- Produces: `<MissaoVisaoValores missao={…} visao={…} valores={…} />`

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/missao.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MissaoVisaoValores from '@/components/sections/MissaoVisaoValores'

const PROPS = {
  missao: { titulo: 'Missão', texto: 'Revelar o amor do Pai.' },
  visao: { titulo: 'Visão', itens: ['Amar a Deus', 'Pregar a Cristo'] },
  valores: { titulo: 'Valores', itens: ['Honra', 'Adoração', 'Generosidade'] },
}

describe('MissaoVisaoValores', () => {
  it('renderiza os três títulos como h2', () => {
    render(<MissaoVisaoValores {...PROPS} />)
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titulos).toEqual(['Missão', 'Visão', 'Valores'])
  })

  it('renderiza um item de lista por valor e por item de visão', () => {
    render(<MissaoVisaoValores {...PROPS} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('expõe a âncora #missao', () => {
    const { container } = render(<MissaoVisaoValores {...PROPS} />)
    expect(container.querySelector('#missao')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/missao.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/MissaoVisaoValores.tsx`:

```tsx
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import GradePontilhada from '@/components/decor/GradePontilhada'
import type { Site } from '@/content/schema'

export default function MissaoVisaoValores({
  missao,
  visao,
  valores,
}: {
  missao: Site['missao']
  visao: Site['visao']
  valores: Site['valores']
}) {
  return (
    <section id="missao" className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:grid-rows-2">
        <Card tom="escuro" className="md:col-span-2 md:row-span-2 flex flex-col justify-between">
          <h2 className="text-3xl font-bold uppercase md:text-4xl">{missao.titulo}</h2>
          <p className="mt-6 text-lg font-light leading-relaxed md:text-xl">{missao.texto}</p>
          <GradePontilhada className="mt-8 opacity-60" />
        </Card>

        <Card tom="limao">
          <h2 className="text-2xl font-bold uppercase">{visao.titulo}</h2>
          <ul className="mt-4 space-y-1 text-base font-light">
            {visao.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card tom="creme" className="border border-verde-escuro/20">
          <h2 className="text-2xl font-bold uppercase text-verde-limao">{valores.titulo}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {valores.itens.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/missao.test.tsx`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: missão, visão e valores em grade bento"
```

---

### Task 9: Seção Cuidado — Conectar, Crescer, Servir

**Files:**
- Create: `components/sections/Cuidado.tsx`
- Test: `tests/components/cuidado.test.tsx`

**Interfaces:**
- Consumes: `site.cuidado`, `Card`, `SeparadorXXX`.
- Produces: `<Cuidado cuidado={site['cuidado']} />`

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/cuidado.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Cuidado from '@/components/sections/Cuidado'

const CUIDADO = {
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
    // Conectar tem subtítulo; Crescer e Servir não. Logo, um único elemento de subtítulo.
    expect(container.querySelectorAll('[data-subtitulo]')).toHaveLength(1)
  })

  it('expõe a âncora #cuidado', () => {
    const { container } = render(<Cuidado cuidado={CUIDADO} />)
    expect(container.querySelector('#cuidado')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/cuidado.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/Cuidado.tsx`:

```tsx
import Card from '@/components/ui/Card'
import SeparadorXXX from '@/components/ui/SeparadorXXX'
import type { Site } from '@/content/schema'

export default function Cuidado({ cuidado }: { cuidado: Site['cuidado'] }) {
  return (
    <section id="cuidado" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold uppercase text-verde-limao md:text-4xl">
          {cuidado.titulo}
        </h2>
        <p className="mt-4 max-w-3xl text-lg font-light leading-relaxed text-grafite">
          {cuidado.intro}
        </p>
        <SeparadorXXX />
        <div className="grid gap-4 md:grid-cols-3">
          {cuidado.pilares.map((pilar) => (
            <Card key={pilar.nome} tom="creme" className="border border-verde-escuro/20">
              <h3 className="text-2xl font-bold uppercase text-verde-limao">{pilar.nome}</h3>
              {pilar.subtitulo && (
                <p
                  data-subtitulo
                  className="mt-1 text-sm font-semibold uppercase tracking-wide text-verde-escuro"
                >
                  {pilar.subtitulo}
                </p>
              )}
              <p className="mt-4 text-base font-light leading-relaxed">{pilar.texto}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/cuidado.test.tsx`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seção cuidado (conectar, crescer, servir)"
```

---

### Task 10: Credo — Split Sticky no desktop, acordeão no mobile

**Files:**
- Create: `components/sections/Credo.tsx`
- Test: `tests/components/credo.test.tsx`

**Interfaces:**
- Consumes: `site.credo`, `Acordeao` e `ItemAcordeao` (Task 5).
- Produces: `<Credo credo={site['credo']} />`

O componente renderiza **um único conjunto de dados** em dois arranjos: um `<nav>` de índice visível só a partir de `lg:` (posicionado com `lg:sticky`) e o acordeão sempre presente. O índice usa links de âncora para os `id`s dos grupos — sem JavaScript adicional, o que mantém a seção funcional mesmo antes da hidratação.

- [ ] **Step 1: Escrever o teste**

Criar `tests/components/credo.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Credo from '@/components/sections/Credo'

const CREDO = {
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
  it('lista todos os grupos no índice de navegação', () => {
    render(<Credo credo={CREDO} />)
    const indice = screen.getByRole('navigation', { name: /grupos de crenças/i })
    expect(indice).toHaveTextContent('As Escrituras')
    expect(indice).toHaveTextContent('Deus, Cristo e o Espírito')
  })

  it('aponta cada link do índice para o id do grupo', () => {
    render(<Credo credo={CREDO} />)
    expect(screen.getByRole('link', { name: 'As Escrituras' })).toHaveAttribute('href', '#credo-escrituras')
  })

  it('mantém as declarações fechadas até o clique', async () => {
    const user = userEvent.setup()
    render(<Credo credo={CREDO} />)
    expect(screen.queryByText('CREMOS em um único Deus.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Deus, Cristo e o Espírito' }))
    expect(screen.getByText('CREMOS em um único Deus.')).toBeInTheDocument()
    expect(screen.getByText('CREMOS no Senhor Jesus Cristo.')).toBeInTheDocument()
  })

  it('expõe a âncora #credo', () => {
    const { container } = render(<Credo credo={CREDO} />)
    expect(container.querySelector('#credo')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/components/credo.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar**

Criar `components/sections/Credo.tsx`:

```tsx
import Acordeao, { type ItemAcordeao } from '@/components/ui/Acordeao'
import type { Site } from '@/content/schema'

export default function Credo({ credo }: { credo: Site['credo'] }) {
  const itens: ItemAcordeao[] = credo.grupos.map((grupo) => ({
    id: grupo.id,
    titulo: grupo.nome,
    conteudo: (
      <div className="space-y-6">
        {grupo.declaracoes.map((declaracao) => (
          <div key={declaracao.titulo}>
            <h4 className="text-base font-semibold text-verde-escuro">{declaracao.titulo}</h4>
            <p className="mt-2 text-base font-light leading-relaxed text-grafite">
              {declaracao.texto}
            </p>
          </div>
        ))}
      </div>
    ),
  }))

  return (
    <section id="credo" className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Grupos de crenças" className="hidden lg:block">
          <div className="lg:sticky lg:top-10">
            <h2 className="text-3xl font-bold uppercase text-verde-limao">{credo.titulo}</h2>
            <ul className="mt-6 space-y-2 text-sm">
              {credo.grupos.map((grupo) => (
                <li key={grupo.id}>
                  <a
                    href={`#credo-${grupo.id}`}
                    className="text-verde-escuro underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
                  >
                    {grupo.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div>
          <h2 className="text-3xl font-bold uppercase text-verde-limao lg:hidden">
            {credo.titulo}
          </h2>
          <p className="mt-4 mb-8 text-base font-light leading-relaxed text-grafite">
            {credo.intro}
          </p>
          {itens.map((item) => (
            <div key={item.id} id={`credo-${item.id}`} className="scroll-mt-10">
              <Acordeao itens={[item]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

A âncora `#credo-<id>` é responsabilidade do `Credo`, não do `Acordeao` — por isso cada grupo recebe seu próprio `Acordeao` de um item só, envolvido por uma `<div>` com o `id`. Isso mantém o `Acordeao` genérico e reutilizável, ao custo de perder o fechamento automático entre grupos vizinhos. O terceiro teste desta task valida que a declaração continua fechada até o clique, que é o comportamento que importa aqui.

- [ ] **Step 4: Rodar o teste para vê-lo passar**

Run: `npm test -- tests/components/credo.test.tsx`
Expected: PASS — 4 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seção como cremos com índice fixo e acordeão"
```

---

### Task 11: Citação, Visita e Rodapé

**Files:**
- Create: `components/sections/Citacao.tsx`, `components/sections/Visita.tsx`, `components/sections/Rodape.tsx`
- Test: `tests/components/visita.test.tsx`

**Interfaces:**
- Consumes: `site.citacao`, `site.visita`, `site.contato`, `site.horarios`, `site.redes`, `site.site`.
- Produces:
  - `<Citacao citacao={site['citacao']} />`
  - `<Visita visita={…} contato={…} horarios={…} />`
  - `<Rodape nome={…} redes={…} texto={…} />`

Regra de degradação (do spec): campo vazio não renderiza bloco vazio. `contato.telefone === ''` → sem botão de telefone. `contato.mapaEmbedUrl === ''` → só o link "Abrir no Google Maps".

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

describe('Visita', () => {
  it('mostra endereço e horário', () => {
    render(<Visita visita={{ titulo: 'Venha nos visitar', texto: '' }} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.getByText(/Av\. das Emas, 2240W/)).toBeInTheDocument()
    expect(screen.getByText('Domingos, 18h')).toBeInTheDocument()
  })

  it('omite o botão de telefone quando o campo está vazio', () => {
    render(<Visita visita={{ titulo: 'Venha nos visitar', texto: '' }} contato={CONTATO} horarios={HORARIOS} />)
    expect(screen.queryByRole('link', { name: /telefone/i })).not.toBeInTheDocument()
  })

  it('cai para o link do Maps quando não há embed', () => {
    render(
      <Visita
        visita={{ titulo: 'Venha nos visitar', texto: '' }}
        contato={{ ...CONTATO, mapaEmbedUrl: '' }}
        horarios={HORARIOS}
      />,
    )
    expect(screen.queryByTitle('Mapa')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Abrir no Google Maps/i })).toHaveAttribute('href', CONTATO.mapsUrl)
  })
})

describe('Citacao', () => {
  it('renderiza como blockquote', () => {
    const { container } = render(<Citacao citacao={{ texto: 'Essas crenças são a base.' }} />)
    expect(container.querySelector('blockquote')).toHaveTextContent('Essas crenças são a base.')
  })
})

describe('Rodape', () => {
  it('linka Instagram e YouTube', () => {
    render(
      <Rodape
        nome="Comunidade Árvore da Vida"
        texto=""
        redes={{ instagram: 'https://instagram.com/x', youtube: 'https://youtube.com/y' }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://instagram.com/x')
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
    <section className="px-6 py-16">
      <blockquote className="mx-auto max-w-3xl text-2xl font-bold leading-snug text-verde-limao md:text-4xl">
        {citacao.texto}
      </blockquote>
    </section>
  )
}
```

Criar `components/sections/Visita.tsx`:

```tsx
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
    <section id="visita" className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl bg-verde-escuro p-8 text-creme md:grid-cols-2 md:p-12">
        <div>
          <h2 className="text-3xl font-bold uppercase md:text-4xl">{visita.titulo}</h2>
          {visita.texto && <p className="mt-4 font-light leading-relaxed">{visita.texto}</p>}

          <p className="mt-8 text-lg font-light">{endereco}</p>

          <dl className="mt-6 space-y-1">
            {horarios.map((horario) => (
              <div key={horario.rotulo} className="flex gap-2">
                <dt className="font-semibold">{horario.rotulo}:</dt>
                <dd className="font-light">{horario.quando}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={contato.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-verde-limao px-6 py-3 font-semibold text-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
            >
              Abrir no Google Maps
            </a>
            {contato.telefone && (
              <a
                href={`tel:${contato.telefone.replace(/\D/g, '')}`}
                className="rounded-full border border-creme px-6 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
              >
                Telefone
              </a>
            )}
          </div>
        </div>

        {contato.mapaEmbedUrl && (
          <iframe
            title="Mapa"
            src={contato.mapaEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-2xl border-0 md:h-full"
          />
        )}
      </div>
    </section>
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
    <footer className="px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-verde-escuro/20 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-verde-escuro">{nome}</p>
        {texto && <p className="text-sm font-light text-grafite">{texto}</p>}
        <ul className="flex gap-6 text-sm font-semibold text-verde-escuro">
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
Expected: PASS — 5 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: citação, seção de visita e rodapé"
```

---

### Task 12: Montagem da página

**Files:**
- Modify: `app/page.tsx`
- Test: `tests/pagina.test.tsx`

**Interfaces:**
- Consumes: todas as seções (Tasks 6–11) e `site` (Task 2).
- Produces: `/` renderizando as 10 seções na ordem do spec.

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
    for (const ancora of ['inicio', 'historia', 'missao', 'cuidado', 'lideranca', 'credo', 'visita']) {
      expect(container.querySelector(`#${ancora}`), `âncora #${ancora}`).not.toBeNull()
    }
  })

  it('renderiza os 14 valores do conteúdo real', () => {
    render(<Pagina />)
    for (const valor of site.valores.itens) {
      expect(screen.getByText(valor)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Rodar o teste para vê-lo falhar**

Run: `npm test -- tests/pagina.test.tsx`
Expected: FAIL — a página ainda é a do scaffold, sem as âncoras.

- [ ] **Step 3: Implementar**

Substituir `app/page.tsx` por:

```tsx
import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'
import Historia from '@/components/sections/Historia'
import MissaoVisaoValores from '@/components/sections/MissaoVisaoValores'
import Cuidado from '@/components/sections/Cuidado'
import Lideranca from '@/components/sections/Lideranca'
import Credo from '@/components/sections/Credo'
import Citacao from '@/components/sections/Citacao'
import Visita from '@/components/sections/Visita'
import Rodape from '@/components/sections/Rodape'
import SeparadorXXX from '@/components/ui/SeparadorXXX'
import { site } from '@/content/load'

export default function Pagina() {
  return (
    <main>
      <Hero hero={site.hero} />
      <AcoesRapidas acoes={site.acoesRapidas} />
      <Historia historia={site.historia} />
      <SeparadorXXX />
      <MissaoVisaoValores missao={site.missao} visao={site.visao} valores={site.valores} />
      <Cuidado cuidado={site.cuidado} />
      <Lideranca lideranca={site.lideranca} />
      <SeparadorXXX />
      <Credo credo={site.credo} />
      <Citacao citacao={site.citacao} />
      <Visita visita={site.visita} contato={site.contato} horarios={site.horarios} />
      <Rodape nome={site.site.nome} texto={site.rodape.texto} redes={site.redes} />
    </main>
  )
}
```

- [ ] **Step 4: Rodar toda a suíte e o build**

Run: `npm test && npm run build`
Expected: todos os testes passam; build conclui com `/` estática.

- [ ] **Step 5: Verificar no navegador**

Subir o dev server e conferir em 375px e 1280px de largura: hero legível, ações rápidas acima da dobra no celular, acordeão do credo abrindo, índice lateral fixo aparecendo só no desktop, mapa carregando.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: montagem da página com todas as seções"
```

---

### Task 13: SEO — metadados, JSON-LD, sitemap e robots

**Files:**
- Create: `components/seo/JsonLd.tsx`, `lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`
- Test: `tests/seo/jsonld.test.ts`

**Interfaces:**
- Consumes: `site` (Task 2).
- Produces: `dadosDaIgreja(site: Site): Record<string, unknown>` — objeto JSON-LD tipo `Church`; `<JsonLd dados={…} />` — injeta `<script type="application/ld+json">`.

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
Expected: PASS — 5 testes.

- [ ] **Step 5: Completar os metadados e injetar o JSON-LD**

Em `app/layout.tsx`, substituir o bloco `metadata` e adicionar o `JsonLd` dentro do `<body>`, antes de `{children}`:

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

Adicionar o import `import JsonLd from '@/components/seo/JsonLd'` e `import { dadosDaIgreja } from '@/lib/jsonld'`, e dentro do `<body>`:

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

Run: `npm run build && npm start` e, em outro terminal, `curl -s localhost:3000 | grep -o 'application/ld+json'`
Expected: uma ocorrência. Conferir também que `curl -s localhost:3000/robots.txt` e `/sitemap.xml` respondem.

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

  if (!conteudo) return <p>Carregando…</p>

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
    <form onSubmit={salvar} className="mx-auto max-w-3xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Editar conteúdo do site</h1>
      {campos.map(([caminho, valor]) => (
        <label key={caminho} className="block">
          <span className="block text-xs font-mono text-gray-600">{caminho}</span>
          <textarea
            name={caminho}
            defaultValue={valor}
            rows={valor.length > 120 ? 5 : 1}
            className="w-full rounded border p-2 text-sm"
          />
        </label>
      ))}
      <button type="submit" className="rounded bg-verde-escuro px-6 py-3 font-semibold text-creme">
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

Rodar `npm run dev`, abrir `/editar`, mudar o texto de `visita.texto`, salvar, conferir que `content/site.json` mudou e que `/` reflete a mudança.

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
- **Fotos reais** — os slots existem; substituir quando os arquivos chegarem.
- **Preenchimento dos marcadores** — WhatsApp, e-mail, CEP, coordenadas, horários de GCs.
- **Imagem de Open Graph** — precisa de uma arte 1200×630; hoje o card do link fica sem imagem.
- **Decap CMS** sobre o mesmo `site.json`, para edição pelo celular.
