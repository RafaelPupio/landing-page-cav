# Decisões

Append-only. Cada entrada: o que foi decidido, e por quê. Nunca reescrever uma entrada antiga — se uma decisão for revertida, escrever uma entrada nova dizendo isso.

---

## 2026-08-08 — Objetivo duplo: visitante novo + credo completo

Rafael escolheu os dois objetivos, não um. Resolvido em [[projeto/objetivo]]: a página abre como convite e o credo vive em seção própria com acordeão, para que um não sabote o outro.

## 2026-08-08 — Stack: Next.js 15 + Tailwind v4

Rafael escolheu, contra a recomendação inicial de HTML estático puro. A recomendação era pela facilidade de manutenção por alguém da igreja. Ele preferiu Next.js — decisão dele, e defensável: o projeto pode crescer (agenda, blog) e ele já lida com ferramenta técnica em outro projeto. A camada de edição em `/editar` compensa a perda de simplicidade.

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

## 2026-08-08 — Correção de revisão da Task 10: texto de cada declaração travado ao seu título, id de grupo de credo travado como único

Revisão de código encontrou três achados em `components/sections/Credo.tsx`, `tests/components/credo.test.tsx` e `content/schema.ts`.

**Achado 1 (Important) — teste não travava a correspondência entre a declaração e o seu texto.** Os quatro testes existentes verificavam âncoras, visibilidade oculta-mas-presente e o `<h4>` de uma única declaração aberta, mas nenhum comparava o texto de cada declaração ao seu próprio título através das 20 declarações reais. O revisor provou o buraco rotacionando os textos dentro de cada grupo (sob o título "Deus" passou a aparecer o texto de "Jesus Cristo", mantendo títulos e ordem) e os quatro testes continuaram verdes. Isso pesa mais aqui do que em qualquer outra seção: são 20 declarações doutrinárias transcritas à mão do folder impresso, e a igreja trata esse texto como sagrado (regra 1 do brain) — atribuir a declaração errada ao título errado é pior que um bug visual. Corrigido com o mesmo padrão que já fechou esse buraco na Task 9 (`cuidado.test.tsx`): um novo teste que, para cada grupo e cada declaração do fixture, localiza o `<h4>` pelo título (`getByRole('heading', { level: 4, name: declaracao.titulo, hidden: true })` — `hidden: true` foi necessário aqui porque, diferente do `Cuidado`, o `<h4>` do `Credo` vive dentro do painel do acordeão, que começa fechado e fica fora da árvore de acessibilidade padrão até o clique), sobe até o bloco da declaração (`heading.closest('div')`) e verifica que o texto daquela declaração está *dentro* desse bloco (`toHaveTextContent(declaracao.texto)`). Confirmado na prática: reproduzi a mutação do revisor (na renderização, cada declaração passou a mostrar `grupo.declaracoes[(i + 1) % grupo.declaracoes.length].texto`, rotacionando os textos dentro de cada grupo mantendo títulos e ordem), rodei `npm test -- tests/components/credo.test.tsx` e vi o novo teste falhar (`Expected element to have text content: CREMOS em um único Deus. / Received: DeusCREMOS no Senhor Jesus Cristo.`) enquanto os quatro testes antigos continuaram verdes. Desfiz a mutação e confirmei por `git diff` que o componente voltou exatamente ao texto committado antes de rodar a suíte completa de novo.

**Achado 2 (Minor) — `key={declaracao.titulo}` fugia da convenção do projeto.** O projeto fixou `key={i}` para arrays estáticos vindos do JSON (inclusive corrigindo o mesmo desvio na Task 9). Trocado para `key={i}` em `Credo.tsx`.

**Achado 3 (Minor, fechado agora) — `grupoCredoSchema` não impedia `id` de grupo duplicado.** Um `id` repetido em `credo.grupos` geraria `id` HTML duplicado em três lugares (`credo-<id>`, `gatilho-<id>`, `painel-<id>`) e quebraria silenciosamente o `aria-controls`/`aria-labelledby` do acordeão. Não é hipotético: a Task 14 vai entregar um editor de conteúdo que permite editar esse JSON pelo navegador, e a validação atual do schema é a única rede de segurança contra isso. Corrigido com `.refine` no array `grupos` de `credo` em `content/schema.ts`, comparando `new Set(grupos.map(g => g.id)).size` contra `grupos.length`. Mensagem de erro em português, escrita para quem vai realisticamente ler — alguém da igreja editando `site.json`, não um programador: nomeia o campo (`"id"`), dá exemplo de valor aceito e diz a ação concreta ("encontre os dois grupos... e troque um deles"). Teste novo em `tests/content/schema.test.ts` clona `content/site.json` real, copia o `id` do primeiro grupo de credo para o segundo, e confirma que `safeParse` falha.

Nada além de `components/sections/Credo.tsx`, `tests/components/credo.test.tsx`, `content/schema.ts` e `tests/content/schema.test.ts` foi tocado.

`npm test -- tests/components/credo.test.tsx tests/content/schema.test.ts` (12 testes), `npm test` completo (47 testes, 11 arquivos) e `npm run build` passam.

## 2026-08-08 — Task 11 concluída: Citação, capítulo de Visita (cartão creme invertido) e Rodapé

`components/sections/Citacao.tsx` — fora da trilha (não usa `Capitulo`), um `<blockquote>` centralizado em `text-2xl`/`md:text-4xl` limão em negrito. É o único lugar da página inteira onde o limão aparece em texto: abaixo de 24px (ou 18,66px em negrito) o limão mede 4,02:1 sobre o fundo verde escuro e reprova AA, mas a partir de 24px o limiar de "texto grande" cai para 3:1 e o limão passa. Não reduzir esse tamanho sem reabrir a conta de contraste.

`components/sections/Visita.tsx` — último capítulo da trilha, dentro de `Capitulo` (Task 5), mas o corpo é um cartão `bg-creme`/`text-grafite`: o único bloco claro da página inteira, invertendo o fundo escuro que domina o resto do layout. Intencional — marca visualmente o fim da jornada ("chegou, é aqui"). Dentro do cartão o contraste grafite `#1F1F1C` sobre creme `#F7F5EC` é altíssimo (sem risco de AA); o botão "Abrir no Google Maps" é a única inversão dentro da inversão (fundo verde escuro/texto creme dentro do cartão claro) — conferido à mão, 7,24:1, bem acima do piso.

Duas aplicações da regra de degradação do projeto (campo vazio não renderiza bloco vazio), ambas cobertas por teste em `tests/components/visita.test.tsx`:
- `contato.telefone === ''` → nenhum botão de telefone é renderizado (`{contato.telefone && (...)}`).
- `contato.mapaEmbedUrl === ''` → nenhum `<iframe>` (`{contato.mapaEmbedUrl && (...)}`), sobra só o link "Abrir no Google Maps" apontando para `contato.mapsUrl`.
Os dois casos batem com o `content/site.json` real de hoje: `contato.telefone` é `""` (telefone da igreja ainda não recebido, ver [[status]]), então o botão de telefone hoje não aparece na página — só `mapaEmbedUrl` já vem preenchido no JSON atual, então esse segundo caminho só foi exercitado pelo teste (fixture com `mapaEmbedUrl: ''`), não pelo conteúdo real.

