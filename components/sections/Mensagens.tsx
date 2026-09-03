import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Mensagens({ mensagens }: { mensagens: Site['mensagens'] }) {
  return (
    <Capitulo id="mensagens" rotulo={mensagens.rotulo} titulo={mensagens.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{mensagens.intro}</p>

      {/* Regra de degradação: sem destaques cadastrados, sobra só o link do canal.
          Nenhuma pregação é inventada aqui — a lista nasce vazia de propósito. */}
      {mensagens.destaques.length > 0 && (
        <ul className="mt-8 space-y-4">
          {mensagens.destaques.map((destaque, i) => (
            <li key={i} className="rounded-2xl border border-creme/20 bg-creme/[0.03] p-5">
              <h3 className="text-base font-semibold text-creme">
                {destaque.url ? (
                  <a
                    href={destaque.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline focus-visible:anel-de-foco"
                  >
                    {destaque.titulo}
                  </a>
                ) : (
                  destaque.titulo
                )}
              </h3>
              {destaque.detalhe && (
                <p className="mt-1 text-sm font-light text-creme/90">{destaque.detalhe}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={mensagens.canalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-creme px-6 py-3 font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:anel-de-foco"
        >
          {mensagens.canalTexto}
        </a>
        {/* Degradação: sem perfil cadastrado, nem botão nem introdução aparecem. */}
        {mensagens.spotifyUrl && mensagens.spotifyTexto && (
          <a
            href={mensagens.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-creme/25 px-6 py-3 font-semibold text-creme transition hover:border-creme focus-visible:anel-de-foco"
          >
            {mensagens.spotifyTexto}
          </a>
        )}
      </div>

      {mensagens.spotifyUrl && mensagens.spotifyIntro && (
        <p className="mt-4 text-sm font-light leading-relaxed text-creme/90">
          {mensagens.spotifyIntro}
        </p>
      )}

      {/* Um perfil do Spotify não pode ser incorporado — só playlist, podcast ou
          episódio. Este campo existe para destacar UMA playlist quando a igreja
          escolher qual; vazio, sobra só o botão acima. */}
      {mensagens.spotifyEmbedUrl && (
        <iframe
          src={mensagens.spotifyEmbedUrl}
          title={mensagens.spotifyTexto || 'Playlist no Spotify'}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="encrypted-media"
          className="mt-6 h-40 w-full rounded-2xl border-0"
        />
      )}

    </Capitulo>
  )
}
