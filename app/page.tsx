import Hero from '@/components/sections/Hero'
import AcoesRapidas from '@/components/sections/AcoesRapidas'
import Trilha from '@/components/ui/Trilha'
import Historia from '@/components/sections/Historia'
import Proposito from '@/components/sections/Proposito'
import Cuidado from '@/components/sections/Cuidado'
import Lideranca from '@/components/sections/Lideranca'
import Credo from '@/components/sections/Credo'
import Citacao from '@/components/sections/Citacao'
import Visita from '@/components/sections/Visita'
import Rodape from '@/components/sections/Rodape'
import { site } from '@/content/load'

export default function Pagina() {
  return (
    <main>
      <Hero hero={site.hero} />
      <AcoesRapidas acoes={site.acoesRapidas} />
      <Trilha>
        <Historia historia={site.historia} />
        <Proposito proposito={site.proposito} />
        <Cuidado cuidado={site.cuidado} />
        <Lideranca lideranca={site.lideranca} />
        <Credo credo={site.credo} />
        <Visita visita={site.visita} contato={site.contato} horarios={site.horarios} />
      </Trilha>
      <Citacao citacao={site.citacao} />
      <Rodape nome={site.site.nome} texto={site.rodape.texto} redes={site.redes} />
    </main>
  )
}
