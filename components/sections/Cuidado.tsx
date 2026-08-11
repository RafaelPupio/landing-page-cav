import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Cuidado({ cuidado }: { cuidado: Site['cuidado'] }) {
  return (
    <Capitulo id="cuidado" rotulo={cuidado.rotulo} titulo={cuidado.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{cuidado.intro}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cuidado.pilares.map((pilar, i) => (
          <div key={i} className="rounded-2xl border border-creme/20 bg-creme/[0.03] p-6">
            <h3 className="text-lg font-bold uppercase tracking-wide text-creme">{pilar.nome}</h3>
            {pilar.subtitulo && (
              <p
                data-subtitulo
                className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-creme/90"
              >
                {pilar.subtitulo}
              </p>
            )}
            <p className="mt-3 text-sm font-light leading-relaxed text-creme/90">{pilar.texto}</p>
          </div>
        ))}
      </div>
    </Capitulo>
  )
}
