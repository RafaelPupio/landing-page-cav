# Landing Page — Comunidade Árvore da Vida

Página única da Comunidade Árvore da Vida (Lucas do Rio Verde/MT), pensada para
ser encontrada no Google e servir como destino do link da bio do Instagram.

**Status:** implementação completa (branch `implementacao`, 14 tarefas do plano +
revisão final). Falta só o que depende do Rafael/da igreja para lançar — ver
"O que falta para lançar" abaixo. Nenhum bloqueio é código.

- Design e conteúdo: [`docs/superpowers/specs/2026-08-08-landing-cav-design.md`](docs/superpowers/specs/2026-08-08-landing-cav-design.md)
- Plano de implementação (14 tarefas TDD): [`docs/superpowers/plans/2026-08-08-landing-cav.md`](docs/superpowers/plans/2026-08-08-landing-cav.md)
- Base de conhecimento (vault Obsidian): [`brain/INDEX.md`](brain/INDEX.md)

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zod, Vitest.

Todo o conteúdo vive em `content/site.json`, validado por Zod — nenhum componente
contém texto fixo. Alterar esse arquivo altera o site inteiro, incluindo as cores.

## O que está pronto

- Página única com hero, ações rápidas e seis capítulos numa trilha vertical
  (História, Propósito, Cuidado, Liderança, Credo, Visita), citação e rodapé.
- Todo o texto do folder impresso da igreja, transcrito verbatim, incluindo as
  20 declarações de credo em 6 grupos, num acordeão acessível.
- Identidade visual da igreja (fundo verde escuro, trilha em limão, cartão de
  visita em creme) aplicada via `content/site.json` → `lib/tema.ts`, sem cor
  hardcoded em componente.
- SEO: metadata completa (title, description, canonical, Open Graph, Twitter
  Card) em `app/layout.tsx`, dados estruturados `Church` (JSON-LD) em
  `lib/jsonld.ts`, `app/robots.ts` e `app/sitemap.ts`.
- Editor de conteúdo em `/editar` (só em desenvolvimento — 404 em produção,
  ver abaixo).
- Suíte de testes cobrindo componentes, schema, SEO e a estrutura da página.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em <http://localhost:3000> (ou na porta livre que o `next dev` escolher).

```bash
npm test          # suíte de testes (Vitest)
npm run build     # build de produção
npm run lint      # ESLint
```

## Editar o conteúdo sem programar

```bash
npm run dev
```

Abrir <http://localhost:3000/editar> — formulário com um campo por item de
conteúdo (textos, horários, endereço, redes sociais, credo etc.). Salvar grava
direto em `content/site.json`.

Essa rota, e a API que ela usa (`/api/content`), **não existem no site
publicado** — respondem 404 fora de desenvolvimento (`lib/ambiente.ts`). Se
algum dia responderem em produção, é a falha mais grave possível aqui: qualquer
visitante reescreveria o site inteiro.

## O que falta para lançar

Nenhum item abaixo é código — todos dependem do Rafael ou da igreja. Lista
completa e atualizada em [`brain/status.md`](brain/status.md), tabela de
bloqueios:

- **Domínio** — `arvoredavidalrv.com.br` sugerido, ainda não registrado.
- **Hospedagem** — Vercel (plano gratuito), conta ainda não criada.
- **Fotos** — nenhum arquivo recebido; os slots hoje renderizam gradientes.
- **Imagem Open Graph** — arte 1200×630 para o card de link.
- **Logo real** — a igreja tem um emblema circular próprio; `app/icon.svg`
  hoje é um placeholder (folha estilizada, limão sobre verde escuro).
- **Dados de contato** — telefone/WhatsApp, e-mail, CEP e coordenadas ainda
  não informados; os campos ficam vazios e os elementos correspondentes
  simplesmente não renderizam.
