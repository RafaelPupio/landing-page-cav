# Identidade visual

Tudo aqui foi extraído do folder impresso que o Rafael enviou. A igreja já tem uma identidade construída — o site a herda, não a reinventa.

## Tokens

| Nome | Hex | Uso |
|---|---|---|
| `fundo` | `#131A08` | **Fundo da página inteira** desde 2026-08-10 |
| `superficie` | `#1D2710` | Faixas e cartões que precisam se destacar do fundo |
| `verdeEscuro` | `#44581A` | Já foi o fundo; hoje só texto sobre creme (botão primário, cartão de visita) |
| `verdeLimao` | `#A3C63C` | Trilha, nós, rótulos, subtítulo do hero, faixa de horário — **qualquer tamanho** desde que o fundo escureceu |
| `creme` | `#F7F5EC` | Texto de corpo sobre o fundo verde escuro; único bloco de fundo claro é o cartão de visita |
| `grafite` | `#1F1F1C` | Texto sobre fundos claros (ex.: dentro do cartão de visita em creme) |

Vivem em `content/site.json` sob `tema`, viram variáveis CSS (`--verde-escuro` etc.) via `lib/tema.ts::variaveisDeTema()` aplicado como `style` no `<body>` (`app/layout.tsx`), e o Tailwind os expõe como `bg-verde-escuro`, `text-verde-limao` e afins pelo bloco `@theme inline` em `app/globals.css`. O `body` já nasce com `background-color: var(--fundo)` e `color: var(--creme)` no CSS global — não depende de uma classe Tailwind ser aplicada em `page.tsx` para o fundo escuro aparecer.

**Trocar uma cor no JSON repinta o site inteiro.** Esse é o ponto — foi desenhado assim para que ninguém precise caçar hex espalhado por componente.

## Cuidado de contraste

**Mudou em 2026-08-10, quando o fundo escureceu.** O par que importa é limão sobre o **fundo** — e o fundo deixou de ser o verde `#44581A` e passou a ser `#131A08`, verde quase preto.

| Par | Razão | Veredito |
|---|---|---|
| `verdeLimao` sobre `fundo` `#131A08` | **9,08:1** | Passa AA em qualquer tamanho |
| `verdeLimao` sobre `superficie` `#1D2710` | **7,93:1** | Passa AA em qualquer tamanho |
| `creme` sobre `fundo` | **16,31:1** | Passa com folga |
| `creme/90` sobre `fundo` | **13,30:1** | Passa |
| `creme/70` sobre `fundo` | **8,42:1** | Passa (reprovava no fundo antigo) |
| `verdeLimao` sobre o verde ANTIGO `#44581A` | 4,03:1 | **Reprovava** em texto pequeno |

A restrição que moldou o design original — *limão só em texto de 24px ou mais* — **não vale mais**. Ela era do fundo, não da cor. Hoje limão vale para rótulos, subtítulo do hero e a faixa de horário.

**O que trava isso:** `tests/lib/contraste.test.ts` mede os tokens reais de `content/site.json` e reprova se alguém clarear `tema.fundo`. Não é teste de classe CSS — é a conta. Se o fundo voltar a ser claro, o teste quebra antes de a página ir ao ar.

## Elementos gráficos

Do folder, todos reproduzidos em SVG inline (nada de imagem raster, nada de request externo):

- ~~Blobs orgânicos~~ (`components/decor/Blob.tsx`) — saíram do Hero quando o logo animado passou a ocupar o fundo do topo, e em 2026-08-11 foram removidos como código morto, seguindo o mesmo critério do círculo e do `✕✕✕`. Se a forma orgânica do folder fizer falta, reimplementar a partir do impresso em vez de recuperar do histórico sem revisitar o design.
- ~~Círculos sólidos~~ e ~~contornos finos em limão~~ e ~~`✕✕✕`~~ (`components/decor/Circulo.tsx`, `components/ui/SeparadorXXX.tsx`) — chegaram a ser implementados junto com o `Blob` na Task 4, mas nenhuma seção real (Task 6 em diante) acabou consumindo essas duas peças; removidas como código morto na revisão final de 2026-08-09 (só eram exercitadas pelos próprios testes, cobertura de mentira). Se a decoração do círculo/xis fizer falta visualmente algum dia, reimplementar a partir do folder impresso, não recuperar do histórico do git sem revisitar o design.
- ~~Grade pontilhada~~ — cortada na direção D: no fundo escuro vira ruído sem informar nada.

Toda decoração leva `aria-hidden="true"` e `focusable="false"`. Leitor de tela não deve encontrar nada disso.

