import type { Site } from '@/content/schema'

const ICONES: Record<Site['acoesRapidas'][number]['icone'], string> = {
  mapa: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
  relogio: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6V6h-2v7.4l5.2 3.1 1-1.7-4.2-2.2Z',
  instagram: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm3.4 15a3.4 3.4 0 0 1-3.4 3.4H7A3.4 3.4 0 0 1 3.6 17V7A3.4 3.4 0 0 1 7 3.6h10A3.4 3.4 0 0 1 20.4 7v10Z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z',
}

export default function AcoesRapidas({ acoes }: { acoes: Site['acoesRapidas'] }) {
  return (
    <nav aria-label="Ações rápidas" className="px-6 pb-8">
      <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
        {acoes.map((acao) => {
          const externo = acao.href.startsWith('http')
          return (
            <li key={acao.rotulo}>
              <a
                href={acao.href}
                {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-creme/30 p-4 text-sm font-semibold text-creme transition hover:border-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor">
                  <path d={ICONES[acao.icone]} />
                </svg>
                {acao.rotulo}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
