# Status — atualizado 2026-08-08

## Onde estamos

**Fase: implementação em andamento (branch `implementacao`). Task 7 de 14 concluída.**

- [x] Brainstorming e design aprovados pelo Rafael
- [x] Spec escrito, com o conteúdo integral do folder transcrito no apêndice
- [x] Plano de implementação em 14 tarefas TDD
- [x] Brain Obsidian criado
- [x] Repositório publicado no GitHub
- [x] Task 1 — scaffold Next.js + Tailwind + Vitest
- [x] Task 2 — schema Zod, `content/site.json` (todo o texto do folder, 20 declarações de credo em 6 grupos) e `content/load.ts` (carregador validado)
- [x] Task 3 — `lib/tema.ts` (`variaveisDeTema`), tokens ligados ao Tailwind via `@theme inline` em `app/globals.css`, `<body>` com fundo verde escuro / texto creme, `app/layout.tsx` reescrito com fonte Poppins (`next/font/google`) e metadata a partir de `content/load.ts`
- [x] Task 4 — primitivas decorativas: `components/decor/Blob.tsx`, `components/decor/Circulo.tsx`, `components/ui/SeparadorXXX.tsx`, todas `aria-hidden="true"`/`focusable="false"`
- [x] Task 5 — primitivas de interface: `components/ui/Trilha.tsx`, `components/ui/Capitulo.tsx`, `components/ui/Chip.tsx`, `components/ui/Acordeao.tsx` (único client component até agora). Achados de revisão corrigidos: offset da linha da Trilha alinhado ao centro do nó (`1.875rem`/`md:2.875rem`) e painel do Acordeão passou a ficar sempre montado no DOM, escondido via `hidden` nativo (não desmontado) — ver [[log/decisions]] 2026-08-08.
- [x] Task 6 — topo da página: `components/sections/Hero.tsx` (`h1`, subtítulo, CTA de âncora, `Blob` decorativo) e `components/sections/AcoesRapidas.tsx` (nav com um link por ação — Como chegar, Domingos 18h, Instagram, YouTube — ícones SVG inline). Achados de revisão corrigidos: teste travando a regra de contraste do subtítulo (creme no mobile / limão só a partir do md:) e regra de link externo trocada de `startsWith('http')` para regex `^https?://`, com `content/schema.ts` validando o formato de `href` de `acoesRapidas` — ver [[log/decisions]] 2026-08-08.
- [x] Task 7 — capítulos `components/sections/Historia.tsx` e `components/sections/Lideranca.tsx`, ambos só conteúdo (texto em creme) dentro de `Capitulo` (Task 5), que já fornece `<section id>`, nó da trilha, rótulo e `<h2>` — ver [[log/decisions]] 2026-08-08. Achado de revisão corrigido: teste da `Historia` que contava `section#historia p` (acoplado à estrutura interna do `Capitulo`) trocado por asserção de conteúdo — ver [[log/decisions]] 2026-08-08.
- [ ] Tasks 8–14 — demais seções, SEO, editor
- [ ] Deploy

## Próximo passo

Executar o plano em `docs/superpowers/plans/2026-08-08-landing-cav.md`, começando pela Task 8. Cada task termina com testes verdes e um commit.

`app/page.tsx` ainda é o placeholder do `create-next-app` — nenhuma seção criada até agora (`Hero`, `AcoesRapidas`, `Historia`, `Lideranca`), nem as primitivas decorativas da Task 4, nem as de interface da Task 5 (`Trilha`/`Capitulo`/`Chip`/`Acordeao`), é consumida em nenhuma página ainda. A página só vai refletir o fundo escuro globalmente (via `<body>`) até que uma task futura monte o layout real com `app/page.tsx`.

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
