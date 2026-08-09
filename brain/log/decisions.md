# Decisões

Append-only. Cada entrada: o que foi decidido, e por quê. Nunca reescrever uma entrada antiga — se uma decisão for revertida, escrever uma entrada nova dizendo isso.

---

## 2026-08-08 — Objetivo duplo: visitante novo + credo completo

Rafael escolheu os dois objetivos, não um. Resolvido em [[projeto/objetivo]]: a página abre como convite e o credo vive em seção própria com acordeão, para que um não sabote o outro.

## 2026-08-08 — Stack: Next.js 15 + Tailwind v4

Rafael escolheu, contra a recomendação inicial de HTML estático puro. A recomendação era pela facilidade de manutenção por alguém da igreja. Ele preferiu Next.js — decisão dele, e defensável: o projeto pode crescer (agenda, blog) e ele já lida com ferramenta técnica no TraderBot. A camada de edição em `/editar` compensa a perda de simplicidade.

## 2026-08-08 — Dados práticos vieram do Instagram

Endereço (Av. das Emas, 2240W — Parque das Emas, Lucas do Rio Verde/MT), horário (domingos 18h), bio e YouTube extraídos do perfil público. WhatsApp e telefone não constam no perfil e permanecem vazios.

## 2026-08-08 — Layout mudou de Editorial Orgânico para Bento após o Rafael revelar o uso real

A recomendação inicial era Editorial Orgânico com Split Sticky no credo. Quando o Rafael explicou que a página serve à busca no Google e ao link da bio do Instagram, mudei para **Bento Grid como base, Split Sticky só no credo**. O bento sobrevive melhor à tela de celular vinda do Instagram: cada card é uma resposta inteira e o visitante acha o endereço sem ler nada.

Lição: a informação sobre o *canal* mudou a decisão mais que qualquer preferência estética. Vale perguntar isso cedo em projeto de página.

## 2026-08-08 — Camada de SEO adicionada ao escopo

Não estava no design original. Entrou junto com o objetivo "aparecer no Google": JSON-LD `Church`, metadados pt-BR, sitemap, robots. Ver [[projeto/seo]].

Registrado junto o aviso honesto: o Perfil da Empresa no Google importa mais que o site para busca local. Melhor o Rafael saber disso do que descobrir depois que a página não trouxe visitante.

## 2026-08-08 — `content/site.json` como fonte única, validado por Zod

Rafael pediu um jeito de modificar o site inteiro. Decisão: um arquivo JSON com 100% do conteúdo e dos tokens de tema, schema Zod que **quebra o build** em vez de publicar página torta, e `/editar` como formulário visual restrito a desenvolvimento.

`/editar` e `/api/content` retornam 404 em produção. Sem isso, qualquer visitante reescreveria o site — é a falha mais grave possível neste projeto e está na checklist de deploy.

## 2026-08-08 — Correções tipográficas autorizadas no texto do folder

Três, e só três: "EspíritoSanto" → "Espírito Santo"; "Bondade imutávelde Deus" → "Bondade imutável de Deus"; "procura-los" → "procurá-los". Todo o resto do texto doutrinário é verbatim. Ver a regra em [[projeto/conteudo]].

## 2026-08-08 — Corpo de texto alinhado à esquerda, não justificado

O folder impresso usa texto justificado. Na web, coluna estreita justificada cria rios de espaço em branco no celular — e o celular é o caso de uso principal. Divergência consciente do impresso.

## 2026-08-08 — Âncora do credo pertence ao `Credo`, não ao `Acordeao`

Cada grupo recebe seu próprio `Acordeao` de um item só, envolvido por uma `<div id="credo-<id>">`. Mantém o `Acordeao` genérico e reutilizável. Custo: grupos vizinhos não se fecham automaticamente. Aceito — o comportamento que importa (declaração fechada até o clique) continua garantido por teste.

## 2026-08-08 — Repositório publicado como privado no GitHub

`RafaelPupio/landing-page-cav`, privado. Deploy na Vercel funciona com repositório privado. Se o Rafael quiser abrir depois, é um clique.

## 2026-08-08 — Layout final: direção D (Capítulos), não Bento

