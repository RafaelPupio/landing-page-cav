import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Lideranca({ lideranca }: { lideranca: Site['lideranca'] }) {
  return (
    <Capitulo id="lideranca" rotulo={lideranca.rotulo} titulo={lideranca.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{lideranca.texto}</p>
    </Capitulo>
  )
}
