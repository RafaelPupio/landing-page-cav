# SEO

## A verdade desconfortável primeiro

Para a busca "igreja perto de mim" ou "igreja em Lucas do Rio Verde", quem domina o resultado é o **Perfil da Empresa no Google** (o card com mapa, foto, horário e avaliações), não o site. Um site perfeito com o perfil abandonado perde para um perfil bem cuidado sem site nenhum.

Então a ação de maior retorno **não é código**: criar ou reivindicar o perfil, preencher horário e fotos, e vincular esta página como site oficial. As duas coisas se reforçam — o Google cruza os dados do perfil com o JSON-LD da página e ganha confiança nos dois.

Isso está em [[status]] como pendência. Se o Rafael perguntar "o que faço primeiro para aparecer no Google", a resposta é o perfil, não a landing page.

## O que o código faz

**JSON-LD `Church`** (`lib/jsonld.ts`, injetado em `app/layout.tsx`) — é o que permite ao Google exibir horário e endereço direto no resultado de busca. Carrega `name`, `url`, `description`, `address` como `PostalAddress` completo, `openingHoursSpecification` (Sunday 18:00–20:00), `sameAs` com Instagram e YouTube. Campos opcionais (`geo`, `telephone`, `email`) só entram quando preenchidos — objeto com campo vazio é pior que objeto sem o campo.

**Metadados** — `title` com cidade e estado (`Comunidade Árvore da Vida — Lucas do Rio Verde/MT`), description mencionando horário e endereço, `canonical`, Open Graph com `locale: pt_BR`, Twitter Card.

**`sitemap.xml` e `robots.txt`** — gerados por `app/sitemap.ts` e `app/robots.ts`. O robots bloqueia `/editar` e `/api/` explicitamente, mesmo eles já retornando 404 em produção: cinto e suspensório.

**HTML semântico** — um único `h1` (o nome da igreja, no hero), um `h2` por seção, âncoras nomeadas. Há um teste que falha se um segundo `h1` aparecer.

**Core Web Vitals** — o Google usa desempenho como sinal de ranqueamento. Por isso: nada de imagem pesada acima da dobra, fonte via `next/font` (sem FOUT e sem request a domínio de terceiro), decoração em SVG inline, página estática.

## O que ainda falta

- **Imagem Open Graph** — precisa de arte 1200×630. Sem ela o card do link, quando alguém compartilha no WhatsApp ou Instagram, fica sem imagem. É bem visível e vale resolver antes do lançamento.
- **Domínio próprio** — em `*.vercel.app` a página funciona, mas rende menos. Ver [[projeto/deploy]].
- **Coordenadas** — sem `latitude`/`longitude`, o `geo` do JSON-LD não é emitido.
