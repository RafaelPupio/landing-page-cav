# Status — atualizado 2026-08-08

## Onde estamos

**Fase: implementação em andamento (branch `implementacao`). Task 4 de 14 concluída.**

- [x] Brainstorming e design aprovados pelo Rafael
- [x] Spec escrito, com o conteúdo integral do folder transcrito no apêndice
- [x] Plano de implementação em 14 tarefas TDD
- [x] Brain Obsidian criado
- [x] Repositório publicado no GitHub
- [x] Task 1 — scaffold Next.js + Tailwind + Vitest
- [x] Task 2 — schema Zod, `content/site.json` (todo o texto do folder, 20 declarações de credo em 6 grupos) e `content/load.ts` (carregador validado)
- [x] Task 3 — `lib/tema.ts` (`variaveisDeTema`), tokens ligados ao Tailwind via `@theme inline` em `app/globals.css`, `<body>` com fundo verde escuro / texto creme, `app/layout.tsx` reescrito com fonte Poppins (`next/font/google`) e metadata a partir de `content/load.ts`
- [x] Task 4 — primitivas decorativas: `components/decor/Blob.tsx`, `components/decor/Circulo.tsx`, `components/ui/SeparadorXXX.tsx`, todas `aria-hidden="true"`/`focusable="false"`
- [ ] Tasks 5–14 — seções, SEO, editor
- [ ] Deploy

## Próximo passo

Executar o plano em `docs/superpowers/plans/2026-08-08-landing-cav.md`, começando pela Task 5. Cada task termina com testes verdes e um commit.

`app/page.tsx` ainda é o placeholder do `create-next-app` — as primitivas da Task 4 ainda não são consumidas em nenhuma página. A página só vai refletir o fundo escuro globalmente (via `<body>`) até que as seções da Task 5+ sejam construídas usando `Blob`, `Circulo` e `SeparadorXXX`.

## Bloqueios reais

Nenhum bloqueia a implementação. Os itens abaixo bloqueiam apenas o **lançamento**, e todos dependem do Rafael ou da igreja, não de código:

| Item | Situação |
|---|---|
| Domínio | Não registrado. Sugestão: `arvoredavidalrv.com.br` no Registro.br, ~R$40/ano |
| Hospedagem | Vercel, plano gratuito — conta ainda não criada |
| WhatsApp / telefone | Desconhecido. Fica como campo vazio; o botão simplesmente não renderiza |
| E-mail, CEP, coordenadas | Desconhecidos, mesmo tratamento |
| Horários de GCs | Desconhecidos. Só o culto de domingo 18h está confirmado |
| Fotos | Nenhum arquivo recebido. Os slots existem e renderizam gradientes |
| Imagem Open Graph | Precisa de arte 1200×630. Sem ela, o card do link fica sem imagem |
| Perfil da Empresa no Google | Não verificado se existe. Ver [[projeto/seo]] — importa mais que o site |

## Dados confirmados

Endereço, horário e redes vieram do perfil do Instagram em 2026-08-08. Ver [[projeto/objetivo]].
