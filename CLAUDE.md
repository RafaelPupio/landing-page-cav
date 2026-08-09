# LandingPageCav — ponto de entrada do Claude

Landing page da Comunidade Árvore da Vida (igreja em Lucas do Rio Verde/MT).
Next.js 16 + Tailwind v4, página única, conteúdo em `content/site.json`.

**Comece toda tarefa lendo `brain/INDEX.md`** (hub pequeno), e depois abra APENAS
a nota que a tarefa precisa. Nunca leia o vault inteiro nem o spec completo sem
necessidade — o apêndice do spec tem milhares de palavras de texto doutrinário e
só deve ser aberto quando for transcrever conteúdo.

**Termine toda tarefa atualizando o brain — obrigatório, não opcional.** Antes de
declarar qualquer trabalho pronto: atualize `brain/status.md`, acrescente uma
entrada datada em `brain/log/decisions.md` e toque a nota de tópico que a tarefa
afetou. Depois commit e push. Tarefa que mudou a realidade mas não o brain é
tarefa inacabada.

Regras duras (antes mesmo de ler o brain):

1. **Texto da igreja é verbatim.** Vem do folder impresso, transcrito no apêndice
   de `docs/superpowers/specs/2026-08-08-landing-cav-design.md`. Nunca reescrever,
   resumir ou "melhorar" — nem o texto doutrinário sobre família, papéis ou
   disciplina. São posições da igreja, não suas.
2. **Nenhum texto hardcoded em componente.** Tudo passa por `content/site.json`.
3. **`/editar` e `/api/content` só existem em desenvolvimento.** Se responderem em
   produção, qualquer visitante reescreve o site. É a falha mais grave possível
   aqui — está na checklist de deploy e tem teste cobrindo.
4. Mobile-first é requisito, não gosto: o tráfego vem do link da bio do Instagram.
5. Antes de dizer "pronto": `npm test && npm run build` verdes, com a saída na mão.

Plano de implementação em `docs/superpowers/plans/2026-08-08-landing-cav.md`,
14 tarefas em TDD. Executar em ordem, uma por vez, com commit ao fim de cada uma.
