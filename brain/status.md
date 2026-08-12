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
- [x] Capítulos de mensagens, generosidade e primeira visita (PR #2, mergeado 2026-08-10)
- [ ] Deploy

Suíte: **119 testes**, 16 arquivos. `npm run build` e `npm run lint` limpos.

## Próximo passo

O trabalho de código acabou. O que falta é do Rafael e da igreja — ver a tabela abaixo. A ordem de maior retorno: **Perfil da Empresa no Google** (pesa mais que o site para busca local), depois domínio + Vercel, depois fotos e logo.

## Bloqueios reais

Nenhum bloqueia a implementação. Os itens abaixo bloqueiam apenas o **lançamento**, e todos dependem do Rafael ou da igreja, não de código:

| Item | Situação |
|---|---|
| Domínio | Não registrado — mas **deixou de ser bloqueio técnico**: `lib/urlDoSite.ts` usa a URL que a Vercel informa, e passa a usar o domínio sozinho quando ele for apontado. Sugestão: `arvoredavidalrv.com.br` no Registro.br, ~R$40/ano. Desde a Task 13, esse domínio inexistente já sai no HTML publicado — `metadataBase`/canonical, `og:url` e o `url` do JSON-LD (`lib/jsonld.ts`) apontam todos para `https://arvoredavidalrv.com.br`. Não quebra o build, mas até o domínio ser registrado e apontado, links compartilhados e o JSON-LD levam a um endereço que não resolve |
| Hospedagem | ⏳ **É o passo que falta.** CLI instalada (v58.9.4), mas sem sessão. Importar `RafaelPupio/landing-page-cav` em vercel.com → Add New → Project. Como o repo é privado, precisa liberar o acesso na instalação do GitHub |
| WhatsApp / telefone | Desconhecido. Fica como campo vazio; o botão simplesmente não renderiza |
| E-mail, CEP, coordenadas | Desconhecidos, mesmo tratamento |
| Horários de GCs | Desconhecidos. Só o culto de domingo 18h está confirmado |
| Fotos | Nenhum arquivo recebido. Os slots existem e renderizam gradientes |
| Imagem Open Graph | ✅ Pronta em `app/opengraph-image.png`, já no verde novo `#131A08` |
| Perfil da Empresa no Google | Não verificado se existe. Ver [[projeto/seo]] — importa mais que o site |
| **Texto de "O que esperar"** | ⚠️ **Único texto do site que o Claude escreveu, não transcreveu.** Os três passos (chegue às 18h, venha como está, fique para conversar) são suposições sobre o domingo da igreja. Rafael/liderança precisa confirmar ou reescrever pelo `/editar` antes do lançamento |
| Link de contribuição | Não existe. O capítulo Generosidade renderiza só o texto; o botão aparece sozinho quando `generosidade.ctaUrl` for preenchido (PIX, link de doação, o que a igreja usar) |
| Mensagens em destaque | `mensagens.destaques` nasce vazio de propósito — nenhuma pregação foi inventada. Hoje o capítulo leva direto ao canal do YouTube |
| Logo real | ✅ Recebido e integrado em 2026-08-10 — favicon, imagem de compartilhamento e emblema no hero. Pendente só decidir se as versões animadas em MP4 entram |

## Dados confirmados

Endereço, horário e redes vieram do perfil do Instagram em 2026-08-08. Ver [[projeto/objetivo]].