`components/sections/Rodape.tsx` — também fora da trilha, `<footer>` com nome do site, texto opcional (`{texto && (...)}`, hoje vazio em `site.json`) e links de Instagram/YouTube, ambos `target="_blank" rel="noopener noreferrer"`. Texto secundário em `text-creme/80`: medido à mão em 5,32:1 sobre o fundo verde escuro, acima do piso de AA (4,5:1) mesmo sem chegar ao piso de `/90` fixado na Task 9 — mantido como no brief porque já passa, sem necessidade de subir a opacidade.

**Observação de inconsistência (não corrigida, por instrução explícita do brief a manter o código verbatim):** os rótulos "Abrir no Google Maps", "Telefone", "Instagram", "YouTube" e o `title="Mapa"` do iframe estão hardcoded em `Visita.tsx`/`Rodape.tsx`, quebrando a regra dura do projeto "nenhum texto hardcoded em componente — tudo passa por `content/site.json`" (`CLAUDE.md`, regra 2; `brain/INDEX.md`, regra dura 2). Nenhum desses cinco textos existe hoje em `content/site.json`/`content/schema.ts`. Fica registrado para uma limpeza futura (mover para o schema como rótulos de UI) caso o projeto quera fechar esse desvio.

Implementação seguiu `.superpowers/sdd/task-11-brief.md` verbatim, TDD: `tests/components/visita.test.tsx` (6 testes, cobrindo `Visita`, `Citacao` e `Rodape`) escrito primeiro, rodado e visto falhando por módulo ausente (`Failed to resolve import "@/components/sections/Citacao"`), depois os três componentes criados e os 6 testes passando sem nenhum ajuste em relação ao código do brief. Nada além de `components/sections/` e `tests/components/` foi tocado; `app/page.tsx` continua fora do escopo desta task — nenhuma das três seções é consumida por nenhuma página ainda (ver [[status]]).

`npm test -- tests/components/visita.test.tsx` (6 testes), `npm test` completo (53 testes, 12 arquivos) e `npm run build` passam.

## 2026-08-08 — Correção de revisão da Task 11: rótulos hardcoded, teste de horários, `key={i}`, privacidade do iframe, `/90` no rodapé

Revisão de código encontrou cinco achados em `components/sections/Visita.tsx`, `components/sections/Rodape.tsx`, `content/schema.ts`, `content/site.json` e `tests/components/visita.test.tsx` — todos herdados do brief da Task 11 e já registrados como preocupação no relatório daquela task.

**Achado 1 (Important) — cinco textos hardcoded, contra a regra dura "nenhum texto hardcoded em componente".** "Abrir no Google Maps", "Telefone" e `title="Mapa"` em `Visita.tsx`; "Instagram" e "YouTube" em `Rodape.tsx`. Movidos para `content/site.json`: `visita.ctaMapsTexto`, `visita.ctaTelefoneTexto`, `visita.mapaTitulo` (junto dos campos já existentes de `visita`) e `redes.instagramRotulo`, `redes.youtubeRotulo` (junto das URLs em `redes`, mesmo objeto). Campos correspondentes adicionados a `redesSchema` e ao objeto `visita` em `content/schema.ts`, todos `z.string().min(1)`. Os dois componentes passaram a ler esses valores via prop em vez de string literal. `aria-label="Ações rápidas"` em `AcoesRapidas.tsx` **não foi tocado** — é rótulo estrutural de acessibilidade, não texto de conteúdo, fora do escopo desta regra.

**Achado 2 (Important) — teste de horários não travava correspondência rótulo↔valor.** O fixture de `tests/components/visita.test.tsx` tinha um único horário, então `expect(screen.getByText('Domingos, 18h')).toBeInTheDocument()` só provava que o texto existia em algum lugar do documento, não que estava ao lado do `<dt>` "Culto" — a mesma classe de bug já fechada nas Tasks 9 (`cuidado.test.tsx`) e 10 (`credo.test.tsx`). Fixture ampliado para dois horários (`Culto`/`Domingos, 18h` e `Grupo de Conexão`/`Quartas, 20h`, este segundo fictício só para o teste — não existe ainda em `site.json` real, ver bloqueio "Horários de GCs" em [[status]]). Teste novo, no mesmo padrão das Tasks 9/10: para cada horário do fixture, localiza o `<dt>` pelo rótulo (`screen.getByText(`${horario.rotulo}:`)`), sobe até o bloco (`closest('div')`) e confere que o `quando` daquele horário está dentro do mesmo bloco (`toHaveTextContent`). Confirmado por mutação: troquei a renderização do `<dd>` em `Visita.tsx` para `horarios[(i + 1) % horarios.length].quando` (rotacionando os valores de `quando` entre os rótulos), rodei `npm test -- tests/components/visita.test.tsx` e vi o novo teste falhar (`Expected element to have text content: Domingos, 18h / Received: Culto:Quartas, 20h`) enquanto o teste antigo ("mostra endereço e horário") continuou passando — confirma que só o teste novo fecha o buraco. Desfiz a mutação e confirmei por `git diff --stat` que `Visita.tsx` voltou exatamente ao estado committado (só a mudança do Achado 3, `key={i}`) antes de rodar a suíte completa de novo.

**Achado 3 (Minor) — `key={horario.rotulo}` fugia da convenção `key={i}`.** Já fixada nas Tasks 8, 9 e 10 para arrays estáticos vindos do JSON. Corrigido em `Visita.tsx`.

**Achado 4 (privacidade) — `referrerPolicy="no-referrer-when-downgrade"` no iframe do mapa era a política menos restritiva ainda em uso, e vazava a URL completa da página ao Google.** Trocado para `referrerPolicy="no-referrer"`: o mapa continua funcionando, mas o Google deixa de saber de onde veio a requisição. **Decisão deliberada de privacidade, não descuido** — quem abre "Venha nos visitar" num site de igreja não espera disparar rastreamento de terceiro; não reverter para uma política mais permissiva sem essa mesma justificativa em mente. Teste novo trava o atributo (`iframe.toHaveAttribute('referrerPolicy', 'no-referrer')`).

**Achado 5 (consistência) — `text-creme/80` no texto secundário do rodapé.** Media 5,33:1 (a Task 11 havia calculado 5,32:1 à mão — diferença de arredondamento, mesma ordem de grandeza), passa AA (4,5:1) mas fica abaixo do piso `/90` (6,23:1) que o projeto adotou nas Tasks 9 e 10 para qualquer texto creme sobre o fundo verde escuro. Trocado para `text-creme/90` em `Rodape.tsx`, fechando a única exceção que restava a essa regra.

Nada além de `components/sections/Visita.tsx`, `components/sections/Rodape.tsx`, `content/schema.ts`, `content/site.json` e `tests/components/visita.test.tsx` foi tocado.

`npm test -- tests/components/visita.test.tsx tests/content/schema.test.ts` (15 testes), `npm test` completo (55 testes, 12 arquivos) e `npm run build` passam.

## 2026-08-08 — Task 12 concluída: `app/page.tsx` montado, a página existe pela primeira vez

`app/page.tsx` deixou de ser o placeholder do `create-next-app` e passou a montar a página real: `Hero` e `AcoesRapidas` fora da trilha, depois `Trilha` (Task 5) envolvendo os seis capítulos em ordem — `Historia`, `Proposito`, `Cuidado`, `Lideranca`, `Credo`, `Visita` —, e por fim `Citacao` e `Rodape` fora da trilha. Todas as props conferidas contra a assinatura real de cada componente (não só contra o brief) antes de escrever a montagem — nenhuma divergência encontrada, todas batem com `.superpowers/sdd/task-12-brief.md` verbatim.

