import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

/**
 * A agenda do mês, publicada como imagem exportada do Canva ou como o próprio
 * Canva incorporado. Existe para o Rafael conseguir trocar o cartaz do mês sem
 * pedir alteração de código.
 *
 * A imagem tem prioridade sobre o Canva incorporado: carrega mais rápido, não
 * depende de terceiro estar no ar e não manda dado nenhum para fora.
 */
export default function Agenda({ agenda }: { agenda: Site['agenda'] }) {
  const temConteudo = agenda.imagem || agenda.canvaEmbedUrl || agenda.canvaUrl
  // Regra de degradação: enquanto não houver agenda publicada, o capítulo inteiro
  // não existe — nada de moldura vazia esperando cartaz.
  if (!temConteudo) return null

  return (
    <Capitulo id="agenda" rotulo={agenda.rotulo} titulo={agenda.titulo}>
      {agenda.intro && (
        <p className="text-base font-light leading-relaxed text-creme/90">{agenda.intro}</p>
      )}
      {agenda.periodo && (
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-verde-limao">
          {agenda.periodo}
        </p>
      )}

      {agenda.imagem ? (
        // <img> e não next/image: o cartaz é enviado pelo Rafael e as dimensões
        // mudam a cada mês; o next/image exigiria width/height fixos e distorceria
        // um cartaz de proporção diferente.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={agenda.imagem}
          alt={`Agenda ${agenda.periodo || 'do mês'} da Comunidade Árvore da Vida`}
          className="mt-8 w-full rounded-2xl border border-creme/20"
        />
      ) : (
        agenda.canvaEmbedUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-creme/20">
            <iframe
              src={agenda.canvaEmbedUrl}
              title={`Agenda ${agenda.periodo || 'do mês'}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
              className="aspect-[4/5] w-full border-0 md:aspect-[16/10]"
            />
          </div>
        )
      )}

      {agenda.canvaUrl && (
        <a
          href={agenda.canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border border-creme/25 px-6 py-3 font-semibold text-creme transition hover:border-creme focus-visible:anel-de-foco"
        >
          Abrir a agenda em tela cheia
        </a>
      )}
    </Capitulo>
  )
}
