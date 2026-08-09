import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  // Desabilitado: `next dev` reescreve CLAUDE.md a cada execução para injetar
  // instruções genéricas ao agente, conflitando com o CLAUDE.md do projeto.
  agentRules: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