Implementação seguiu TDD: `tests/pagina.test.tsx` escrito primeiro (h1 único, sete âncoras de seção, catorze valores do Propósito, ordem dos seis capítulos), rodado e visto falhar contra o placeholder (`3 failed, 1 passed`), depois `app/page.tsx` substituído e a suíte voltou a passar — com um ajuste no próprio teste, registrado abaixo.

**Colisão de conteúdo encontrada pelo teste, não hipotética — achado real da task.** O teste do brief buscava cada valor de `proposito.valores` com `getByText` (sem escopo) na página inteira; "Generosidade" é ao mesmo tempo um valor da Task 8 (`content/site.json`, lista de `proposito.valores`) **e** o título de uma declaração do Credo (grupo "Generosidade e últimas coisas", Task 10) — essa colisão existe no conteúdo desde a Task 2, mas só apareceu agora porque a Task 12 é a primeira vez que `Proposito` e `Credo` renderizam na mesma árvore. Como o `Acordeao` (correção de revisão da Task 5) nunca desmonta o painel fechado — só o esconde via `hidden`, de propósito, para o Google indexar o credo — o `<h4>` "Generosidade" do Credo está sempre no DOM, mesmo fechado, e colide com o `<li>` "Generosidade" do Propósito. `getByText('Generosidade')` sem escopo encontra os dois e falha (`Found multiple elements`). Corrigido escopando a asserção à seção `#proposito` com `within()` (`tests/pagina.test.tsx`), preservando a intenção do teste (provar que os 14 valores reais chegam ao DOM) sem depender de unicidade textual que o conteúdo real não garante. Não é bug de implementação nem do brief — é o tipo de achado que só a montagem completa revela; registrado aqui para não ser confundido com regressão numa análise futura.

**Verificação visual no navegador — feita de verdade, com ressalva de uma limitação de ferramenta.** Sem `.claude/launch.json` no repositório, a ferramenta de preview do navegador tentou uma porta fixa (8787) de outro projeto do usuário e falhou; criado `.claude/launch.json` (`npm run dev`, `autoPort: true`) e, como isso também não bastou neste ambiente, o dev server foi subido manualmente (`next dev --port 4173`) e o navegador apontado direto para `http://localhost:4173` via `preview_start({ url })`.

Confirmado com geometria exata (`getBoundingClientRect`, não só inspeção visual) que a linha da trilha passa pelo **centro** do nó dos seis capítulos em 375px e em 1280px — diferença de 0,5px (subpixel) entre o centro da linha e o centro de cada nó, nos dois breakpoints, para os seis capítulos. É a primeira confirmação real desse alinhamento — a Task 5 só tinha a aritmética das classes Tailwind, sem navegador disponível naquela sessão.

Confirmado em 375px que as quatro ações rápidas cabem sem rolagem: `nav[aria-label="Ações rápidas"]` termina em `y=609` contra um `window.innerHeight` de 812.

Confirmado com captura de tela real (mobile, 375px) que: o acordeão do Credo abre e fecha — cliquei em "Queda e salvação", o ícone trocou de `+` para `−` e o texto da declaração apareceu, com os outros cinco grupos continuando fechados; o cartão creme da Visita se destaca nitidamente do fundo verde escuro; o mapa embutido do Google carrega de fato (tile do bairro Parque das Emas visível na captura, mais confirmação por `performance.getEntriesByType('resource')` mostrando o recurso do iframe com `duration` de ~1,4s).

**Limitação da ferramenta, não do site:** no viewport de 1280×900, a captura de tela (`computer screenshot`) desta sessão retorna uma imagem sólida em branco (sem conteúdo) para qualquer posição de rolagem além de ~600–1000px — reproduzido de forma consistente, inclusive após recarregar a página e trocar o método de rolagem (JS `scrollTo`, `scroll_to` nativo por `ref`, navegação por âncora `#credo`). A 375px (mobile) a mesma rolagem profunda captura corretamente. Confirmado por várias vias que o problema é só de captura de imagem, não de renderização real: `document.elementFromPoint` encontrava o texto certo na posição certa, `getComputedStyle` mostrava opacidade/visibilidade normais, e o clique disparado via DOM (`btn.click()`) alterava `aria-expanded`/`hidden` do acordeão exatamente como esperado. Por isso o alinhamento da trilha em 1280px foi confirmado por geometria exata (acima) e por captura de tela do topo da página (que funciona), e o comportamento do acordeão/cartão/mapa foi confirmado por captura de tela real em 375px mais verificação funcional via DOM em 1280px — não por captura de tela profunda em 1280px, que esta sessão não conseguiu produzir. Sinalizado para não ser confundido com um problema do layout: a árvore de acessibilidade, o CSS computado e o comportamento de clique estavam todos corretos nas mesmas posições onde a captura de tela falhava.

`npm test -- tests/pagina.test.tsx` (4 testes), `npm test` completo (59 testes, 13 arquivos) e `npm run build` passam (`/` prerenderizada como conteúdo estático).

## 2026-08-09 — Task 13 concluída: SEO — metadados, JSON-LD `Church`, sitemap e robots

Implementado verbatim a partir de `.superpowers/sdd/task-13-brief.md`, em TDD: `tests/seo/jsonld.test.ts` escrito primeiro (6 testes), rodado e visto falhar (`Cannot find module '@/lib/jsonld'`), depois `lib/jsonld.ts` (`dadosDaIgreja`) e `components/seo/JsonLd.tsx` criados e a suíte voltou a passar.

**`lib/jsonld.ts` — `dadosDaIgreja(site: Site)`.** Monta um objeto JSON-LD `@type: "Church"` com `name`, `url`, `description`, `address` (`PostalAddress` completo — `logradouro`/`cidade`/`estado`/`addressCountry: "BR"`, mais `postalCode` só se `cep` não for vazio), `openingHoursSpecification` (um item por horário de `site.horarios`, mapeando `diaSemana`/`abre`/`fecha` para `dayOfWeek`/`opens`/`closes`) e `sameAs` (Instagram e YouTube). `geo`, `telephone` e `email` só entram no objeto quando os campos correspondentes de `site.contato` não são string vazia — no `site.json` real, `telefone`, `email`, `cep`, `latitude` e `longitude` ainda são `""` (dado desconhecido, ver [[status]]), então hoje o JSON-LD emitido não tem esses três campos. Objeto com `telephone: ""` seria pior que sem o campo — o teste "omite campos opcionais vazios" trava isso.

**`components/seo/JsonLd.tsx`** — componente de uma linha de propósito, injeta o objeto via `dangerouslySetInnerHTML` num `<script type="application/ld+json">`. Uso de `dangerouslySetInnerHTML` aqui é o padrão recomendado do Next.js para JSON-LD, não um risco de XSS: o conteúdo é sempre `JSON.stringify` de dados vindos de `content/site.json` (validado por Zod em `content/load.ts`), nunca texto livre de usuário — não há superfície de injeção de HTML.

