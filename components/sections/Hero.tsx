import Blob from '@/components/decor/Blob'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 pt-20 pb-14 md:pt-28">
      {/* Opacidade calibrada (não a distância do título) para blindar o contraste do
          subtítulo: em /25 o verde-escuro tingido mede só 3,97:1 com creme, abaixo do
          4,5:1 exigido pelo AA — hoje o título de duas linhas empurra o subtítulo para
          fora do blob por acidente, mas se o Rafael encurtar o título pelo /editar o
          subtítulo sobe para dentro do blob e reprova em silêncio. Em /15 o tingimento
          mede 5,72:1, com margem, então o resultado deixa de depender do comprimento
          do título — ver brain/log/decisions.md. */}
      <Blob
        variante={2}
        className="pointer-events-none absolute -right-28 -top-32 w-80 text-verde-limao/15 md:w-[30rem]"
      />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold uppercase leading-[1.02] tracking-tight text-creme md:text-6xl">
          {hero.titulo}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light text-creme md:text-2xl md:text-verde-limao">
          {hero.subtitulo}
        </p>
        <a
          href={hero.ctaAncora}
          className="mt-10 inline-block rounded-full bg-creme px-8 py-4 text-base font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:anel-de-foco"
        >
          {hero.ctaTexto}
        </a>
      </div>
    </section>
  )
}
