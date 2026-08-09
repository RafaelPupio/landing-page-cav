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

## 2026-08-08 — Task 6 concluída: Hero e faixa de Ações Rápidas

`components/sections/Hero.tsx` (`<section id="inicio">`, `Blob` variante 2 decorativo no canto superior direito, `h1` único da página, subtítulo, CTA de âncora) e `components/sections/AcoesRapidas.tsx` (`<nav aria-label="Ações rápidas">` com grade de links — 2 colunas no mobile, 4 no `md:` — um por ação do `content/site.json`: Como chegar, Domingos 18h, Instagram, YouTube, cada um com ícone SVG inline via `currentColor`).

Por que essa faixa importa mais do que a posição sugere: quase todo o tráfego vem do link na bio do Instagram, no celular, e a decisão de ficar ou sair acontece em segundos — as quatro ações precisam estar visíveis sem rolagem. Implementação seguiu o brief da task verbatim (`.superpowers/sdd/task-6-brief.md`), TDD: teste escrito primeiro (`tests/components/hero.test.tsx`), rodado e visto falhando por módulo ausente, depois os dois componentes criados e os 6 testes (26 no total do projeto) passando.

Regra de contraste (limão `#A3C63C` sobre verde escuro `#44581A` mede 4,02:1 — passa AA só para texto grande ≥24px/3:1, reprova texto normal 4,5:1) aplicada em dois lugares distintos aqui, ambos travados por teste:

1. **CTA primário**: fundo creme + texto verde escuro (7,24:1), não fundo limão — fundo limão com o texto de 16px do botão reprovaria. Testado diretamente via `className` (`bg-creme` e `text-verde-escuro`), não só via captura de texto.
2. **Subtítulo do Hero**: carrega duas classes de cor propositalmente — `text-creme md:text-verde-limao`. Em telas pequenas o subtítulo é 18px (limite 4,5:1, limão reprovaria); a partir de `md:` vira 24px (limite cai para 3:1, limão passa). Não simplificado para uma cor só.

Links externos (`href` começando com `http`) recebem `target="_blank"` e `rel="noopener noreferrer"`; links internos de âncora (`#visita`) não recebem `target` — comportamento determinado dinamicamente por `acao.href.startsWith('http')`, coberto por teste para os dois casos.

Nada além de `components/sections/` e `tests/components/` foi tocado no commit de código; `app/page.tsx` continua fora do escopo desta task — `Hero` e `AcoesRapidas` ainda não são consumidos por nenhuma página (ver [[status]]).

`npm test` (26 testes, 7 arquivos) e `npm run build` passam.

## 2026-08-08 — Correção de revisão da Task 6: contraste do subtítulo sem teste e link externo por heurística frágil

Revisão de código encontrou dois achados na Task 6:

1. **O subtítulo do Hero dependia de duas classes de cor (`text-creme md:text-verde-limao`) para não reprovar contraste AA, mas nenhum teste travava isso.** Em texto pequeno (18px, tamanho mobile) o limite AA é 4,5:1 e o limão (`#A3C63C`, 4,02:1 sobre o verde-escuro `#44581A`) reprova; só a partir do `md:` (24px) o limite cai para 3:1 e o limão passa. Se alguém simplificasse para uma cor só, o texto ficaria ilegível no celular — de onde vem quase todo o tráfego — sem que a suíte acusasse nada.

   **Correção:** teste novo em `tests/components/hero.test.tsx` que verifica `text-creme` e `md:text-verde-limao` presentes e `text-verde-limao` (sem prefixo) ausente. Confirmado na prática, não só por leitura de código: o componente foi quebrado de propósito (trocado para `text-verde-limao md:text-2xl` sozinho), o teste rodou e falhou (`expected [ Array(6) ] to include 'text-creme'`), depois desfeito.