**`app/layout.tsx`** — bloco `metadata` (que desde a Task 3 só tinha `title`/`description`) substituído por: `metadataBase` (a partir de `site.site.url`), `title` com `default`/`template` (título padrão inclui cidade/estado — "Comunidade Árvore da Vida — Lucas do Rio Verde/MT" —, páginas futuras herdam o sufixo via `%s — Comunidade Árvore da Vida`), `alternates.canonical: '/'`, Open Graph completo (`locale: 'pt_BR'`, obrigatório pela restrição de idioma do projeto) e Twitter Card (`summary_large_image`). `<JsonLd dados={dadosDaIgreja(site)} />` acrescentado dentro do `<body>`, antes de `{children}`, sem tocar no resto do arquivo (fonte Poppins e `variaveisDeTema` intactos).

**`app/sitemap.ts` e `app/robots.ts`** — ambos usando a API nativa de metadata do Next.js (`MetadataRoute.Sitemap`/`MetadataRoute.Robots`), sem dependência nova. O robots bloqueia `/editar` e `/api/` explicitamente mesmo essas rotas ainda não existindo (chegam na Task 14) e já retornando 404 em produção sem essa regra — decisão deliberada de cinto e suspensório: se um dia a rota de edição vazar para produção por engano, ela pelo menos não é anunciada a rastreadores bem-comportados.

**Verificação do HTML gerado, com adaptação de porta.** O brief pedia `npm run build && npm start` na porta 3000 e checar via `curl`; nesta máquina as portas 3000 e 8787 estavam ocupadas por outros processos do usuário, e `.claude/launch.json` já fixava a porta 4321 para este projeto (`autoPort: false`) — criado na Task 12. Havia um `next dev` deste mesmo projeto já rodando em 4321 (de sessão anterior); reaproveitado em vez de subir um novo processo. `curl -s http://localhost:4321/ | grep -c 'application/ld+json'` retornou `1`; o `<script type="application/ld+json">` no HTML contém exatamente os campos esperados, sem `telephone`/`geo`/`email` (conferido campo a campo contra o objeto real, não só a contagem). `curl -s http://localhost:4321/robots.txt` devolve `Allow: /`, `Disallow: /editar`, `Disallow: /api/` e a linha `Sitemap:`; `curl -s http://localhost:4321/sitemap.xml` devolve um `<urlset>` válido com a URL do site, `changefreq: monthly`, `priority: 1`. `npm run build` (rodado antes, separadamente) também lista `/robots.txt` e `/sitemap.xml` como rotas estáticas geradas (`○ (Static)`), confirmando que a mesma saída existe em build de produção, não só em dev.

Nada além de `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/seo/JsonLd.tsx`, `lib/jsonld.ts` e `tests/seo/jsonld.test.ts` foi tocado.

`npm test -- tests/seo/jsonld.test.ts` (6 testes), `npm test` completo (66 testes, 14 arquivos), `npm run lint`, `npx tsc --noEmit` e `npm run build` passam.

## 2026-08-09 — Correção de revisão da Task 13: escape de `</script>` no JSON-LD e `diaSemana` restrito a inglês

Dois achados "Important" da revisão da Task 13, ambos motivados pela Task 14 (editor de conteúdo no navegador): a partir dela, texto livre digitado por alguém da igreja passa a alimentar os mesmos campos.

**`components/seo/JsonLd.tsx` — quebra de tag.** `JSON.stringify` não escapa `"<"`; um campo de texto livre contendo `"</script>"` (ex.: `site.descricao`, `contato.logradouro`/`cidade`, `telefone`/`email`) fecharia a tag `<script>` antes da hora e o restante viraria HTML interpretado pelo navegador. Corrigido com `.replace(/</g, '\\u003c')` na serialização — forma recomendada pela documentação do Next.js para JSON-LD; o JSON continua válido porque essa sequência de escape e `"<"` são a mesma coisa para qualquer parser. Teste novo em `tests/seo/jsonld.test.tsx` (arquivo renomeado de `.ts` para `.tsx` — passou a usar JSX) renderiza `JsonLd` com um valor contendo `"</script><script>alert(1)</script>"` via `renderToStaticMarkup` (o mesmo caminho de SSR que o Next usa de verdade — `render` do Testing Library passaria pela API DOM `innerHTML`, que não reproduz o bug), confere que não sobra nenhum `"</script>"` dentro do conteúdo do script, e que o `JSON.parse` desse conteúdo devolve o valor original intacto. Confirmado que o teste pega o problema de verdade: revertido o `.replace`, o teste falhou (`AssertionError: … not to contain '</script>'`), reaplicado o `.replace`, voltou a passar.

**`content/schema.ts` — `diaSemana` aceitava qualquer string.** Trocado `z.string().min(1)` (com comentário não-normativo "formato schema.org, ex.: Sunday") por `z.enum(['Monday', ..., 'Sunday'])`, com mensagem de erro em português explicando que o valor precisa ser o nome do dia em inglês porque é o que o Google entende — sem isso, alguém digitando "Domingo" no editor da Task 14 faria o Google descartar o horário de culto em silêncio, justamente o dado que faz a busca mostrar horário de funcionamento no resultado. Teste novo em `tests/content/schema.test.ts` rejeita `"Domingo"` e trava que a mensagem menciona "inglês". Efeito colateral: `tests/components/visita.test.tsx` tinha um fixture `HORARIOS` cujo tipo era inferido como `{ diaSemana: string }[]`, incompatível com o novo enum — anotado com o tipo `Horario` importado de `content/schema.ts` (`npm run build` pegou isso no type-check, não os testes).

**Registro sem código.** `brain/status.md`, tabela de bloqueios, linha "Domínio": acrescentada a frase de que, desde a Task 13, esse domínio ainda não registrado já sai no HTML publicado (`metadataBase`/canonical, `og:url`, `url` do JSON-LD) — o bloqueio já existia, faltava dizer que o código o tornou visível.

`npm test -- tests/seo/jsonld.test.tsx tests/content/schema.test.ts` (15 testes), `npm test` completo (68 testes, 14 arquivos) e `npm run build` passam.

## 2026-08-09 — Task 14 concluída: editor visual restrito a desenvolvimento (última task do plano)

Implementado verbatim a partir de `.superpowers/sdd/task-14-brief.md`, em TDD: `tests/editor/rota.test.ts` escrito primeiro (4 testes: `GET`/`PUT` × produção/desenvolvimento), rodado e visto falhar (`Cannot find module '@/app/api/content/route'`), depois `app/api/content/route.ts`, `app/editar/page.tsx` e `components/editor/FormularioConteudo.tsx` criados e a suíte voltou a passar.

**`app/api/content/route.ts`** — `GET` devolve `content/site.json` bruto; `PUT` valida o corpo com `siteSchema.safeParse` e só grava (`writeFile`, `JSON.stringify(..., null, 2)`) se passar; se falhar, devolve 422 com `{ erros: string[] }` (um item por `issue` do Zod, `caminho — mensagem`). As duas rotas checam `process.env.NODE_ENV === 'production'` e devolvem 404 sem tocar em nada, antes de qualquer outra lógica — é a checagem mais importante do arquivo, e as duas rotas passam por ela antes de ler ou escrever qualquer coisa.

**`app/editar/page.tsx`** — `notFound()` (Next.js) se `NODE_ENV === 'production'`, redundante de propósito com o 404 da API: mesmo que alguém navegue direto para `/editar` em produção, a página em si já barra antes de tentar buscar conteúdo da API (que também barraria).