Rafael escolheu D depois de ver as quatro maquetes renderizadas com o conteúdo real (`docs/mockups/`). Reverte a decisão de layout tomada mais cedo hoje.

Fundo verde escuro do topo ao rodapé, com uma trilha vertical em limão ligando os capítulos de Abril/2017 até "venha nos visitar". Custo aceito: mais rolagem até o endereço do que num bento. Mitigação: ações rápidas acima da dobra e cartão de visita em creme, o único bloco claro da página.

Saiu de escopo junto: o índice lateral fixo do credo — na trilha o próprio tronco já orienta.

## 2026-08-08 — Regra de contraste do limão sobre o fundo escuro

Medido: limão `#A3C63C` sobre verde `#44581A` = **4,02:1**. Passa AA de texto grande (3:1), reprova o de texto normal (4,5:1). Creme sobre o mesmo fundo = **7,24:1**.

A maquete D usava limão em rótulos de 10px e no texto do botão — ambos reprovariam. Regra adotada: limão **só** na linha da trilha, nos nós e em texto de 24px ou mais. Todo o resto em creme. Botão primário = fundo creme com texto verde escuro.

Isso vale para qualquer componente novo. Se aparecer limão num texto pequeno, é regressão de acessibilidade.

## 2026-08-08 — Grade pontilhada cortada

Existia no folder impresso e estava no plano anterior. No fundo escuro vira ruído sem informar nada. Removida das primitivas decorativas.

## 2026-08-08 — Implementação numa branch, não na main

Branch `implementacao`. A main fica com documentação estável até o site passar na revisão final.

## 2026-08-08 — Task 2 concluída: `content/schema.ts`, `content/site.json`, `content/load.ts`

Schema Zod, JSON com todo o texto do folder (transcrito verbatim do apêndice do spec) e carregador que quebra o build se o conteúdo for inválido. 20 declarações de credo em 6 grupos, contagem conferida contra o apêndice. `npm test` (6 testes) e `npm run build` passam.

Ajuste não previsto pelo brief: em `tests/content/schema.test.ts`, o teste "exige rótulo em todos os capítulos" fazia `structuredClone(conteudo) as Record<string, Record<string, unknown>>`, que o TypeScript strict recusa no `next build` (a propriedade `horarios` é um array, incompatível com a assinatura de índice de dois níveis). Corrigido para `as unknown as Record<...>` — mesmo comportamento em runtime, só satisfaz o type-checker. Único arquivo alterado fora do que o brief especificou.

## 2026-08-08 — Task 3 concluída: `lib/tema.ts`, tokens ligados ao Tailwind, fundo escuro global

`variaveisDeTema(tema: Tema): CSSProperties` converte os quatro tokens de `content/site.json.tema` em custom properties CSS (`--verde-escuro`, `--verde-limao`, `--creme`, `--grafite`). `app/globals.css` reescrito: `@theme inline` expõe os tokens ao Tailwind (`bg-verde-escuro` etc.) e o `font-sans` passa a apontar para `--font-poppins`; `body` recebe `background-color: var(--verde-escuro)` e `color: var(--creme)` diretamente, sem depender de nenhuma classe em `page.tsx`. `app/layout.tsx` reescrito por completo: sai o boilerplate do `create-next-app` (fontes Geist, `<html lang="en">`), entra Poppins via `next/font/google`, `lang="pt-BR"`, `metadata` lido de `site.site.nome`/`descricao`, e `style={variaveisDeTema(site.tema)}` aplicado no `<body>`.

Confirmado no build: `#44581A` aparece no CSS compilado (`.next/static/chunks/*.css`), então o fundo escuro é real, não só teórico.

`app/page.tsx` **não foi tocado** — fora de escopo desta task, por instrução explícita. Continua sendo o placeholder do `create-next-app`, com `bg-zinc-50`/`bg-white` cobrindo o `<main>` por cima do fundo escuro do `<body>`. Isso significa que quem abrir `npm run dev` agora ainda vê uma página majoritariamente branca por dentro — o fundo escuro só é visível nas bordas fora do `<main>` até a Task 4 substituir `page.tsx` pelas seções reais. Registrado para não ser confundido com regressão.