**A trilha em si (a linha vertical em limão) não é decorativa — é estrutura.** Implementada na Task 5 como `components/ui/Trilha.tsx` (a linha, via pseudo-elemento posicionado) e `components/ui/Capitulo.tsx` (cada `<section>` com âncora própria, nó redondo em limão sobre a linha, rótulo em creme, `<h2>` em limão ≥24px). Os offsets `left-[1.6rem]`/`md:left-[2.6rem]` da linha e `-left-8`/`md:-left-10` do nó do capítulo são acoplados — mudar um sem o outro faz o nó flutuar fora da linha. `components/ui/Chip.tsx` (contorno creme translúcido, usado em listas de valores/crenças) e `components/ui/Acordeao.tsx` (um item aberto por vez, `aria-expanded`/`aria-controls`, operável por teclado) completam o kit de primitivas de interface. A partir de 2026-08-10 o kit ganhou `FaixaServico`, `Cabecalho` (fixo, com menu `<details>` no celular), `CtaFixo` (barra fixa no rodapé do celular) e `LogoAnimado` (client component que só monta o vídeo se a pessoa não pediu menos movimento).

## Tipografia

Poppins, carregada por `next/font/google` (sem FOUT, sem request a domínio de terceiro em runtime).

- Títulos: bold, caixa-alta, tracking apertado
- Corpo: light (300), leading relaxado

No folder o corpo é justificado. Na web, justificado em coluna estreita cria rios de espaço em branco no celular — por isso ficou alinhado à esquerda. Foi escolha consciente, não descuido.

## Fotos

O folder tem fotos de culto, oração e comunhão, várias em preto e branco, todas em máscara circular ou orgânica. **Nenhum arquivo foi recebido.** Os slots existem no layout e hoje renderizam gradientes no estilo do folder. Trocar por foto real = mudar um caminho em `content/site.json`.

## Logo da igreja (recebido em 2026-08-10)

O Rafael enviou o pacote da marca. Os arquivos-fonte ficam fora do repositório (`~/Downloads/drive-download-20260810T140353Z-1-001/`); o repositório guarda só os derivados usados no site.

O emblema é uma árvore dentro de um círculo, com o lockup "COMUNIDADE / ÁRVORE DA VIDA" abaixo. **A versão colorida usa um gradiente de limão para verde escuro — os mesmos tons que já estavam nos tokens.** A paleta que tiramos do folder impresso bate com a marca.

Variantes recebidas, e para que servem:

| Arquivo-fonte | O que é |
|---|---|
| `Prancheta 1 (2).png` | Vertical, preto — fundo claro |
| `Prancheta 1 cópia (2).png` | Vertical, **branco** — é a que o site usa |
| `Prancheta 1 cópia 2 (1).png` | Vertical, gradiente verde |
| `Prancheta 4*.png` | Horizontal (1209×261), nas mesmas três variantes |
| `LOGOPB.png` | 2927×2430, mas com fundo sólido — não serve para recorte |
| `Logo.ai` | Vetor. É um PDF por dentro, então `sips` rasteriza em qualquer resolução — mas sai preto sobre branco, sem alfa |

Derivados no repositório, todos gerados a partir da variante branca com o alfa original preservado e recoloridos para creme:

- `app/icon.png` (512) e `app/apple-icon.png` (180) — emblema creme sobre quadrado verde escuro. O Next gera os tamanhos a partir daí.
- `app/opengraph-image.png` (1200×630) — logotipo horizontal creme, filete limão e "Domingos, 18h · Lucas do Rio Verde / MT".
- `public/emblema-arvore-da-vida.png` (904×754) — emblema creme transparente, usado no hero.

**Por que só o emblema no hero, e não o logotipo inteiro:** o lockup completo já contém o nome da igreja, e o `<h1>` logo abaixo repete esse nome como texto. Duplicar seria ruim para SEO e faria o leitor de tela anunciar duas vezes. Por isso o hero usa o emblema com `alt=""` (decorativo) e mantém o nome como texto real.

O caminho do emblema vive em `hero.emblema` no `content/site.json`, então dá para trocar ou remover pelo `/editar`. Campo vazio não renderiza imagem — mesma regra de degradação do resto.

**Logo animado, em uso desde 2026-08-10.** `public/logo-animado.mp4` é `Logo Motion Árvore da Vida - 2.mp4` cortado de 3s a 8s (os 4 primeiros segundos são quase pretos) e comprimido pelo `avconvert` do macOS: **9,9 MB → 820 KB**. O fundo do arquivo é preto, então o hero usa `mix-blend-screen` — o preto some e sobra o brilho. Quem prefere menos movimento não vê e **não baixa**: o `src` só é montado depois de confirmar a preferência no cliente.
