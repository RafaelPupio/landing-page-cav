import Capitulo from '@/components/ui/Capitulo'
import type { Site } from '@/content/schema'

export default function Generosidade({ generosidade }: { generosidade: Site['generosidade'] }) {
  return (
    <Capitulo id="generosidade" rotulo={generosidade.rotulo} titulo={generosidade.titulo}>
      <p className="text-base font-light leading-relaxed text-creme/90">{generosidade.texto}</p>

      {/* Regra de degradação: enquanto a igreja não tiver um meio de contribuição
          cadastrado, o capítulo fica só com o texto — nenhum botão morto na tela. */}
      {generosidade.ctaUrl && generosidade.ctaTexto && (
        <a
          href={generosidade.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-creme px-6 py-3 font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:anel-de-foco"
        >
          {generosidade.ctaTexto}
        </a>
      )}
    </Capitulo>
  )
}
