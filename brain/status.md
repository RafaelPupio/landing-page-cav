# Status — atualizado 2026-08-09

## Onde estamos

**Fase: implementação concluída e integrada na `main`.** As 14 tasks do plano foram executadas, cada uma com revisão independente, mais uma revisão final de todo o branch. PR #1 mergeado em 2026-08-09.

- [x] Brainstorming, design e escolha de layout (direção D — Capítulos)
- [x] Spec com o conteúdo integral do folder no apêndice
- [x] Plano de 14 tasks em TDD
- [x] Brain Obsidian
- [x] Repositório no GitHub
- [x] Tasks 1–14 — scaffold, conteúdo, tema, primitivas, seções, montagem, SEO, editor
- [x] Revisão final de branch, sem bloqueadores
- [ ] Deploy

Suíte: **97 testes**, 15 arquivos. `npm run build` e `npm run lint` limpos.

## Próximo passo

O trabalho de código acabou. O que falta é do Rafael e da igreja — ver a tabela abaixo. A ordem de maior retorno: **Perfil da Empresa no Google** (pesa mais que o site para busca local), depois domínio + Vercel, depois fotos e logo.

## Bloqueios reais

Nenhum bloqueia a implementação. Os itens abaixo bloqueiam apenas o **lançamento**, e todos dependem do Rafael ou da igreja, não de código:

| Item | Situação |
|---|---|
| Domínio | Não registrado. Sugestão: `arvoredavidalrv.com.br` no Registro.br, ~R$40/ano. Desde a Task 13, esse domínio inexistente já sai no HTML publicado — `metadataBase`/canonical, `og:url` e o `url` do JSON-LD (`lib/jsonld.ts`) apontam todos para `https://arvoredavidalrv.com.br`. Não quebra o build, mas até o domínio ser registrado e apontado, links compartilhados e o JSON-LD levam a um endereço que não resolve |
| Hospedagem | Vercel, plano gratuito — conta ainda não criada |
| WhatsApp / telefone | Desconhecido. Fica como campo vazio; o botão simplesmente não renderiza |
| E-mail, CEP, coordenadas | Desconhecidos, mesmo tratamento |
| Horários de GCs | Desconhecidos. Só o culto de domingo 18h está confirmado |
| Fotos | Nenhum arquivo recebido. Os slots existem e renderizam gradientes |
| Imagem Open Graph | Precisa de arte 1200×630. Sem ela, o card do link fica sem imagem |
| Perfil da Empresa no Google | Não verificado se existe. Ver [[projeto/seo]] — importa mais que o site |
| Logo real | `app/icon.svg` hoje é um placeholder (folha/árvore estilizada, limão sobre verde escuro) — a igreja tem um emblema circular próprio que não foi enviado. Trocar o arquivo quando o Rafael mandar o logo real (SVG de preferência) |

## Dados confirmados

Endereço, horário e redes vieram do perfil do Instagram em 2026-08-08. Ver [[projeto/objetivo]].
