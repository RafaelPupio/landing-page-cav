import type { ReactNode } from 'react'

export default function Trilha({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-10 md:px-10">
      <div
        aria-hidden="true"
        className="absolute left-[1.6rem] top-14 bottom-14 w-px bg-gradient-to-b from-verde-limao via-verde-limao/60 to-transparent md:left-[2.6rem]"
      />
      <div className="pl-8 md:pl-10">{children}</div>
    </div>
  )
}
