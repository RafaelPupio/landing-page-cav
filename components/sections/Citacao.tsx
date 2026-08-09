import type { Site } from '@/content/schema'

export default function Citacao({ citacao }: { citacao: Site['citacao'] }) {
  return (
    <section className="px-6 py-12">
      <blockquote className="mx-auto max-w-3xl text-2xl font-bold leading-snug text-verde-limao md:text-4xl">
        {citacao.texto}
      </blockquote>
    </section>
  )
}
