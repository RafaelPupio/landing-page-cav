import type { NextConfig } from "next";
import path from "node:path";
import { ehDesenvolvimento } from "./lib/ambiente";

/**
 * Política de segurança de conteúdo (CSP): a lista do que o navegador tem
 * permissão de carregar nesta página. Serve de segunda tranca — se algum dia
 * um texto malicioso entrar pelo `content/site.json`, o navegador ainda se
 * recusa a buscar script de fora, abrir plugin ou reescrever a base das URLs.
 *
 * Por que `script-src` e `style-src` aceitam 'unsafe-inline': o Next injeta
 * scripts inline para hidratar a página e o `<body>` carrega as cores do tema
 * num atributo `style` (app/layout.tsx). O jeito de eliminar isso é gerar um
 * nonce por requisição via middleware — mas nonce exige renderização dinâmica,
 * e esta é uma landing page estática servida do CDN. Trocar a página estática
 * por dinâmica custaria o carregamento rápido no celular, que é O caso de uso
 * (o tráfego vem do link da bio do Instagram). Mesmo com 'unsafe-inline', a
 * política continua bloqueando o vetor mais comum: buscar script de um domínio
 * de fora. É uma troca consciente, não um esquecimento.
 *
 * `frame-src` libera só o mapa do Google, que é a única origem de terceiros
 * que a página carrega (o <iframe> em components/sections/Visita.tsx). Se essa
 * linha sumir, o mapa vira um retângulo vazio em produção, sem erro na tela —
 * por isso tem teste em tests/seguranca/cabecalhos.test.ts.
 *
 * Em desenvolvimento o Turbopack precisa de `eval` e de um websocket para o
 * hot reload; sem essas duas exceções, `npm run dev` quebra. A checagem é a
 * mesma allowlist fail-closed de `/editar`: qualquer NODE_ENV inesperado cai
 * na política apertada, nunca na frouxa.
 */
function politicaDeSeguranca(): string {
  const dev = ehDesenvolvimento();

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // O logo animado (public/logo-animado.mp4) é servido pelo próprio site.
    "media-src 'self'",
    "frame-src https://maps.google.com https://www.google.com",
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    // Nada de <object>/<embed>, e ninguém reescreve a base das URLs relativas.
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Ninguém pode embutir este site dentro do dele (clickjacking).
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const cabecalhosDeSeguranca = [
  { key: "Content-Security-Policy", value: politicaDeSeguranca() },
  // Impede o navegador de "adivinhar" o tipo de um arquivo e tratar, por
  // exemplo, um .png como se fosse script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Versão antiga do frame-ancestors, para navegadores que não leem CSP.
  { key: "X-Frame-Options", value: "DENY" },
  // Sites de fora recebem só o domínio de origem, nunca a URL completa.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // A página não usa nenhuma dessas capacidades; negar todas evita que um
  // script injetado peça permissão em nome da igreja.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Obriga o navegador a só voltar por https. Sem `preload`: entrar na lista
  // de preload dos navegadores é praticamente irreversível, e o domínio
  // próprio da igreja ainda nem foi apontado.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Desabilitado: `next dev` reescreve CLAUDE.md a cada execução para injetar
  // instruções genéricas ao agente, conflitando com o CLAUDE.md do projeto.
  agentRules: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:caminho*", headers: cabecalhosDeSeguranca }];
  },
};

export default nextConfig;
