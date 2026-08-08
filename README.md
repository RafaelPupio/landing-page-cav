# Landing Page — Comunidade Árvore da Vida

Página única da Comunidade Árvore da Vida (Lucas do Rio Verde/MT), pensada para
ser encontrada no Google e servir como destino do link da bio do Instagram.

**Status:** planejamento concluído, implementação não iniciada.

- Design e conteúdo: [`docs/superpowers/specs/2026-08-08-landing-cav-design.md`](docs/superpowers/specs/2026-08-08-landing-cav-design.md)
- Plano de implementação (14 tarefas TDD): [`docs/superpowers/plans/2026-08-08-landing-cav.md`](docs/superpowers/plans/2026-08-08-landing-cav.md)
- Base de conhecimento (vault Obsidian): [`brain/INDEX.md`](brain/INDEX.md)

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Zod, Vitest.

Todo o conteúdo vive em `content/site.json`, validado por Zod — nenhum componente
contém texto fixo. Alterar esse arquivo altera o site inteiro, incluindo as cores.

## Editar o conteúdo sem programar

```bash
npm run dev
```

Abrir <http://localhost:3000/editar> — formulário com um campo por item de conteúdo.
Essa rota **não existe no site publicado** (404 em produção).