Atualizada também `brain/projeto/identidade-visual.md`: a tabela de tokens ainda descrevia `creme` como "fundo da página", herdado da fase pré-decisão de layout D. Corrigida para refletir `verdeEscuro` como fundo geral e `creme` como cor de texto/cartão de visita, consistente com a decisão "Layout final: direção D" já registrada acima.

`npm test` (7 testes, incluindo o novo `tests/lib/tema.test.ts`) e `npm run build` passam.

Achado a registrar: um `…` sobrevive em `content/site.json` (dentro da citação de Mateus 28.20, no parágrafo de história) e `grep -c '…'` retorna 1, não 0 como o brief exige. Verificado contra o apêndice (`docs/superpowers/specs/2026-08-08-landing-cav-design.md:165`): não é texto truncado por mim, é uma citação bíblica parcial que já vem com reticências no próprio apêndice-fonte. Mantido verbatim por ser mais específico e mais grave desviar do "nunca reescrever, nunca cortar referência bíblica" do que satisfazer o grep. Sinalizado para o Rafael revisar.

## 2026-08-08 — Task 4 concluída: primitivas decorativas

`components/decor/Blob.tsx` (3 variantes de path, `fill="currentColor"`, cor herdada de classe Tailwind no consumidor), `components/decor/Circulo.tsx` (3 tamanhos, cor via `var(--verde-escuro|--verde-limao|--creme)` direto no atributo `fill`) e `components/ui/SeparadorXXX.tsx` (três X em `stroke="currentColor"`, cor fixa `text-verde-limao`). Todos os três SVGs levam `aria-hidden="true"` e `focusable="false"`, coberto por teste em `tests/components/decor.test.tsx`.

A diferença entre `Circulo` (fill fixo via variável CSS) e `Blob`/`SeparadorXXX` (`currentColor`) não é técnica — dá para usar classe Tailwind de cor num `fill` de SVG, e o `SeparadorXXX` já faz exatamente isso (`className="text-verde-limao"` + `stroke="currentColor"`). É desenho de API: `Circulo` recebe `cor` como prop obrigatória e por isso define sua própria cor; `Blob` e `SeparadorXXX` não têm prop de cor e herdam do contexto via `currentColor`, deixando o consumidor decidir.

A grade pontilhada do folder impresso, já cortada do escopo (ver decisão acima), não foi reintroduzida — confirmado que nenhum destes três componentes a implementa.

Nenhum componente de seção consome as primitivas ainda; isso é escopo da Task 5+. `npm test` (9 testes) e `npm run build` passam.

## 2026-08-08 — Task 5 concluída: primitivas de interface (Trilha, Capítulo, Chip, Acordeão)

`components/ui/Trilha.tsx` (o tronco — linha vertical em limão via pseudo-elemento absoluto, conteúdo recuado à direita dela), `components/ui/Capitulo.tsx` (`<section id>` com âncora própria, nó redondo em limão sobre a linha, rótulo em creme, `<h2>` em limão `text-2xl`/`md:text-3xl`), `components/ui/Chip.tsx` (`<li>` com contorno creme translúcido) e `components/ui/Acordeao.tsx` (primeiro client component do projeto — `'use client'`, um item aberto por vez, `aria-expanded`/`aria-controls`, abre por clique e por Enter/Espaço via `<button>` nativo).

Implementação seguiu o brief da task verbatim (código já especificado em `.superpowers/sdd/task-5-brief.md`), TDD: testes escritos primeiro (`tests/components/trilha.test.tsx`, `tests/components/acordeao.test.tsx`), rodados e vistos falhando por módulo ausente, depois os quatro componentes criados e os 9 testes (mais os 10 já existentes, 19 no total) passando.

Regra de contraste (ver entrada acima) mantida à risca: o rótulo do capítulo é `text-creme`, não `text-verde-limao` — travado por teste dedicado que checa `className` diretamente, não só o texto renderizado.

