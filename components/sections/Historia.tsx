import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Historia({ historia }: { historia: Site['historia'] }) {
  return (
    <Capitulo id="historia" rotulo={historia.rotulo} titulo={historia.titulo}>
      <div className="space-y-5 text-base font-light leading-relaxed text-creme/90">
        {historia.paragrafos.map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}
      </div>
    </Capitulo>
  )
}