**`components/editor/FormularioConteudo.tsx`** — busca `/api/content` no mount, achata o JSON inteiro em pares `[caminho, valor]` (`visita.titulo`, `credo.grupos.0.nome`, `historia.paragrafos.2` etc.), um `<textarea>` por campo (`rows={5}` se o valor tiver mais de 120 caracteres). No submit, reconstrói o objeto a partir do `FormData` e faz `PUT`; se a API rejeitar, mostra `Erros: <lista separada por ' | '>` — a pessoa da igreja lê essa mensagem, não uma pilha de erro.

**Ajuste de ambiente no teste (Step 1 do brief).** O código do teste como escrito no brief — `Object.defineProperty(process.env, 'NODE_ENV', { value, configurable: true })` — lança `TypeError: 'process.env' only accepts a configurable, writable, and enumerable data descriptor` no Node 26 (versão instalada nesta máquina): o `process.env` do Node passou a exigir que o descriptor declare `writable: true` e `enumerable: true` explicitamente, não bastam os defaults. Corrigido acrescentando as duas propriedades ao descriptor nos dois pontos do teste. Não é mudança de comportamento, é compatibilidade — o teste continua verificando exatamente o que o brief pedia.

**`content/schema.ts` — `z.config(pt())` global.** O schema já tinha mensagens customizadas em pt-BR para `acoesRapidas[].href`, `diaSemana` e `id` de credo duplicado (Tasks 6/13), mas todo o resto (a maioria dos campos: `z.string().min(1)`, `z.string().url()`, tipo errado etc.) caía na mensagem padrão do Zod, em inglês técnico (`"Too small: expected string to have >=1 characters"`) — violava a restrição de idioma pt-BR do projeto e o requisito de que a mensagem de erro do `/editar` precisa ser legível pra quem não programa. Carregado o locale `pt` de `zod/locales` e aplicado com `z.config(pt())` antes de qualquer schema ser definido; mensagens customizadas (que usam `error: '...'` explícito) não são afetadas, só as que caem no mapa padrão. `zod` só é importado em `content/schema.ts` neste repo — sem efeito colateral em outro schema.

**Achado registrado, sem correção: risco do achatamento do formulário.** `FormularioConteudo` converte todo valor em string ao salvar (HTML `<textarea>`/`FormData` só carregam string). Verificado programaticamente que hoje **todo** valor-folha de `content/site.json` já é string (nenhum `z.number()`/`z.boolean()` existe no schema) — inofensivo agora. Mas se um campo numérico/booleano for adicionado no futuro, o formulário vai continuar oferecendo `<textarea>` pra ele; como o Zod (v4) não faz coerção de tipo, o `PUT` vai rejeitar o payload inteiro com 422 até o componente ganhar um input dedicado pra esse campo — trava a edição de *todos* os campos, não só do novo, porque o formulário salva o objeto inteiro de uma vez. Não é bug hoje; é um lembrete pra quem mexer no schema depois.

**Verificação manual real** (não simulada por `curl`/script sozinho): com `npm run dev` (`PORT=4321`, porta fixada em `.claude/launch.json` porque 3000/8787 estavam ocupadas nesta máquina), abri `/editar` no Browser pane de verdade, preenchi o campo `visita.texto` (clique real no textbox, digitação real) e cliquei no botão "Salvar" real da página. Confirmei por leitura direta do arquivo que `content/site.json` mudou (o texto digitado apareceu em `visita.texto`, formatado com `JSON.stringify(..., null, 2)`), e por leitura do HTML renderizado de `/` que a seção "Venha nos visitar" passou a mostrar o texto novo — sem restart do servidor. Desfiz a edição copiando de volta o backup tirado antes de qualquer alteração e confirmei com `git diff -- content/site.json` (zero linhas) e md5 idêntico ao original (`1baf6da39b79d551969b52801b7edbef`) que o arquivo voltou exatamente ao estado anterior. Depois, `npm run build && PORT=4321 npm start` e `curl` real contra o servidor de produção: `GET /editar` → 404, `GET /api/content` → 404, `PUT /api/content` → 404, `GET /` → 200 (site principal continua no ar). Ambos os servidores (dev e produção) foram derrubados ao fim de cada verificação.

Relatório completo (arquivos, decisões, saída literal de `npm test`/`npm run build`, detalhe da verificação manual) em `.superpowers/sdd/task-14-report.md` — não versionado, `.superpowers/` é gitignored por ser diretório de trabalho da orquestração.

`npm test` completo (72 testes, 15 arquivos — os 4 novos de `tests/editor/rota.test.ts` somam ao total), `npm run lint`, `npx tsc --noEmit` e `npm run build` passam. **Com isso, as 14 tasks do plano em `docs/superpowers/plans/2026-08-08-landing-cav.md` estão concluídas.** O que falta para o site ir ao ar está listado em [[status]] → "Bloqueios reais" — domínio, hospedagem, dados de contato, fotos — e depende do Rafael/igreja, não de código.

## 2026-08-09 — Correção dos 5 achados de revisão da Task 14

Review apontou 5 achados (Important × 4, Minor × 1) na trava de `/editar`/`/api/content` — a checagem que impede qualquer visitante de reescrever o conteúdo institucional da igreja em produção. Corrigidos todos:

**Achado 1 (fail-open) — trava invertida para allowlist.** `process.env.NODE_ENV === 'production'` só bloqueava quando a variável valia exatamente `'production'`; com `NODE_ENV` indefinido, `'staging'`, `'prod'` ou um typo, a rota ficava **aberta**. Funcionava hoje só porque `next start` força `NODE_ENV=production` por conta própria — propriedade da toolchain, não do código; sob um servidor customizado ou outra plataforma abriria em silêncio. Trocado para `process.env.NODE_ENV === 'development'` (libera só esse valor, bloqueia todo o resto) — fail-closed: configuração inesperada nega, não libera.

**Achado 2 (duplicação) — extraída para `lib/ambiente.ts`.** A checagem vivia em duas cópias: `apenasEmDesenvolvimento()` (não exportada) em `app/api/content/route.ts`, e a mesma condição reimplementada à mão em `app/editar/page.tsx`. Duas fontes de verdade para a checagem mais crítica do projeto — se uma mudasse e a outra não, divergiam em silêncio e nenhum teste acusava. Criado `lib/ambiente.ts`, exportando `ehDesenvolvimento(): boolean`, com comentário explicando por que a regra é allowlist (para ninguém "simplificar" de volta para `!== 'production'`). Os dois arquivos consomem dessa função — `route.ts` mantém um wrapper local (`bloqueioForaDeDesenvolvimento`) que só converte o booleano em `NextResponse`, sem duplicar a condição de segurança em si.

**Achado 3 (cobertura de teste) — casos do meio adicionados.** `tests/editor/rota.test.ts` só testava `'production'` e `'development'` — os dois extremos —, nunca um `NODE_ENV` indefinido, `'test'` ou `'staging'`, que é exatamente o buraco do Achado 1. Adicionado `it.each` sobre `[undefined, 'test', 'staging', 'production']` para `GET` e `PUT`, todos esperando 404. Adicionada também cobertura nova de `app/editar/page.tsx` (não tinha teste nenhum): confirma que a página chama `notFound()` (capturando o erro e checando `error.digest` contém `'404'`, que é como o `notFound()` do Next.js sinaliza) nos mesmos quatro ambientes, e que renderiza sem lançar em `'development'`. **Verificação de que os testes pegam o problema de verdade**: revertida a trava para `=== 'production'` (`lib/ambiente.ts` temporário), rodada a suíte — 9 de 15 testes falharam exatamente nos casos `undefined`/`'test'`/`'staging'` (os de `'production'`/`'development'` continuaram passando, como esperado) — depois restaurada a versão correta e os 15 voltaram a passar. Evidência completa em `.superpowers/sdd/task-14-report.md`.

