import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function PrimeiraVez({ primeiraVez }: { primeiraVez: Site['primeiraVez'] }) {
  return (
    <Capitulo id="primeira-vez" rotulo={primeiraVez.rotulo} titulo={primeiraVez.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{primeiraVez.intro}</p>

      <ol className="mt-8 space-y-6">
        {primeiraVez.passos.map((passo, i) => (
          <li key={i} className="rounded-2xl border border-creme/20 bg-creme/[0.03] p-5">
            {/* A numeração é informação: são os passos de uma chegada, em ordem. */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-creme/90">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 text-lg font-bold uppercase tracking-wide text-creme">
              {passo.titulo}
            </h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-creme/90">{passo.texto}</p>
          </li>
        ))}
      </ol>
    </Capitulo>
  )
}
