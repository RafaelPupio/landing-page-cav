/**
 * `/editar` e `/api/content` (GET e PUT) reescrevem `content/site.json` — o
 * conteúdo institucional da igreja. Se essa checagem abrir fora de
 * desenvolvimento, qualquer visitante do site consegue reescrever esse
 * conteúdo. É a falha mais grave possível neste projeto.
 *
 * Por isso a regra é uma ALLOWLIST, não uma blocklist: libera só quando
 * `NODE_ENV` é exatamente `'development'` e bloqueia em qualquer outro
 * valor — indefinido, `'test'`, `'staging'`, `'prod'`, um typo, o que for.
 * Fail-closed: se a configuração for inesperada, o comportamento seguro é
 * negar, não liberar.
 *
 * NÃO troque `=== 'development'` por `!== 'production'` (ou por qualquer
 * outra blocklist). Isso reabriria o buraco: um `NODE_ENV` ausente ou com
 * valor inesperado passaria a liberar a rota em vez de bloqueá-la. Hoje
 * `next start` força `NODE_ENV=production` por conta própria, então a
 * checagem antiga funcionava por propriedade da toolchain — não do código.
 * Sob um servidor customizado ou outra plataforma, ela abriria em silêncio.
 */
export function ehDesenvolvimento(): boolean {
  return process.env.NODE_ENV === 'development'
}
