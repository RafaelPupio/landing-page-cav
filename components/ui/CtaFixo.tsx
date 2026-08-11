import type { Site } from '@/content/schema'

/**
 * Barra fixa no rodapé, só no celular. Quase todo o tráfego chega pelo link da
 * bio do Instagram: a ação de visitar precisa estar ao alcance do polegar em
 * qualquer ponto da página, não só quando a pessoa chega ao fim.
 */
export default function CtaFixo({
  cta,
  mapsUrl,
}: {
  cta: Site['ctaFixo']
  mapsUrl: string
}) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-full border border-creme/20 bg-fundo/90 p-2 backdrop-blur-lg md:hidden">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-full border border-creme/25 px-4 py-3 text-center text-sm font-semibold text-creme focus-visible:anel-de-foco"
      >
        {cta.rotuloSecundario}
      </a>
      <a
        href={cta.ancoraPrimaria}
        className="flex-1 rounded-full bg-creme px-4 py-3 text-center text-sm font-semibold text-verde-escuro focus-visible:anel-de-foco"
      >
        {cta.rotuloPrimario}
      </a>
    </div>
  )
}
