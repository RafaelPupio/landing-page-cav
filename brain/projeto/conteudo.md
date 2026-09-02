# Conteúdo e como editar

## Fonte da verdade

O texto original é o **folder impresso da igreja**, enviado pelo Rafael como imagens em 2026-08-08. As imagens não sobrevivem a uma nova sessão — por isso o texto inteiro está transcrito no apêndice de `docs/superpowers/specs/2026-08-08-landing-cav-design.md`. **Esse apêndice é a fonte durável.** Se `content/site.json` divergir dele, o apêndice ganha.

## Regra inviolável

Texto doutrinário é reproduzido **verbatim**. Não resumir, não modernizar, não "deixar mais acolhedor", não cortar referência bíblica. Isso vale especialmente para as seções que tratam de família, papéis de homem e mulher, e disciplina eclesiástica — são posições da igreja, não do Claude, e editá-las seria falsificar um documento institucional.

Única exceção permitida: erro tipográfico evidente do impresso. Os já corrigidos, registrados em [[log/decisions]]:

- "EspíritoSanto" → "Espírito Santo"
- "Bondade imutávelde Deus" → "Bondade imutável de Deus"
- "procura-los" → "procurá-los"

## Arquitetura de conteúdo

```
content/
  site.json    todo o texto, links, horários, cores
  schema.ts    Zod — define a forma válida
  load.ts      valida na importação e exporta tipado
```

`load.ts` roda o `safeParse` no momento do import. Se o JSON estiver inválido, ele **lança** com o caminho do campo (`content/site.json: contato.logradouro — Required`). O build quebra. Isso é intencional: falhar alto na hora do build é infinitamente melhor que publicar uma página com um card vazio que ninguém percebe.

Nenhum componente importa `site.json` direto. Cada seção recebe sua fatia por props — o que os deixa testáveis isoladamente e impede que texto fixo se espalhe pelo código.

## O credo

20 declarações, agrupadas em 6 acordeões:

1. **As Escrituras** — A Bíblia
2. **Deus, Cristo e o Espírito** — Deus; Jesus Cristo; Espírito Santo
3. **Queda e salvação** — A queda; Regeneração; Salvação e livre-arbítrio; Batismo em águas; Batismo no Espírito Santo; Dons do Espírito
4. **Família e papéis** — A família; Papéis do homem e da mulher
5. **A Igreja** — Autonomia da igreja local; Reuniões e ceia; Caridade; Disciplina; Sacerdócio de cada crente
6. **Generosidade e últimas coisas** — Generosidade; Ressurreição dos mortos; Juízo vindouro

No desktop, um índice em painel fixo (`lg:sticky`) à esquerda. No celular, só os acordeões. Cada grupo tem âncora `#credo-<id>` para o índice apontar.

## Como o Rafael edita sem programar

Três camadas, da mais simples à mais técnica:

1. **`/editar` com `npm run dev`** — formulário no navegador (`components/editor/FormularioConteudo.tsx`), um campo por item (caminho tipo `visita.titulo` acima da caixa de texto), botão salvar. Grava direto no `site.json` via `PUT /api/content` (`app/api/content/route.ts`), que valida com `siteSchema` antes de gravar e devolve os erros em português se algo estiver errado. Construído na Task 14. Só existe em desenvolvimento — tanto a página quanto a API devolvem 404 se `NODE_ENV === 'production'`; em produção seria um buraco de segurança aberto para qualquer visitante (checagem coberta por `tests/editor/rota.test.ts`).
2. **Editar `content/site.json` à mão** — JSON puro, sem código. Se errar, o build avisa qual campo.
3. **Fase 2, se pedirem:** Decap CMS por cima do mesmo JSON — login pelo GitHub, edição pelo celular, sem rodar nada. Não está no escopo atual.

## Marcadores em aberto

Campos que existem no schema mas estão vazios: `telefone`, `email`, `cep`, `latitude`, `longitude`. A regra de degradação cuida disso — campo vazio não renderiza bloco vazio. Sem telefone, o botão de telefone simplesmente não aparece. Ver [[status]].

## Estado (Task 2, 2026-08-08)

`content/schema.ts`, `content/site.json` e `content/load.ts` existem e passam em `npm test` e `npm run build`. As 20 declarações do credo estão nos 6 grupos descritos acima, texto conferido contra o apêndice.

Pendência a revisar: `content/site.json` contém um `…` dentro da citação de Mateus 28.20 no primeiro capítulo (história) — reticências que já vêm no apêndice-fonte como parte da citação bíblica parcial, não texto cortado por mim. Mantido verbatim; ver [[log/decisions]].

## Publicar a agenda do mês (2026-08-12)

O capítulo `#agenda` existe para o Rafael trocar o cartaz do mês sem pedir alteração de código. Enquanto os três campos estiverem vazios, **o capítulo inteiro não renderiza** — nada de moldura vazia esperando cartaz.

Dois caminhos, e a imagem tem prioridade sobre o Canva incorporado quando os dois estão preenchidos.

**Caminho recomendado — imagem.** No Canva: `Compartilhar → Baixar → PNG`. No GitHub, entrar na pasta `public/`, `Add file → Upload files`, arrastar o arquivo, `Commit changes`. Depois preencher `agenda.imagem` com `/nome-do-arquivo.png` e `agenda.periodo` com o mês. Carrega rápido, não depende do Canva estar no ar e não manda dado nenhum para terceiro.

**Caminho alternativo — Canva incorporado.** No Canva: `Compartilhar → Mais → Incorporar`, copiar o endereço que termina em `/view?embed`, e colar em `agenda.canvaEmbedUrl`. Menos passos, mas depende do Canva e carrega mais devagar. Usa `referrerPolicy="no-referrer"`, mesma escolha de privacidade do mapa.

`agenda.canvaUrl` é independente dos dois: se preenchido, acrescenta o botão "Abrir a agenda em tela cheia".

## Culto mensal e os dados estruturados (2026-08-12)

`horarios` ganhou o campo `recorrencia` (`semanal` ou `mensal`). **Só os semanais entram no JSON-LD.**

O motivo é concreto: o schema.org não sabe dizer "todo primeiro domingo do mês". Declarar a Santa Ceia como `openingHoursSpecification` diria ao Google que a igreja abre às 8h **todo** domingo — falso em três semanas de cada quatro, e invisível para quem só olha a página. O culto mensal aparece normalmente no cartão de visita; só não vira dado estruturado.

Travado por `tests/seo/jsonld.test.tsx`, que verifica tanto um caso construído quanto o conteúdo real.
