# Decisões

Append-only. Cada entrada: o que foi decidido, e por quê. Nunca reescrever uma entrada antiga — se uma decisão for revertida, escrever uma entrada nova dizendo isso.

---

<!-- rotated: this file is an index -->

Index only — one line per decision. Full entries live in `decisions/<year>-Q<n>.md`
next to this file. Open the quarter you need, never the whole history.

## 2026-Q3 — `decisions/2026-Q3.md`

- `2026-08-08` Objetivo duplo: visitante novo + credo completo
- `2026-08-08` Stack: Next.js 15 + Tailwind v4
- `2026-08-08` Dados práticos vieram do Instagram
- `2026-08-08` Layout mudou de Editorial Orgânico para Bento após o Rafael revelar o us…
- `2026-08-08` Camada de SEO adicionada ao escopo
- `2026-08-08` `content/site.json` como fonte única, validado por Zod
- `2026-08-08` Correções tipográficas autorizadas no texto do folder
- `2026-08-08` Corpo de texto alinhado à esquerda, não justificado
- `2026-08-08` Âncora do credo pertence ao `Credo`, não ao `Acordeao`
- `2026-08-08` Repositório publicado como privado no GitHub
- `2026-08-08` Layout final: direção D (Capítulos), não Bento
- `2026-08-08` Regra de contraste do limão sobre o fundo escuro
- `2026-08-08` Grade pontilhada cortada
- `2026-08-08` Implementação numa branch, não na main
- `2026-08-08` Task 2 concluída: `content/schema.ts`, `content/site.json`, `content/loa…
- `2026-08-08` Task 3 concluída: `lib/tema.ts`, tokens ligados ao Tailwind, fundo escur…
- `2026-08-08` Task 4 concluída: primitivas decorativas
- `2026-08-08` Task 5 concluída: primitivas de interface (Trilha, Capítulo, Chip, Acord…
- `2026-08-08` Correção de revisão da Task 5: painel do Acordeão nunca é desmontado
- `2026-08-08` Task 6 concluída: Hero e faixa de Ações Rápidas
- `2026-08-08` Correção de revisão da Task 6: contraste do subtítulo sem teste e link e…
- `2026-08-08` Task 7 concluída: capítulos de História e Liderança
- `2026-08-08` Correção de revisão da Task 7: teste da Historia acoplado à estrutura in…
- `2026-08-08` Task 8 concluída: capítulo de Propósito (missão, visão, valores)
- `2026-08-08` Correção de revisão da Task 8: teste de ordem/conteúdo, visão vira `<ul>…
- `2026-08-08` Task 9 concluída: capítulo de Cuidado (Conectar, Crescer, Servir)
- `2026-08-08` Correção de revisão da Task 9: texto de cada pilar travado ao seu nome, …
- `2026-08-08` Task 10 concluída: capítulo do Credo, 20 declarações em 6 grupos por aco…
- `2026-08-08` Correção de revisão da Task 10: texto de cada declaração travado ao seu …
- `2026-08-08` Task 11 concluída: Citação, capítulo de Visita (cartão creme invertido) …
- `2026-08-08` Correção de revisão da Task 11: rótulos hardcoded, teste de horários, `k…
- `2026-08-08` Task 12 concluída: `app/page.tsx` montado, a página existe pela primeira…
- `2026-08-09` Task 13 concluída: SEO — metadados, JSON-LD `Church`, sitemap e robots
- `2026-08-09` Correção de revisão da Task 13: escape de `</script>` no JSON-LD e `diaS…
- `2026-08-09` Task 14 concluída: editor visual restrito a desenvolvimento (última task…
- `2026-08-09` Correção dos 5 achados de revisão da Task 14
- `2026-08-09` Revisão final de branch, antes do lançamento (4 grupos)
- `2026-08-09` Correção: o contraste do blob do Hero em /25 já passava
- `2026-08-09` Branch `implementacao` integrada na main pelo PR #1
- `2026-08-10` Logo real da igreja integrado
- `2026-08-10` Três capítulos novos, vindos da pesquisa nas igrejas mais influentes
- `2026-08-10` Modernização visual: o site virou a maquete
- `2026-08-11` O endereço do site deixa de ser um bloqueio de lançamento
- `2026-08-11` Passada de pré-lançamento
- `2026-08-17` Auditoria de segurança e dois endurecimentos preventivos
- `2026-08-17` O projeto já está na Vercel (constatado, não feito)
- `2026-08-18` Produção verificada no ar: fecha a pergunta aberta de ontem

## 2026-09-01 — Rafael tem um domínio grátis na Vercel: rafaelpupio.com

Rafael pediu para checar "um domínio grátis na Vercel". Duas mudanças de
realidade constatadas de uma vez:

**A CLI da Vercel agora está logada** (`rafaelpupio`, v59.10.0) — o brain
achava que não havia sessão. Isso abre verificação direta por `vercel domains` /
`vercel project inspect` nas próximas sessões.

**O domínio é `rafaelpupio.com`**, registrado pela Vercel minutos antes da
pergunta (2026-09-01 23:21), expira 2027-09-01, renovação US$ 11,25/ano.
Estado no momento da checagem: nameservers intencionais `ns1/ns2.vercel-dns.com`
ainda não confirmados pelo registro (✘ nos dois), HTTPS ainda não respondendo
(TLS não emitido), e **não apontado a projeto nenhum** — inclusive não ao
`landing-page-cav`.

Não apontei nada por conta própria, por duas razões: (1) apontar domínio é
mudança de produção; (2) é o domínio **pessoal** do Rafael — o site da igreja
no domínio do Rafael é decisão de marca dele e da liderança, não minha. O plano
original segue sendo `arvoredavidalrv.com.br`, ainda não registrado. Se ele
decidir usar, é um comando (`vercel domains add rafaelpupio.com landing-page-cav`
ou pelo painel) e `lib/urlDoSite.ts` adota o endereço sozinho no build seguinte.
