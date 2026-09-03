# Status — atualizado 2026-09-03

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
- [x] Auditoria de segurança + endurecimento (2026-08-17) — ver [[log/decisions]]
- [x] Deploy — produção no ar em <https://cavlrv.com.br> (verificado 2026-09-02)
- [x] Santa Ceia, bloco de agenda do mês e o "Ç" corrigido (PR #8, mergeado 2026-09-02)
- [x] Canal do YouTube correto e menu do celular que recolhe (PR #9, mergeado 2026-09-02)
- [x] Botão do Spotify em Mensagens, rodapé e `sameAs` (PR #10, mergeado 2026-09-02)
- [ ] Atalhos do topo em duas faixas, redes com cor de plataforma — **PR #11 aberto, aguardando o Rafael**

Suíte: **159 testes**, 19 arquivos. `npm run build` e `npm run lint` limpos.

## Segurança

Auditado em 2026-08-17, sem nenhuma falha explorável. A trava de `/editar` e
`/api/content` está correta (allowlist fail-closed em `lib/ambiente.ts`) e
verificada contra o build de produção: as três rotas respondem 404. `npm audit`
limpo, nenhum segredo versionado, todo `target="_blank"` com `rel="noopener"`.

Dois endurecimentos aplicados nessa passada, ambos preventivos:
`next.config.ts` agora envia CSP e os demais cabeçalhos de segurança, e
`contato.mapaEmbedUrl` exige https no schema. Detalhes e as trocas conscientes
(por que o CSP aceita `'unsafe-inline'`) em [[log/decisions]].

## Próximo passo

O trabalho de código acabou. O que falta é do Rafael e da igreja — ver a tabela abaixo. A ordem de maior retorno: **Perfil da Empresa no Google** (pesa mais que o site para busca local), depois domínio + Vercel, depois fotos e logo.

## Bloqueios reais

Nenhum bloqueia a implementação. Os itens abaixo bloqueiam apenas o **lançamento**, e todos dependem do Rafael ou da igreja, não de código:

| Item | Situação |
|---|---|
| Domínio | ✅ **NO AR: <https://cavlrv.com.br>** (2026-09-02). Registrado no Registro.br, delegado à Vercel, TLS emitido, verificado no projeto. Redeploy feito após a verificação: canonical, og:url e sitemap já anunciam o domínio novo; cabeçalhos de segurança conferidos na borda; `/editar` responde 404. `www` e o `.vercel.app` antigo continuam servindo 200 sem redirecionar — o canonical resolve o SEO, mas um redirect 308 no painel da Vercel seria o acabamento (opcional). NS do registro ainda em transição para vercel-dns (Registro.br serve os IPs da Vercel enquanto isso — funciona igual) |
| Hospedagem | ✅ **No ar em produção: <https://landing-page-cav.vercel.app>** (verificado em 2026-08-18: responde 200, com todos os cabeçalhos de segurança do PR #6 na borda, e `/editar` + `/api/content` respondendo 404). Projeto `rafael-e2fe/landing-page-cav`; previews continuam sob proteção de acesso (302 para login) |
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
