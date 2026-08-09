import Blob from '@/components/decor/Blob'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 pt-20 pb-14 md:pt-28">
      <Blob
        variante={2}
        className="pointer-events-none absolute -right-28 -top-32 w-80 text-verde-limao/25 md:w-[30rem]"
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
          className="mt-10 inline-block rounded-full bg-creme px-8 py-4 text-base font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
        >
          {hero.ctaTexto}
        </a>
      </div>
    </section>
  )
}