2. **`AcoesRapidas` decidia link externo com `acao.href.startsWith('http')`** — heurística que casaria por acidente com algo como `"httpfoo"`, e que não distingue uma URL absoluta do próprio site de uma de terceiro.

   **Correção, e convenção nova para o projeto:** a regra virou regex explícita `^https?://` em `components/sections/AcoesRapidas.tsx`. Mais importante, `content/schema.ts` agora valida o formato de `href` em `acoesRapidas` — só aceita âncora interna (`#ancora`), caminho interno (`/caminho`), URL absoluta (`http://`/`https://`), `mailto:` ou `tel:`; qualquer outra coisa quebra o build com mensagem em português explicando os formatos aceitos (quem edita o `content/site.json` é alguém da igreja, não um programador).

   **Convenção documentada no próprio schema (comentário):** link interno em `acoesRapidas` se escreve sempre como `#ancora` ou `/caminho`, nunca com o domínio completo (ex.: nunca `https://arvoredavidalrv.com.br/algo`) — um link do próprio site escrito como URL absoluta é classificado como externo e abre numa aba nova por engano; a regex por si só não resolve isso (não sabe qual é "o próprio domínio"), então a prevenção é essa convenção de conteúdo, não lógica de código.

   Testes adicionados: `mailto:`, `tel:` e caminho relativo (`/contato`) não recebem `target="_blank"`; URL `https://` de terceiro recebe; e um teste de schema mostrando que `href` fora do formato aceito (`"httpfoo"`) é rejeitado.

`npm test -- tests/components/hero.test.tsx tests/content/schema.test.ts` (15 testes), `npm test` completo (30 testes, 7 arquivos) e `npm run build` passam.

## 2026-08-08 — Task 7 concluída: capítulos de História e Liderança

`components/sections/Historia.tsx` e `components/sections/Lideranca.tsx` — os dois capítulos mais simples da trilha, só texto. Ambos delegam inteiramente a estrutura (`<section id>`, nó da trilha, rótulo em creme, `<h2>` em limão) ao `Capitulo` (Task 5); o componente da task só entra com o conteúdo interno via `children` e as props `id`/`rotulo`/`titulo` vindas de `site.historia`/`site.lideranca` (tipadas com `Site['historia']`/`Site['lideranca']` de `content/schema.ts`). `Historia` mapeia `paragrafos` para um `<p>` por item dentro de um `div` com `space-y-5`; `Lideranca` renderiza `texto` num único `<p>`. Nenhum texto hardcoded — tudo vem de `content/site.json` via props.

Antes de escrever o teste, conferido contra o `Capitulo.tsx` real (não assumido no escuro) que o rótulo também é renderizado como `<p>` — por isso o teste que conta `section#historia p` espera 4 (3 parágrafos de conteúdo + 1 do rótulo), não 3. Contagem bateu: implementação seguiu o brief verbatim (`.superpowers/sdd/task-7-brief.md`), TDD — teste escrito primeiro (`tests/components/textos.test.tsx`), rodado e visto falhando por módulo ausente (`Failed to resolve import "@/components/sections/Historia"`), depois os dois componentes criados e os 3 testes passando.

Texto de corpo em ambos os componentes usa `text-creme/90` (creme mede 7,24:1 sobre o verde escuro, passa AA em qualquer tamanho) — nenhum limão introduzido em parágrafo, conforme a regra de contraste do projeto (limão mede 4,02:1, reprova AA abaixo de 24px).

Nada além de `components/sections/` e `tests/components/` foi tocado; `app/page.tsx` continua fora do escopo desta task — `Historia` e `Lideranca` ainda não são consumidos por nenhuma página (ver [[status]]).

`npm test -- tests/components/textos.test.tsx` (3 testes), `npm test` completo (33 testes, 8 arquivos) e `npm run build` passam.

## 2026-08-08 — Correção de revisão da Task 7: teste da Historia acoplado à estrutura interna do Capitulo

Revisão de código encontrou um achado (Important) em `tests/components/textos.test.tsx`: o teste "renderiza um parágrafo por item" contava `section#historia p` e esperava 4 (3 parágrafos de conteúdo + 1 do rótulo), porque o `Capitulo` (Task 5) hoje renderiza o rótulo como `<p>`. Problema: se o `Capitulo` trocasse o rótulo para `<span>` — mudança plausível e legítima, e fora do escopo da `Historia` — o teste quebraria sem que a `Historia` tivesse regredido. Testava a estrutura do vizinho, não o componente sob teste.