**Achado 4 (escrita não atômica) — `writeFile` direto trocado por escrita-e-rename.** Se o processo morresse no meio de um `writeFile` direto em `content/site.json`, o arquivo ficava truncado — e como `content/load.ts` importa esse JSON estaticamente, o próximo `npm run dev`/`build` passaria a falhar com erro de parse pouco óbvio pra quem só editou um texto no formulário. Adicionada `gravarAtomico()` em `route.ts`: escreve num arquivo temporário no mesmo diretório (`.site.json.<uuid>.tmp`) e troca por cima com `rename` (atômico no mesmo sistema de arquivos); se a escrita falhar, remove o temporário (`unlink`, silenciado se já não existir) e propaga o erro, que o `PUT` converte em 500 com mensagem em português. Testado manualmente contra o dev server: `PUT` real via `curl`, conteúdo do disco confirmado, nenhum arquivo temporário sobrando em `content/`.

**Achado 5 (GET sem validação) — `GET` agora passa pelo `siteSchema`.** Antes, `GET` fazia `JSON.parse` cru do arquivo e devolvia direto; se o arquivo estivesse com JSON inválido ou um formato que não bate com o schema, o formulário recebia lixo sem erro claro. Agora `GET` tenta o `JSON.parse` (erro → 500 com mensagem em português dizendo que `content/site.json` não é um JSON válido) e depois passa por `siteSchema.safeParse` (erro → 500 com a mesma lista de `erros` no formato `caminho — mensagem` que o `PUT` já usava) antes de devolver o conteúdo.

**Verificação de produção repetida após as correções**: `npm run build && PORT=4321 npm start`, `curl` real: `GET /editar` → 404, `GET /api/content` → 404, `PUT /api/content` → 404, `GET /` → 200. Servidor derrubado ao final, porta 4321 confirmada livre. `npm test` (83 testes, 15 arquivos), `npm run lint`, `npx tsc --noEmit` e `npm run build` passam. Relatório completo em `.superpowers/sdd/task-14-report.md`.

---

## 2026-08-09 — Revisão final de branch, antes do lançamento (4 grupos)

Relatório completo em `.superpowers/sdd/revisao-final-report.md` (não versionado). Resumo por grupo, com o porquê de cada decisão:

**Grupo 1 — armadilhas latentes do `/editar`.** As duas correções deste grupo têm em comum não mudar nada visível hoje, porque os campos envolvidos estão vazios ou o layout esconde o problema por coincidência — e é exatamente por isso que passariam despercebidas sem alguém procurar de propósito.

- `Visita.tsx`: `visita.texto` (opcional) e o endereço eram dois `<p>` irmãos sem margem entre eles — o preflight do Tailwind zera margem de parágrafo por padrão. Invisível hoje porque `visita.texto` é string vazia em `content/site.json`. Corrigido com `mt-3` no `<p>` do endereço. Teste novo em `tests/components/visita.test.tsx` renderiza com `visita.texto` preenchido para provar a separação — sem isso, o teste anterior nunca exercitava esse caminho.
- `Hero.tsx`: o blob decorativo (`text-verde-limao/25`) atrás do subtítulo tinge o fundo verde-escuro. Hoje o título ocupa duas linhas e empurra o subtítulo pra fora da área do blob (confirmado via `getBoundingClientRect` no navegador real — sem overlap no viewport mobile testado). Se `hero.titulo` encurtar pelo `/editar`, o subtítulo sobe pra dentro do blob. Opacidade reduzida para `/15` — escolha deliberada por não depender do comprimento do título (o tingimento é uniforme em qualquer ponto do blob, fill sólido sem gradiente; reposicionar o blob dependeria de garantir ausência de overlap pra qualquer combinação de título/subtítulo, o que é frágil da mesma forma que o bug original). **Medição real, não estimada**: `getComputedStyle` do blob renderizado no navegador (Chrome via MCP) + composição via `<canvas>` 2D (`fillStyle` sequencial, source-over) para reproduzir exatamente o compositing do motor de renderização — validado contra um ponto de referência exato (opacidade 1.0 compõe pra `#A3C63C` puro, batendo com o token `verdeLimao`). Resultado: `/25` mede 4,89:1 com creme (`#5c7322`); `/15` mede 5,72:1 (`#52681f`). **Divergência registrada com honestidade**: o enunciado desta tarefa descrevia o fundo tingido em `/25` como `#717F4E`/3,97:1 (reprovando AA); minha medição direta, por dois caminhos consistentes entre si, não reproduziu esse número — não há segunda camada de composição no código que explicasse a diferença. Documentei os dois números em vez de adotar o do enunciado sem checar. O problema estrutural (fragilidade dependente do layout) é real de qualquer forma, e a correção para `/15` fica com folga acima de qualquer um dos dois valores.

**Grupo 2 — identidade e documentação.** `app/favicon.ico` (triângulo do scaffold da Vercel — a igreja aparecia com o logo de outra empresa no resultado do Google) removido; `app/icon.svg` novo, com comentário XML explícito marcando que é placeholder (folha/árvore estilizada, limão sobre verde escuro) até a igreja enviar o emblema circular real — pendência nova na tabela de bloqueios de `status.md`. `README.md` reescrito do zero pra descrever o projeto como ele é hoje (estava "planejamento concluído, implementação não iniciada", desatualizado desde a Task 1). `CLAUDE.md` corrigido de "Next.js 15" pra 16 — `package.json` já estava certo, só o texto estava desatualizado.

**Grupo 3 — consistência e limpeza.** Anel de foco extraído pra `app/globals.css` como utilities Tailwind v4 (`@utility anel-de-foco` creme, `@utility anel-de-foco-escuro` verde-escuro pros dois botões da `Visita` sobre o cartão claro — inversão preservada), substituindo cinco repetições da mesma sequência de classes espalhadas por componente. Aplicado também aos dois links do rodapé, que não tinham nenhum anel e caíam no outline default do navegador — **é a segunda vez que esse esquecimento acontece** (a primeira não está documentada aqui porque não tinha teste; agora tem, em `tests/pagina.test.tsx`, varrendo todo link/botão da página, não só o rodapé). Verificado com foco real por `Tab` de teclado no navegador, não só lido no código. `key={acao.rotulo}` da `AcoesRapidas` trocado por `key={i}` (último desvio da convenção do projeto). Código morto removido: `Circulo.tsx`, `SeparadorXXX.tsx` (só usados pelos próprios testes — cobertura de mentira) e os cinco SVGs do scaffold em `public/`.

