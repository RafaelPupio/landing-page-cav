import Capitulo from '@/components/ui/Capitulo'
import Acordeao, { type ItemAcordeao } from '@/components/ui/Acordeao'
import type { Site } from '@/content/schema'

export default function Credo({ credo }: { credo: Site['credo'] }) {
  const itens: ItemAcordeao[] = credo.grupos.map((grupo) => ({
    id: grupo.id,
    titulo: grupo.nome,
    conteudo: (
      <div className="space-y-6">
        {grupo.declaracoes.map((declaracao, i) => (
          <div key={i}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-creme">
              {declaracao.titulo}
            </h4>
            <p className="mt-2 text-sm font-light leading-relaxed text-creme/90">
              {declaracao.texto}
            </p>
          </div>
        ))}
      </div>
    ),
  }))

  return (
    <Capitulo id="credo" rotulo={credo.rotulo} titulo={credo.titulo}>
      <p className="mb-8 text-base font-light leading-relaxed text-creme/90">{credo.intro}</p>
      {itens.map((item) => (
        <div key={item.id} id={`credo-${item.id}`} className="scroll-mt-12">
          <Acordeao itens={[item]} />
        </div>
      ))}
    </Capitulo>
  )
}
