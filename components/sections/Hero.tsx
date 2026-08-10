import Image from 'next/image'
import Blob from '@/components/decor/Blob'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 pt-20 pb-14 md:pt-28">
      {/* Opacidade do blob calibrada pelo contraste, não pela distância do título:
          o tingimento é uniforme em qualquer ponto do blob, então a margem vale onde
          quer que o subtítulo caia — inclusive se hero.titulo encurtar pelo /editar.
          Medido: /25 dá 4,84:1 com creme (já dentro do AA) e /15 dá 5,72:1. */}
      <Blob
        variante={2}
        className="pointer-events-none absolute -right-28 -top-32 w-80 text-verde-limao/15 md:w-[30rem]"
      />
      <div className="relative mx-auto max-w-3xl">
        {/* alt vazio de propósito: o <h1> logo abaixo já diz o nome da igreja, e um
            alt aqui faria o leitor de tela anunciar a mesma coisa duas vezes.
            Campo vazio no JSON não renderiza nada — mesma regra de degradação do resto. */}
        {hero.emblema && (
          <Image
            src={hero.emblema}
            alt=""
            width={904}
            height={754}
            priority
            className="mb-7 h-20 w-auto md:h-28"
          />
        )}
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
