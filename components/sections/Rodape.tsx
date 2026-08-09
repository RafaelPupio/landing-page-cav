import type { Site } from '@/content/schema'

export default function Rodape({
  nome,
  texto,
  redes,
}: {
  nome: string
  texto: string
  redes: Site['redes']
}) {
  return (
    <footer className="px-6 pb-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border-t border-creme/20 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-creme">{nome}</p>
        {texto && <p className="text-sm font-light text-creme/90">{texto}</p>}
        <ul className="flex gap-6 text-sm font-semibold text-creme">
          <li>
            <a
              href={redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded underline-offset-4 hover:underline focus-visible:anel-de-foco"
            >
              {redes.instagramRotulo}
            </a>
          </li>
          <li>
            <a
              href={redes.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded underline-offset-4 hover:underline focus-visible:anel-de-foco"
            >
              {redes.youtubeRotulo}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
