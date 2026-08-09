# Identidade visual

Tudo aqui foi extraído do folder impresso que o Rafael enviou. A igreja já tem uma identidade construída — o site a herda, não a reinventa.

## Tokens

| Nome | Hex | Uso |
|---|---|---|
| `verdeEscuro` | `#44581A` | **Fundo da página inteira** (decisão do layout D — Capítulos), botão primário como fundo |
| `verdeLimao` | `#A3C63C` | Trilha vertical, nós, texto de 24px+ — nunca texto pequeno (ver contraste abaixo) |
| `creme` | `#F7F5EC` | Texto de corpo sobre o fundo verde escuro; único bloco de fundo claro é o cartão de visita |
| `grafite` | `#1F1F1C` | Texto sobre fundos claros (ex.: dentro do cartão de visita em creme) |

Atualizado na Task 3 para refletir a decisão de layout D (fundo escuro do topo ao rodapé) — o texto antigo desta tabela ainda descrevia `creme` como fundo geral, herdado da fase anterior à escolha de layout.

Vivem em `content/site.json` sob `tema`, viram variáveis CSS (`--verde-escuro` etc.) via `lib/tema.ts::variaveisDeTema()` aplicado como `style` no `<body>` (`app/layout.tsx`), e o Tailwind os expõe como `bg-verde-escuro`, `text-verde-limao` e afins pelo bloco `@theme inline` em `app/globals.css`. O `body` já nasce com `background-color: var(--verde-escuro)` e `color: var(--creme)` no CSS global — não depende de uma classe Tailwind ser aplicada em `page.tsx` para o fundo escuro aparecer.

**Trocar uma cor no JSON repinta o site inteiro.** Esse é o ponto — foi desenhado assim para que ninguém precise caçar hex espalhado por componente.

## Cuidado de contraste

`verdeLimao` sobre `creme` é um par de contraste baixo. Serve para títulos grandes e elementos decorativos, **não** para texto corrido. Se aparecer numa linha de corpo em algum componente novo, é regressão de acessibilidade.

## Elementos gráficos

Do folder, todos reproduzidos em SVG inline (nada de imagem raster, nada de request externo):

- **Blobs orgânicos** — três variantes de path, em `components/decor/Blob.tsx`. No impresso eles sangram para fora da página; na web, `overflow-hidden` na seção com o blob posicionado parcialmente fora reproduz o efeito.
- **Círculos sólidos** — verde escuro e limão, três tamanhos.
- **Contornos finos em limão** — arcos de traço fino.
- **`✕✕✕`** — o motivo de três xis, em `components/ui/SeparadorXXX.tsx`, separando seções.
- **Grade pontilhada** — pequenos pontos em padrão SVG.

Toda decoração leva `aria-hidden="true"` e `focusable="false"`. Leitor de tela não deve encontrar nada disso.

## Tipografia

Poppins, carregada por `next/font/google` (sem FOUT, sem request a domínio de terceiro em runtime).

- Títulos: bold, caixa-alta, tracking apertado
- Corpo: light (300), leading relaxado

No folder o corpo é justificado. Na web, justificado em coluna estreita cria rios de espaço em branco no celular — por isso ficou alinhado à esquerda. Foi escolha consciente, não descuido.

## Fotos

O folder tem fotos de culto, oração e comunhão, várias em preto e branco, todas em máscara circular ou orgânica. **Nenhum arquivo foi recebido.** Os slots existem no layout e hoje renderizam gradientes no estilo do folder. Trocar por foto real = mudar um caminho em `content/site.json`.
