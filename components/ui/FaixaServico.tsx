import type { Site } from '@/content/schema'

/**
 * Faixa no topo com horário e endereço. Existe para responder "quando vocês se
 * reúnem e onde" antes de qualquer rolagem — a informação que o visitante vindo
 * da busca ou do Instagram procura primeiro.
 */
export default function FaixaServico({ faixa }: { faixa: Site['faixaServico'] }) {
  return (
    <p className="bg-verde-limao px-6 py-2.5 text-center text-[13px] font-semibold text-fundo">
      {faixa.texto}
    </p>
  )
}
