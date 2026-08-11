import Image from 'next/image'
import LogoAnimado from '@/components/ui/LogoAnimado'
import type { Site } from '@/content/schema'

export default function Hero({ hero }: { hero: Site['hero'] }) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-16 pt-40 md:pt-44"
    >
      {/* Vazio no JSON esconde o vídeo — e quem prefere menos movimento nunca o baixa. */}
      {hero.videoLogo && <LogoAnimado src={hero.videoLogo} />}

      {/* Véu por cima do vídeo: garante o contraste do texto onde quer que o brilho
          da animação passe. Sem ele o contraste dependeria do quadro do vídeo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_35%,transparent_0%,rgba(19,26,8,0.82)_55%,var(--fundo)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* alt vazio de propósito: o <h1> logo abaixo já diz o nome da igreja, e um
            alt aqui faria o leitor de tela anunciar a mesma coisa duas vezes. */}
        {hero.emblema && (
          <Image
            src={hero.emblema}
            alt=""
            width={904}
            height={754}
            priority
            className="mb-8 h-16 w-auto md:h-24"
          />
        )}
        <h1 className="max-w-[16ch] text-5xl font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-creme md:text-8xl">
          {hero.titulo}
        </h1>
        {/* Limão em qualquer tamanho: sobre o fundo #131A08 mede 9,08:1, muito acima
            do 4,5:1 exigido. Era a restrição do fundo antigo, não da cor. */}
        <p className="mt-7 max-w-[30ch] text-xl font-light leading-snug text-verde-limao md:text-3xl">
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