**Regra geral adotada para o projeto: teste de seção (`Historia`, `Lideranca`, e as seis que vêm depois) não deve fazer suposição sobre como o `Capitulo` renderiza rótulo/título — nem contando elementos que pertencem à estrutura dele, nem qualquer outra premissa sobre sua marcação interna.** O que importa é provar que a prop chega ao DOM (nada hardcoded), não replicar a marcação do `Capitulo`.

**Correção:** trocada a contagem por asserção de conteúdo — itera `HISTORIA.paragrafos` e confere que cada texto está no documento via `screen.getByText`. Teste renomeado para "renderiza cada parágrafo da prop no documento".

Confirmado na prática, não só por leitura de código: `Historia.tsx` foi quebrado de propósito (`paragrafos.slice(0, 1)` em vez de mapear todos), o teste rodou e falhou (`Unable to find an element with the text: Segundo.`), depois desfeito e a suíte voltou a passar.

Varredura pelo resto da suíte por acoplamento semelhante (teste que conta elemento pertencente a componente diferente do que está sob teste): nenhum outro caso encontrado. `hero.test.tsx` conta `getAllByRole('link')` dentro do próprio `AcoesRapidas` (elementos que ele mesmo renderiza, não de um vizinho). `decor.test.tsx` conta `svg` de três primitivas decorativas renderizadas juntas de propósito no mesmo teste — todas sob teste, nenhuma é vizinho de outra. `trilha.test.tsx` testa `Trilha` e `Capitulo` juntos intencionalmente (ambos são o alvo da suíte, não um vizinho incidental).

`npm test -- tests/components/textos.test.tsx` (3 testes), `npm test` completo (33 testes, 8 arquivos) e `npm run build` passam.

## 2026-08-08 — Task 8 concluída: capítulo de Propósito (missão, visão, valores)

`components/sections/Proposito.tsx` — um único capítulo com três blocos internos dentro de `Capitulo` (Task 5): a missão em destaque (`<p>` em creme, `text-lg`/`md:text-xl`), a visão como `<ol>` de verdade (é uma sequência de compromissos, não uma ordem arbitrária — cada item um `<li>` com borda inferior) e os valores como `<ul>` de `Chip` (Task 5, cada `Chip` já é um `<li>` com contorno creme). Título de cada bloco (`visaoTitulo`, `valoresTitulo`) é um `<h3>` — texto pequeno (`text-sm`), por isso em creme, nunca limão, conforme a regra de contraste do projeto (limão mede 4,02:1 sobre o verde escuro, reprova AA abaixo de 24px; creme mede 7,24:1). Nenhum texto hardcoded — `missao`, `visaoTitulo`, `visao`, `valoresTitulo`, `valores` todos vêm de `site.proposito` via prop tipada `Site['proposito']`.

Antes de escrever o teste, conferido contra `Capitulo.tsx` e `Chip.tsx` reais (não assumido no escuro) que nenhum dos dois produz `<li>` fora do que o próprio `Proposito` renderiza: o rótulo do `Capitulo` é um `<p>`, não item de lista, e o único `<li>` que o `Chip` produz é o próprio chip. Por isso o teste que conta `getAllByRole('listitem')` para 2 itens de visão + 3 valores do fixture espera 5, sem depender de nada que pertença ao `Capitulo` — consistente com a convenção fixada na Task 7 (teste de seção não deve supor a marcação interna de um componente vizinho).

Implementação seguiu o brief da task verbatim (`.superpowers/sdd/task-8-brief.md`), TDD: teste escrito primeiro (`tests/components/proposito.test.tsx`), rodado e visto falhando por módulo ausente (`Failed to resolve import "@/components/sections/Proposito"`), depois o componente criado e os 4 testes passando.

