# Deploy

## Estado

Nada publicado ainda, mas o site está pronto e o bloqueio técnico do endereço foi resolvido. Repositório no GitHub (`RafaelPupio/landing-page-cav`, privado), 122 testes verdes, build de produção verificado.

## Plano

**Hospedagem: Vercel, plano gratuito.** É o hospedeiro nativo do Next.js, o plano grátis cobre com folga o tráfego de uma igreja local, e o deploy é automático a cada push na `main`. Funciona com repositório privado.

**Domínio: a registrar pela igreja.** Sugestão `arvoredavidalrv.com.br` no Registro.br, ~R$40/ano. Sem domínio próprio a página vive em `*.vercel.app` — funciona, mas rende menos no Google e passa menos credibilidade num link de bio.

Ambos dependem de contas e de dinheiro da igreja. Não são coisas que o Claude resolve — são decisões do Rafael.

## Checagens antes de publicar

Não é burocracia: cada item aqui já é uma falha que aconteceria em produção.

1. `npm test && npm run build` verdes.
2. **`/editar` responde 404 em produção.** Rodar `npm run build && npm start` e conferir. Se responder 200, qualquer visitante reescreve o site inteiro — é o pior bug possível neste projeto.
3. `/api/content` também 404 em produção.
4. `curl -s <url> | grep 'application/ld+json'` retorna exatamente uma ocorrência.
5. `/robots.txt` e `/sitemap.xml` respondem.
6. Teste real no celular, não só no simulador de largura do navegador: as ações rápidas precisam estar visíveis sem rolagem.
7. Todos os `…` sumiram do `content/site.json` — se algum sobrou do plano, é texto truncado indo ao ar.

## Depois de publicar

- Vincular a URL ao Perfil da Empresa no Google (ver [[projeto/seo]] — isso importa mais que o site).
- Trocar o link da bio do Instagram.
- Submeter o sitemap no Google Search Console.

## O endereço do site se resolve sozinho (2026-08-11)

`site.url` no JSON guarda o domínio que a igreja pretende registrar. Enquanto ele não existir, publicar com esse valor faria canonical, `og:url`, sitemap, robots e JSON-LD apontarem para um endereço que não resolve — o Google receberia dados estruturados quebrados, o que é pior que não ter nenhum.

`lib/urlDoSite.ts` resolve na ordem:

1. `NEXT_PUBLIC_SITE_URL` — escape manual
2. `VERCEL_PROJECT_PRODUCTION_URL` — a Vercel preenche sozinha
3. `site.url` do JSON — vale em desenvolvimento

**Detalhe que custou um teste falso:** os metadados do Next são resolvidos no **build**, não no start. Verificar com `npm start` depois de um build feito sem a variável mostra o valor antigo e engana. O teste válido é `VERCEL_PROJECT_PRODUCTION_URL=... npm run build && npm start` — foi assim que confirmei os cinco lugares.

Na Vercel a variável existe no build, então funciona sem configuração. Quando o domínio próprio for apontado, ela passa a valer o domínio, e nada precisa ser editado.