**Grupo 4 — buracos de teste no que é difícil de testar.** `Credo` instancia seis `Acordeao` (um por grupo) pra dar âncora própria a cada um; consequência é que dois grupos podem ficar abertos ao mesmo tempo, diferente do `Acordeao` isolado (que fecha o anterior ao abrir outro — contrato mantido em teste à parte). Teste novo em `credo.test.tsx` prova o comportamento real na página, não só o do componente isolado. `app/layout.tsx`/`robots.ts`/`sitemap.ts` não tinham nenhum teste apesar de SEO ser o objetivo declarado do projeto — `tests/seo/metadata.test.tsx` novo, com um mock de `next/font/google` em `vitest.setup.ts` (só função dentro do pipeline de build do Next; sem o mock, importar `app/layout.tsx` no Vitest quebrava com `TypeError: Poppins is not a function`). Dois testes novos em `pagina.test.tsx`: hierarquia de cabeçalhos sem salto de nível (h1→h2→h3→h4, incluindo os h4 escondidos do Credo — passou de primeira, a estrutura já estava certa, o teste é rede de segurança) e `<footer>` fora de `<main>` (bug real já corrigido, agora com teste). `tests/smoke.test.tsx` (componente inventado que não existe no app) removido.

**Verificação final**: `npm test` — 97 testes, 15 arquivos, todos verdes. `npm run build`, `npm run lint`, `npx tsc --noEmit` limpos. `npm run build && PORT=4321 npm start` + `curl`: `/editar` → 404, `/api/content` (GET e PUT) → 404, `/` → 200, `/icon.svg` → 200 `image/svg+xml`. Servidor derrubado, porta 4321 confirmada livre.

## 2026-08-09 — Correção: o contraste do blob do Hero em /25 já passava

A revisão final de branch afirmou que o blob a `text-verde-limao/25` tingia o fundo para `#717F4E`, dando 3,97:1 com creme e reprovando AA. Eu repassei esse número na instrução da correção sem verificar.

Estava errado. Composição alfa simples de `#A3C63C` a 25% sobre `#44581A` dá `#5C7422`, e creme sobre isso mede **4,84:1** — já dentro do AA. O subagente que aplicou a correção mediu `4,89:1` no navegador, discordou do enunciado em vez de aceitá-lo, e registrou a divergência. Ele estava certo.

O blob ficou em `/15` (5,72:1) assim mesmo: a folga é gratuita e o teste trava o valor. Mas **não havia armadilha latente** — encurtar `hero.titulo` pelo `/editar` nunca teria reprovado o contraste. Os comentários em `Hero.tsx` e `tests/components/hero.test.tsx` foram corrigidos para não deixar o número errado gravado no código.

Lição para as próximas: número de contraste vindo de revisão se recalcula antes de virar instrução. A conta leva dez segundos.

## 2026-08-09 — Branch `implementacao` integrada na main pelo PR #1

64 commits, 14 tasks, 97 testes. Rafael pediu merge **e** PR; resolvido abrindo o PR primeiro (para o diff ficar revisável e registrado) e fazendo o merge por ele. A branch foi preservada, não deletada.

Balanço do que as revisões pegaram e que o plano tinha deixado passar: acordeão que desmontava o painel e esconderia o credo do Google; trava do editor fail-open; `<footer>` dentro do `<main>`; cinco rótulos hardcoded fora do JSON; `text-creme/70` reprovando AA; e cinco testes que passavam com o conteúdo trocado entre rótulos. Nenhum desses era visível sem alguém olhar de fora.

Dois defeitos só apareceram no navegador, nunca no jsdom: o ícone de relógio renderizando como disco sólido, e o landmark do rodapé. Vale como lembrete de que a suíte não substitui abrir a página.

## 2026-08-10 — Logo real da igreja integrado

Rafael enviou o pacote da marca. Substituí o `app/icon.svg` que eu tinha desenhado como placeholder.

Três derivados entraram: favicon (emblema creme sobre verde), imagem de compartilhamento 1200×630 com o logotipo horizontal, e o emblema transparente no hero.

**No hero entra só o emblema, não o lockup completo.** O logotipo inteiro traz o nome da igreja, e o `<h1>` logo abaixo repete o mesmo nome — duplicar prejudicaria o SEO e faria o leitor de tela anunciar duas vezes. O emblema vai com `alt=""`, porque o texto adjacente já diz o que ele representa.

O caminho fica em `hero.emblema` no JSON, editável pelo `/editar`, e obedece à regra de degradação: vazio não renderiza imagem. O schema valida que o caminho comece com `/`, com mensagem em português.

Confirmação que vale registrar: a paleta que tiramos do folder impresso (limão `#A3C63C` → verde `#44581A`) é exatamente o gradiente da versão colorida do logo. A marca e o site falam a mesma língua sem precisar de ajuste.

Fora do escopo por ora: as duas versões animadas em MP4.

## 2026-08-10 — Três capítulos novos, vindos da pesquisa nas igrejas mais influentes

Pesquisa em Elevation, Bola de Neve e nos levantamentos de melhores sites de igreja de 2026. Os padrões que se repetem: responder quem/quando/o-que-fazer antes de qualquer rolagem, navegação curta, biblioteca de mensagens, CTA fixo, e generosidade tratada como seção e não como aba escondida.

Comparado a essas referências, o site tinha três lacunas — e nenhuma era estética:

1. **Mensagens** (`#mensagens`, depois de Propósito). A igreja tem canal ativo no YouTube e o site não linkava uma pregação. Quem descobre pelo Google não conseguia ouvir nada antes de decidir visitar. `destaques` nasce vazio: nenhuma pregação foi inventada, e o capítulo leva direto ao canal.
2. **Generosidade** (`#generosidade`, depois do Credo). O credo tem uma declaração inteira sobre generosidade e o site não oferecia nenhum caminho para ofertar — era a única parte do texto deles que pedia uma ação que a página não dava. O texto do capítulo é a frase VERBATIM da declaração, e o botão só aparece quando `ctaUrl` for preenchido.
3. **O que esperar** (`#primeira-vez`, antes de Visita). Nenhuma resposta para o que trava o visitante: como é, preciso me vestir de algum jeito, vão me chamar na frente.

**Ressalva que vale registrar alto:** os três passos de "O que esperar" são o **único texto do site que eu escrevi em vez de transcrever**. Todo o resto vem do folder. São suposições razoáveis sobre um domingo da CAV, mas suposições — o Rafael precisa confirmar ou reescrever pelo `/editar`. Está na tabela de bloqueios do [[status]].

Decisões menores: os passos usam `<ol>` porque a ordem é uma sequência de chegada (diferente da Visão, que virou `<ul>` justamente por não ter hierarquia confirmada). A trilha passou de 6 para 9 capítulos.

## 2026-08-10 — Modernização visual: o site virou a maquete

Rafael comparou o site com a maquete em `docs/mockups/influentes/` e escolheu a maquete. Entrou a camada visual que faltava quando incorporei só os três capítulos.

**O que mudou:**
- **Fundo `#131A08`** (novo token `tema.fundo`) e `tema.superficie` `#1D2710` para faixas alternadas. O verde `#44581A` continua no tema, agora só como cor de botão e do cartão de visita.
- **Cabeçalho fixo** translúcido com faixa de horário embutida, até cinco âncoras e o botão de visita. No celular o menu é um `<details>` — abre sem JavaScript e pelo teclado.
- **CTA fixo no rodapé do celular** com "Como chegar" e "Planeje sua visita". Quase todo o tráfego vem da bio do Instagram; a ação precisa estar no polegar em qualquer ponto da página.
- **Logo animado no hero**, com `mix-blend-screen` para o preto do arquivo sumir. Quem prefere menos movimento não vê **e não baixa** os 820 KB — o `src` só é montado depois de confirmar a preferência.
- Hero de tela cheia, tipografia maior e mais apertada; Cuidado em três colunas no desktop.