Nada além de `components/sections/` e `tests/components/` foi tocado; `app/page.tsx` continua fora do escopo desta task — `Proposito` ainda não é consumido por nenhuma página (ver [[status]]).

`npm test -- tests/components/proposito.test.tsx` (4 testes), `npm test` completo (37 testes, 9 arquivos) e `npm run build` passam.

---

## 2026-08-08 — Correção de revisão da Task 8: teste de ordem/conteúdo, visão vira `<ul>`, `key={i}`

Revisão de código encontrou três achados em `components/sections/Proposito.tsx` e `tests/components/proposito.test.tsx`.

**Achado 1 (Important) — teste não travava ordem nem conteúdo.** `getAllByRole('listitem')` só contava 5, então um bug que embaralhasse a ordem da visão (ou trocasse um item por outro de mesmo total) passaria despercebido. Corrigido: a asserção agora mapeia `textContent` de cada `listitem` e compara com `[...PROPOSITO.visao, ...PROPOSITO.valores]` via `toEqual`, travando texto e ordem. Confirmado na prática, não só por leitura: a ordem da visão foi invertida de propósito no componente (`[...proposito.visao].reverse()`), o teste rodou e falhou (`AssertionError: expected [ 'Pregar a Cristo', …(4) ] to deeply equal [ 'Amar a Deus', …(4) ]`), depois desfeito e a suíte voltou a passar.

**Achado 2 (decisão de conteúdo) — visão trocada de `<ol>` para `<ul>`.** A entrada da Task 8 acima registrou a visão como `<ol>` sob a premissa de que é "uma sequência de compromissos, não uma ordem arbitrária" — mas essa premissa nunca foi confirmada com a liderança da igreja. `<ol>` afirma ao leitor de tela que a ordem carrega informação ("item 1 de 5", "item 2 de 5"); para os cinco itens (Amar a Deus, Pregar a Cristo, Servir a todos, Andar em unidade, Manifestar o Reino) isso é uma hierarquia não confirmada, e afirmar uma hierarquia inexistente é pior que não afirmar nada. Trocado para `<ul>`; visualmente idêntico (a lista não tem marcadores no design). O teste de ordem do Achado 1 continua válido — a ordem do conteúdo continua sendo a do JSON, só deixamos de declarar ao leitor de tela que ela é semanticamente significativa.

**Pendência de confirmação com o Rafael:** se a liderança da igreja confirmar que a ordem dos cinco itens da visão é intencional (ex.: progressão teológica deliberada), reverter para `<ol>`.

**Achado 3 (Minor) — `key={item}` trocado por `key={i}`.** Divergia do padrão já fixado em `Historia.tsx` (Task 7) para o mesmo caso (array de strings estático vindo do JSON), e o schema não impede duplicatas em `visao`/`valores`. Corrigido nas duas listas (`visao` e `valores`).

`npm test -- tests/components/proposito.test.tsx` (4 testes), `npm test` completo (37 testes, 9 arquivos) e `npm run build` passam.

---

## 2026-08-08 — Task 9 concluída: capítulo de Cuidado (Conectar, Crescer, Servir)

`components/sections/Cuidado.tsx` — intro em destaque (`<p>` creme) seguida dos três pilares (`site.cuidado.pilares`, schema exige exatamente 3), cada um num cartão (`rounded-2xl border border-creme/25`) com `<h3>` para o nome do pilar, dentro de `Capitulo` (Task 5). Nenhum texto hardcoded — `intro`, `pilares[].nome`, `pilares[].subtitulo`, `pilares[].texto` todos vêm de `Site['cuidado']`.

Este é o primeiro capítulo cujo schema tem um campo opcional por item de lista: `pilar.subtitulo` é string, mas só "Conectar" tem valor real ("Grupos de Conexão") — "Crescer" e "Servir" têm string vazia. Aplicada a regra de degradação já estabelecida no projeto (campo vazio não renderiza elemento vazio): o `<p>` do subtítulo só é renderizado quando `pilar.subtitulo` é truthy, e carrega o atributo `data-subtitulo` — não para estilo, só para o teste poder contar quantos subtítulos existem (`container.querySelectorAll('[data-subtitulo]')`) sem depender do texto específico, seguindo o brief verbatim.