Verificado o acoplamento entre `Trilha` e `Capitulo` que o offset da linha e o offset do nó precisam bater: convertendo as classes Tailwind em rem, a linha fica a 1,6rem (mobile) / 2,6rem (`md:`) da borda esquerda do contêiner da `Trilha`, e o nó do capítulo (`h-3 w-3`, ou seja, 0,75rem de diâmetro) fica com a borda esquerda a 1,5rem / 2,5rem da mesma referência — a linha passa dentro do nó em ambos os breakpoints (não fica centralizada no meio do nó, passa ligeiramente à esquerda do centro, ~0,275rem de diferença, mas nunca flutua fora dele). Não tentei "melhorar" esse offset porque o brief pediu os valores verbatim e o objetivo era não quebrar o acoplamento, não otimizá-lo. Não consegui abrir o dev server no navegador da sessão para conferir visualmente em pixel (a porta de preview da ferramenta ficou presa em 8787, ocupada por outro processo, independente da config de porta do projeto) — a verificação ficou só na aritmética das classes Tailwind. Sinalizado como pendência de conferência visual manual para o Rafael ou para uma sessão futura com navegador disponível.

`npm test` (19 testes, 6 arquivos) e `npm run build` passam. Nada fora de `components/ui/` e `tests/components/` foi alterado no commit de código.

## 2026-08-08 — Correção de revisão da Task 5: painel do Acordeão nunca é desmontado

Revisão de código encontrou dois achados na Task 5:

1. **Linha da Trilha tangenciava o nó em vez de atravessar o centro.** A aritmética registrada na entrada anterior estava certa (a linha caía *dentro* do nó), mas ~0,275rem fora do centro geométrico — visualmente encostada na borda esquerda do ponto, não cruzando por dentro dele. Corrigido: `left-[1.6rem]`/`md:left-[2.6rem]` → `left-[1.875rem]`/`md:left-[2.875rem]`, que é exatamente o centro do nó do `Capitulo` (não tocado) nos dois breakpoints.

2. **`Acordeao.tsx` desmontava o painel fechado (`{estaAberto && (...)}`) — decisão errada, e a regra fica valendo para qualquer componente futuro que esconda conteúdo.** O motivo não é estético, é de objetivo do site: o credo é o texto institucional mais importante da página, e ele é renderizado dentro de um item do Acordeão. Como o estado inicial é "tudo fechado", um componente que desmonta o painel fechado faz o rastreador do Google — que executa JavaScript mas não clica em acordeões — nunca ver esse texto. Site que existe em boa parte para ser achado no Google não pode esconder o próprio credo dele. Efeito colateral do mesmo bug: `aria-controls` do botão apontava para um `id` ausente do DOM durante toda a vida "fechada" do componente (a maior parte do tempo).

   **Correção, e regra geral para o projeto:** conteúdo que precisa existir para SEO/acessibilidade mas começa visualmente oculto usa o atributo HTML nativo `hidden` (`hidden={!estaAberto}`), nunca renderização condicional (`{cond && <div>}`) nem `display:none` via classe Tailwind sozinha — `hidden` tira da árvore de acessibilidade e da tela mas mantém no HTML enviado/executado. Cuidado: uma classe de `display` do Tailwind (`block`, `flex` etc.) no mesmo elemento tem precedência sobre `hidden` nativo e o anula; o painel do Acordeão não recebe classe de display, só `pb-8` (padding), então não há conflito. Verificado com teste (`toBeVisible`/`not.toBeVisible`, que respeita o atributo `hidden`), não só leitura de código.

   Testes ajustados: as três asserções que afirmavam `queryByText(...).not.toBeInTheDocument()` para conteúdo fechado ficaram falsas por design após a correção (o conteúdo passou a estar sempre no documento) — trocadas por `toBeVisible`/`not.toBeVisible`, com uma asserção explícita nova de que o conteúdo fechado continua presente no DOM (é essa a garantia de SEO sendo comprada; precisa de teste que trave, senão alguém desfaz sem perceber). Adicionada cobertura da tecla Espaço, que faltava ao lado de Enter no contrato de teclado.

`npm test -- tests/components/acordeao.test.tsx tests/components/trilha.test.tsx` (10 testes), `npm test` completo (20 testes, 6 arquivos) e `npm run build` passam.
