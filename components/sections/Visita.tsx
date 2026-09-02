import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Visita({
  visita,
  contato,
  horarios,
}: {
  visita: Site['visita']
  contato: Site['contato']
  horarios: Site['horarios']
}) {
  const endereco = `${contato.logradouro} — ${contato.bairro}, ${contato.cidade}/${contato.estado}`

  return (
    <Capitulo id="visita" rotulo={visita.rotulo} titulo={visita.titulo}>
      <div className="rounded-3xl bg-creme p-6 text-grafite md:p-8">
        {visita.texto && <p className="font-light leading-relaxed">{visita.texto}</p>}

        <p className="mt-3 text-lg font-light">{endereco}</p>

        <dl className="mt-5 space-y-1">
          {horarios.map((horario, i) => (
            // O rótulo não quebra: "Santa Ceia:" partido em duas linhas desalinhava
            // o horário ao lado. shrink-0 impede o flex de espremê-lo.
            <div key={i} className="flex flex-wrap gap-x-2">
              <dt className="shrink-0 whitespace-nowrap font-semibold">{horario.rotulo}:</dt>
              <dd className="font-light">{horario.quando}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={contato.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-verde-escuro px-6 py-3 font-semibold text-creme focus-visible:anel-de-foco-escuro"
          >
            {visita.ctaMapsTexto}
          </a>
          {contato.telefone && (
            <a
              href={`tel:${contato.telefone.replace(/\D/g, '')}`}
              className="rounded-full border border-verde-escuro px-6 py-3 font-semibold text-verde-escuro focus-visible:anel-de-foco-escuro"
            >
              {visita.ctaTelefoneTexto}
            </a>
          )}
        </div>

        {contato.mapaEmbedUrl && (
          <iframe
            title={visita.mapaTitulo}
            src={contato.mapaEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="mt-7 h-64 w-full rounded-2xl border-0"
          />
        )}
      </div>
    </Capitulo>
  )
}
