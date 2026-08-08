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

1. **`/editar` com `npm run dev`** — formulário no navegador, um campo por item, botão salvar. Grava direto no `site.json`. Só existe em desenvolvimento (`notFound()` em produção); em produção seria um buraco de segurança aberto para qualquer visitante.
2. **Editar `content/site.json` à mão** — JSON puro, sem código. Se errar, o build avisa qual campo.
3. **Fase 2, se pedirem:** Decap CMS por cima do mesmo JSON — login pelo GitHub, edição pelo celular, sem rodar nada. Não está no escopo atual.

## Marcadores em aberto

Campos que existem no schema mas estão vazios: `telefone`, `email`, `cep`, `latitude`, `longitude`. A regra de degradação cuida disso — campo vazio não renderiza bloco vazio. Sem telefone, o botão de telefone simplesmente não aparece. Ver [[status]].