Seguindo a convenção fixada na Task 8 (teste de lista deve travar conteúdo e ordem, não só contagem), o teste principal usa `getAllByRole('heading', { level: 3 }).map(h => h.textContent)` comparado via `toEqual(['Conectar', 'Crescer', 'Servir'])` — já é sensível à ordem por construção do `toEqual` sobre array. Confirmado na prática, não só por leitura: temporariamente troquei `cuidado.pilares.map(...)` por `[...cuidado.pilares].reverse().map(...)`, rodei a suíte e vi a falha esperada (`expected [ 'Servir', 'Crescer', 'Conectar' ] to deeply equal [ 'Conectar', 'Crescer', 'Servir' ]`), depois desfiz a mutação e a suíte voltou a passar (confirmado por `git diff --stat` vazio no arquivo do componente).

`key={i}` foi usado para o `.map()` dos pilares, seguindo a convenção já fixada em `Historia.tsx`/`Proposito.tsx` para arrays estáticos vindos do JSON. O brief da task (`.superpowers/sdd/task-9-brief.md`) trazia `key={pilar.nome}` no código de exemplo — implementado assim no primeiro commit — mas isso divergia do padrão do projeto, então foi corrigido para `key={i}` num commit seguinte antes de declarar a task pronta.

Implementação seguiu o brief da task verbatim (`.superpowers/sdd/task-9-brief.md`), TDD: teste escrito primeiro (`tests/components/cuidado.test.tsx`), rodado e visto falhando por módulo ausente (`Failed to resolve import "@/components/sections/Cuidado"`), depois o componente criado e os 3 testes passando.

Nada além de `components/sections/` e `tests/components/` foi tocado; `app/page.tsx` continua fora do escopo desta task — `Cuidado` ainda não é consumido por nenhuma página (ver [[status]]).

`npm test -- tests/components/cuidado.test.tsx` (3 testes), `npm test` completo (40 testes, 10 arquivos) e `npm run build` passam.

---

## 2026-08-08 — Correção de revisão da Task 9: texto de cada pilar travado ao seu nome, subtítulo `text-creme/90`

Revisão de código encontrou dois achados em `components/sections/Cuidado.tsx` e `tests/components/cuidado.test.tsx`.

**Achado 1 (Important) — teste não travava a correspondência entre pilar e texto.** Os três testes existentes verificavam a ordem dos nomes e a presença do subtítulo, mas nenhum tocava `pilar.texto`. O revisor provou o buraco: trocando o texto de cada pilar pelo do pilar seguinte (mantendo nomes e ordem intactos), os três testes continuavam passando. Corrigido com um quarto teste que, para cada pilar, localiza o `<h3>` pelo nome (`getByRole('heading', { level: 3, name: pilar.nome })`), sobe até o cartão (`heading.closest('div')`) e verifica que o texto daquele pilar está *dentro* desse cartão (`toHaveTextContent(pilar.texto)`) — travando a correspondência nome↔texto, não só a presença de cada string em algum lugar da página. Confirmado na prática: reproduzi a mutação do revisor (na renderização, cada pilar passou a mostrar `cuidado.pilares[(i + 1) % length].texto`, rotacionando os textos mantendo nomes e ordem), rodei `npm test -- tests/components/cuidado.test.tsx` e vi o novo teste falhar (`Expected element to have text content: Texto conectar. / Received: ConectarGrupos de ConexãoTexto crescer.`) enquanto os três testes antigos continuaram verdes — confirma que só o novo teste fecha o buraco. Desfiz a mutação e confirmei por `git diff` que o componente voltou exatamente ao texto committado antes de rodar a suíte completa de novo.

