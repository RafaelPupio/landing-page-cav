# Deploy

## Estado

Nada publicado. O repositório está no GitHub (`RafaelPupio/landing-page-cav`, privado) e o código do site ainda não foi escrito.

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