**A consequência mais importante não é estética.** No fundo escuro o limão mede 9,08:1 e passa AA em qualquer tamanho — a regra "limão só em 24px+" morreu. Ver [[projeto/identidade-visual]].

Três testes que guardavam a regra antiga foram reescritos, não afrouxados: o do rótulo do capítulo, o do subtítulo do hero e o do blob (que saiu do hero). No lugar entrou `tests/lib/contraste.test.ts`, que mede os tokens de verdade em vez de checar nome de classe — se alguém clarear o fundo pelo `/editar`, a suíte quebra.

`window.matchMedia` foi adicionado ao `vitest.setup.ts`: o jsdom não implementa, e sem isso qualquer componente que consulte preferência de movimento derruba os testes da página.

## 2026-08-11 — O endereço do site deixa de ser um bloqueio de lançamento

Rafael pediu para publicar na Vercel. A CLI não está instalada e não há sessão autenticada — o deploy em si é dele, e eu não entro com credenciais.

O que dava para resolver, e era um bloqueio real: o site anunciava `https://arvoredavidalrv.com.br` como endereço oficial em cinco lugares (canonical, `og:url`, sitemap, robots, JSON-LD). Domínio que não existe. Publicar assim seria pior que não ter dados estruturados.

`lib/urlDoSite.ts` resolve por ordem de confiabilidade, com a URL que a Vercel informa no meio. Ver [[projeto/deploy]].

**Erro meu no caminho, que vale registrar:** verifiquei primeiro com `npm start` sobre um build antigo e o canonical continuou no domínio errado. Quase reportei o resolvedor como quebrado. A causa é que os metadados do Next são resolvidos no build — a variável precisa existir lá, não no start. Rebuild com a variável confirmou os cinco lugares corretos.

`dadosDaIgreja` passou a receber a url por parâmetro (com padrão) para continuar pura e testável, em vez de ler o ambiente por dentro.

## 2026-08-11 — Passada de pré-lançamento

Rafael ainda não importou o projeto na Vercel (conferi: os endereços `*.vercel.app` respondem 404 da borda, e o domínio não resolve). Enquanto isso, dois acertos que só faziam sentido agora:

**Imagem de compartilhamento no verde novo.** O `app/opengraph-image.png` ainda usava o verde `#44581A` — quem clicasse no link do WhatsApp veria um card num verde e cairia num site quase preto. Remapeei só as cores de fundo (fundo → `#131A08`, círculo decorativo → `#1D2710`) com transição suave nas bordas, preservando logotipo e texto. Regenerar do zero exigiria a Poppins, que não está instalada no sistema — e trocar a fonte deixaria o card pior que a inconsistência de cor.

**`Blob` removido.** Era a última peça de `components/decor/`. Saiu do Hero na modernização e nenhuma seção passou a usá-la; ficou só sendo exercitada pelo próprio teste, que é cobertura de mentira. Mesmo critério aplicado ao `Circulo` e ao `SeparadorXXX` na revisão final de 2026-08-09.

Os ícones `app/icon.png` e `app/apple-icon.png` **não** foram alterados: continuam com o emblema creme sobre o verde da marca. Em 16px o verde é mais reconhecível que o quase-preto, e o favicon é o lugar onde a cor da marca deve aparecer.

## 2026-08-17 — Auditoria de segurança e dois endurecimentos preventivos

Rafael pediu uma revisão de vulnerabilidades. Não havia PR aberto (as cinco já
estavam mergeadas), então a auditoria foi sobre a `main` inteira.

**Nenhuma falha explorável.** O que mais importava — a regra 3 do `INDEX.md` —
está certo e agora verificado de ponta a ponta, não só por teste unitário: com
`next start` sobre o build de produção, `/editar`, `GET /api/content` e
`PUT /api/content` respondem 404. `npm audit` limpo, nenhum segredo versionado,
todo `target="_blank"` com `rel="noopener noreferrer"`, e o `JsonLd` já escapava
`<` corretamente.

Os dois achados eram de endurecimento, não de bug. Arrumei os dois em TDD
(13 testes escritos primeiro, vermelhos, depois a implementação).

**1. Cabeçalhos de segurança em `next.config.ts`.** O site não mandava nenhuma
instrução de proteção ao navegador. Agora manda CSP, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS.

A troca consciente que vale registrar: o `script-src` aceita `'unsafe-inline'`.
Eliminar isso exigiria nonce por requisição via middleware, e **nonce exige
renderização dinâmica** — a home deixaria de ser estática e de sair do CDN. Isso
custaria o carregamento rápido no celular, que é O caso de uso (regra 4). Mesmo
com `'unsafe-inline'`, a política continua bloqueando o vetor mais comum, que é
buscar script de um domínio de fora. Confirmei no navegador injetando um script
de `example.com` e um iframe de `evil.example.com`: os dois foram bloqueados
(`script-src-elem` e `frame-src`) e o mapa do Google continuou carregando.
O build confirma que a home segue estática (`○ /`).

O CSP de desenvolvimento é mais frouxo (`'unsafe-eval'` e `ws:`), senão o hot
reload do Turbopack quebra. A checagem reusa `ehDesenvolvimento()` — a mesma
allowlist fail-closed do `/editar`, então NODE_ENV inesperado cai na política
apertada, nunca na frouxa. Verifiquei que `npm run dev` e o `/editar` continuam
funcionando (a API respondeu 200 com o conteúdo).

**2. `contato.mapaEmbedUrl` agora exige https.** Era o único campo de link do
schema sem validação, enquanto `mapsUrl`, `instagram`, `youtube` e `canalUrl`
todos usavam `.url()`. Ele vai direto para o `src` de um `<iframe>` em
`Visita.tsx` — o navegador carrega esse endereço sozinho, sem clique, o que faz
um `javascript:` ou `data:` valer bem mais ali que num link comum. Explorar
exigiria já ter acesso ao repositório ou à máquina de desenvolvimento, então a
gravidade real é baixa; arrumei porque parecia esquecimento, não escolha.
Vazio continua válido — é como se esconde o mapa.

**Nota de método:** a verificação visual por screenshot não funcionou (a pane do
navegador ficou escondida e o `scroll` deu timeout). Trocar por sondas
programáticas — injetar recursos externos e ler os eventos
`securitypolicyviolation` — provou mais que a screenshot provaria, porque mostra
o CSP *bloqueando* e não só a página parecendo normal.

## 2026-08-17 — O projeto já está na Vercel (constatado, não feito)

Ao mergear o PR #6 apareceu um check da Vercel verde, com deploy de preview do
projeto `rafael-e2fe/landing-page-cav`. Ou seja, Rafael importou o repositório
em algum momento entre 2026-08-12 e hoje, e o `status.md` seguia dizendo que
importar era "o passo que falta". Corrigido.

O que **não** foi verificado: se a produção está no ar e em que endereço. Os
previews respondem 302 para o login da Vercel (proteção de acesso ligada), e a
chamada à API de deployments do GitHub foi bloqueada pelo classificador de
permissões nesta sessão. Fica como pergunta aberta para o Rafael, não como
suposição escrita aqui.

Consequência prática: os cabeçalhos de segurança do PR #6 estão verificados
contra o build de produção **local** (`next start`), não contra a borda da
Vercel. A Vercel aplica `headers()` na borda normalmente, mas isso é
expectativa, não medição — vale um `curl -I` no endereço real quando ele for
conhecido.
