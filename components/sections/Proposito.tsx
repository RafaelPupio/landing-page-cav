import Capitulo from '@/components/ui/Capitulo'
import Chip from '@/components/ui/Chip'
import type { Site } from '@/content/schema'

export default function Proposito({ proposito }: { proposito: Site['proposito'] }) {
  return (
    <Capitulo id="proposito" rotulo={proposito.rotulo} titulo={proposito.titulo}>
      <p className="text-lg font-light leading-relaxed text-creme md:text-xl">
        {proposito.missao}
      </p>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-creme">
        {proposito.visaoTitulo}
      </h3>
      <ol className="mt-4 space-y-2">
        {proposito.visao.map((item) => (
          <li
            key={item}
            className="border-b border-creme/15 pb-2 text-base font-light text-creme/90"
          >
            {item}
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-creme">
        {proposito.valoresTitulo}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {proposito.valores.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </ul>
    </Capitulo>
  )
}