**Achado 2 (Important) — `text-creme/70` no subtítulo reprovava AA.** Creme a 70% de opacidade sobre o fundo verde escuro dá 4,497:1 de contraste — abaixo do mínimo de 4,5:1 exigido pelo AA para texto normal. O subtítulo é `text-xs` (12px) semibold, que não se qualifica como "texto grande" (limiar 3:1 só valeria a partir de 24px normal ou 18,66px bold), então o limiar aplicável é mesmo 4,5:1. Trocado para `text-creme/90` (6,23:1), alinhando com o resto do projeto — todo texto secundário em `Historia.tsx`, `Lideranca.tsx` e no próprio `Cuidado.tsx` (intro e corpo dos pilares) já usa `/90` ou creme sólido. Busquei `text-creme/70` em todo `components/` e ele só existia neste único lugar (não havia outra ocorrência em texto nem em borda para corrigir).

**Piso de opacidade para texto creme sobre o fundo verde escuro (regra para qualquer componente futuro): `/90` é o mínimo seguro (6,23:1, passa AA até em texto pequeno); `/70` reprova AA (4,497:1, abaixo de 4,5:1). Não usar `text-creme/70` (nem opacidades menores) em texto — só em elementos não textuais como bordas.**

`npm test -- tests/components/cuidado.test.tsx` (4 testes), `npm test` completo (41 testes, 10 arquivos) e `npm run build` passam.

## 2026-08-08 — Task 10 concluída: capítulo do Credo, 20 declarações em 6 grupos por acordeão

`components/sections/Credo.tsx` — intro em destaque seguida dos 6 grupos de `site.credo.grupos` (`escrituras`, `trindade`, `salvacao`, `familia`, `igreja`, `ultimas-coisas`, somando 20 declarações), dentro de `Capitulo` (Task 5). Cada grupo é convertido num `ItemAcordeao` (`{ id, titulo: grupo.nome, conteudo }`) e passado para `Acordeao` (Task 5) como array de um único item, envolvido por uma `<div id="credo-<grupo.id>">` — a âncora por grupo é responsabilidade do `Credo`, não do `Acordeao`, para manter o acordeão genérico e reutilizável. Custo aceito: grupos vizinhos não se fecham entre si (cada `Acordeao` tem seu próprio estado `aberto`). Dentro de cada declaração, o `<h4>` do título é creme (`text-creme`) e não limão — em `text-sm` (14px, abaixo do limiar de 18,66px bold/24px normal para "texto grande") o limão mediria 4,02:1 e reprovaria AA; o único limão desta seção é o `+`/`−` decorativo do próprio `Acordeao`, que já é 24px. O corpo de cada declaração segue o piso de opacidade fixado na Task 9 (`text-creme/90`, 6,23:1).

Ponto que motivou nota separada no brief: o `Acordeao` (corrigido na Task 5) mantém o painel sempre montado no DOM, escondido via atributo HTML `hidden` — nunca desmontagem condicional — porque o rastreador do Google executa JavaScript mas não clica em acordeões, e o credo é o texto institucional mais importante da página. Confirmado na prática, não só por leitura do código: o teste "mantém as declarações fechadas até o clique, mas presentes no DOM" usa `getByText(...).toBeInTheDocument()` com o painel fechado (prova que o nó existe no DOM) seguido de `.not.toBeVisible()` (prova que está oculto), depois clica no gatilho e reafirma `.toBeVisible()` para as duas declarações daquele grupo — rodei a suíte com essa asserção e ela passa contra a implementação atual do `Acordeao`, que usa `hidden={!estaAberto}` em vez de renderização condicional.

Implementação seguiu o brief da task verbatim (`.superpowers/sdd/task-10-brief.md`), TDD: teste escrito primeiro (`tests/components/credo.test.tsx`, 4 testes), rodado e visto falhando por módulo ausente (`Failed to resolve import "@/components/sections/Credo"`), depois o componente criado e os 4 testes passando sem nenhum ajuste adicional em relação ao código do brief.

Nada além de `components/sections/` e `tests/components/` foi tocado; `app/page.tsx` continua fora do escopo desta task — `Credo` ainda não é consumido por nenhuma página (ver [[status]]).

`npm test -- tests/components/credo.test.tsx` (4 testes), `npm test` completo (45 testes, 11 arquivos) e `npm run build` passam.
