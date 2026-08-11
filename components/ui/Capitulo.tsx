import type { ReactNode } from 'react'

export default function Capitulo({
  id,
  rotulo,
  titulo,
  children,
}: {
  id: string
  rotulo: string
  titulo: string
  children: ReactNode
}) {
  return (
    <section id={id} className="relative scroll-mt-12 pb-16">
      <span
        aria-hidden="true"
        className="absolute -left-8 top-2 block h-3 w-3 rounded-full bg-verde-limao md:-left-10"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-verde-limao">{rotulo}</p>
      <h2 className="mt-2 text-2xl font-bold uppercase leading-tight text-verde-limao md:text-3xl">
        {titulo}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
