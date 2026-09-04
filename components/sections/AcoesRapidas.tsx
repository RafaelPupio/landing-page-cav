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
  // Traçado oficial da marca (simple-icons). O anterior era desenho à mão: as três
  // ondas saíam finas demais e a 20px o ícone lia como um disco verde riscado.
  spotify:
    'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0m5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02m1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2m.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
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

/**
 * Ajuste ótico. O traçado oficial do Spotify preenche a caixa inteira (24×24 de
 * tinta), enquanto Instagram desenha 20×20 e YouTube 20×14 dentro da mesma caixa.
 * Sem encolher, o Spotify fica 20% maior que os vizinhos e domina a faixa.
 */
const AJUSTE_OTICO: Partial<Record<Icone, string>> = {
  spotify: 'translate(2 2) scale(0.8333)',
}

function Icone({ icone }: { icone: Icone }) {
  // O id do gradiente é fixo e único no documento: dois <linearGradient> com o
  // mesmo id fariam o navegador usar sempre o primeiro.
  const idGradiente = 'gradiente-instagram'
  const cor = icone === 'instagram' ? `url(#${idGradiente})` : (COR_DA_PLATAFORMA[icone] ?? 'currentColor')

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill={cor}>
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
      <path d={ICONES[icone]} fillRule="evenodd" transform={AJUSTE_OTICO[icone]} />
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
        className="flex h-full flex-col items-center justify-center gap-1.5 rounded-xl border border-creme/30 px-2 py-3 text-center text-[13px] font-semibold leading-tight text-creme transition hover:border-creme focus-visible:anel-de-foco"
      >
        <Icone icone={acao.icone} />
        <span>
          {acao.rotulo}
          {acao.detalhe && (
            <span className="mt-0.5 block text-[11px] font-light text-creme/90">{acao.detalhe}</span>
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
