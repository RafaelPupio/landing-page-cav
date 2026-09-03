import type { Site } from '@/content/schema'

type Acao = Site['acoesRapidas'][number]
type Icone = Acao['icone']

const ICONES: Record<Icone, string> = {
  mapa: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
  relogio: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6V6h-2v7.4l5.2 3.1 1-1.7-4.2-2.2Z',
  credo: 'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.8V8h4.2L14 3.8ZM8 12h8v1.6H8V12Zm0 3.4h8V17H8v-1.6Z',
  ceia: 'M7 2h10a3 3 0 0 1 3 3v3a8 8 0 0 1-7 7.9V19h3v2H8v-2h3v-3.1A8 8 0 0 1 4 8V5a3 3 0 0 1 3-3Zm-1 3v3a6 6 0 0 0 12 0V5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1Z',
  instagram:
    'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm3.4 15a3.4 3.4 0 0 1-3.4 3.4H7A3.4 3.4 0 0 1 3.6 17V7A3.4 3.4 0 0 1 7 3.6h10A3.4 3.4 0 0 1 20.4 7v10Z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z',
  spotify:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 1 1-.3-1.5c4.8-1.1 9-.6 12.3 1.4.4.2.5.7.2 1Zm1.2-2.7a1 1 0 0 1-1.3.3c-3.4-2.1-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.7 14.2 1.7.5.3.6.9.3 1.4Zm.1-2.9C14.8 8.4 8.5 8.2 4.9 9.3a1.2 1.2 0 1 1-.7-2.3C8.4 5.7 15.3 5.9 19.4 8.3a1.2 1.2 0 0 1-1.3 2Z',
}

/**
 * Cores das plataformas, medidas sobre o fundo #131A08. O mínimo para elemento
 * gráfico é 3:1 (WCAG 1.4.11).
 *
 * YouTube #FF0000 → 4,45:1 · Spotify #1DB954 → 6,89:1 — ambos oficiais, ambos passam.
 *
 * O Instagram é gradiente. A ponta roxa oficial (#833AB4) mede 2,74:1 e REPROVA,
 * então essa ponta foi clareada para #A855E8 (4,35:1). Laranja, rosa e amarelo
 * seguem oficiais. Trocar o roxo de volta reintroduz a falha de contraste.
 */
const GRADIENTE_INSTAGRAM = ['#FCAF45', '#F77737', '#E1306C', '#A855E8']
const COR_DA_PLATAFORMA: Partial<Record<Icone, string>> = {
  youtube: '#FF0000',
  spotify: '#1DB954',
}

function Icone({ icone }: { icone: Icone }) {
  // O id do gradiente é fixo e único no documento: dois <linearGradient> com o
  // mesmo id fariam o navegador usar sempre o primeiro.
  const idGradiente = 'gradiente-instagram'
  const cor = icone === 'instagram' ? `url(#${idGradiente})` : (COR_DA_PLATAFORMA[icone] ?? 'currentColor')

  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill={cor}>
      {icone === 'instagram' && (
        <defs>
          <linearGradient id={idGradiente} x1="0" y1="1" x2="1" y2="0">
            {GRADIENTE_INSTAGRAM.map((parada, i) => (
              <stop
                key={i}
                offset={i / (GRADIENTE_INSTAGRAM.length - 1)}
                stopColor={parada}
              />
            ))}
          </linearGradient>
        </defs>
      )}
      {/* evenodd recorta os subcaminhos internos: sem ele o relógio vira um disco sólido. */}
      <path d={ICONES[icone]} fillRule="evenodd" />
    </svg>
  )
}

function Cartao({ acao }: { acao: Acao }) {
  // Regra explícita (não heurística): só URL absoluta http(s) abre em nova aba.
  // `startsWith('http')` casaria também com algo como "httpfoo".
  const externo = /^https?:\/\//.test(acao.href)
  return (
    <li>
      <a
        href={acao.href}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex h-full flex-col items-start gap-3 rounded-2xl border border-creme/30 p-4 text-sm font-semibold text-creme transition hover:border-creme focus-visible:anel-de-foco"
      >
        <Icone icone={acao.icone} />
        <span>
          {acao.rotulo}
          {acao.detalhe && (
            <span className="mt-0.5 block text-xs font-light text-creme/90">{acao.detalhe}</span>
          )}
        </span>
      </a>
    </li>
  )
}

export default function AcoesRapidas({ acoes }: { acoes: Site['acoesRapidas'] }) {
  const principais = acoes.filter((a) => a.grupo === 'principal')
  const redes = acoes.filter((a) => a.grupo === 'rede')

  return (
    <nav aria-label="Ações rápidas" className="px-6 pb-8">
      <div className="mx-auto max-w-3xl space-y-3">
        {/* Duas colunas no celular, não três: a 327px de tela, três cartões dão 103px
            cada e metade dos rótulos quebra em duas linhas. Em duas colunas dão 159px
            e cabem numa linha só. */}
        {principais.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {principais.map((acao, i) => (
              <Cartao key={i} acao={acao} />
            ))}
          </ul>
        )}
        {redes.length > 0 && (
          <ul className="grid grid-cols-3 gap-3">
            {redes.map((acao, i) => (
              <Cartao key={i} acao={acao} />
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}
