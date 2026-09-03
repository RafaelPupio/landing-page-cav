'use client'

import { useEffect, useRef, useState } from 'react'
import type { Site } from '@/content/schema'

/**
 * Menu do celular. Continua sendo um <details> — antes da hidratação ele abre e
 * fecha sozinho, sem JavaScript. O que o componente acrescenta é o fechamento:
 * ao escolher um item, ao apertar Esc, e ao tocar fora.
 *
 * Sem isso o menu ficava aberto por cima da seção recém-escolhida, escondendo
 * justamente o que a pessoa acabou de pedir para ver.
 */
export default function MenuCelular({
  itens,
  rotulo,
}: {
  itens: Site['cabecalho']['itens']
  rotulo: string
}) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (!aberto) return

    const aoTocarFora = (evento: PointerEvent) => {
      if (!ref.current?.contains(evento.target as Node)) setAberto(false)
    }
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      setAberto(false)
      // Devolve o foco ao botão: quem navega por teclado não pode ser deixado
      // sem ponto de partida depois de fechar o menu.
      ref.current?.querySelector('summary')?.focus()
    }

    document.addEventListener('pointerdown', aoTocarFora)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('pointerdown', aoTocarFora)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  return (
    <details
      ref={ref}
      open={aberto}
      onToggle={(evento) => setAberto(evento.currentTarget.open)}
      className="relative md:hidden"
    >
      <summary
        aria-label={rotulo}
        className="flex cursor-pointer list-none items-center rounded p-2 focus-visible:anel-de-foco [&::-webkit-details-marker]:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d={aberto ? 'M6 6l12 12M18 6L6 18' : 'M3 6h18M3 12h18M3 18h18'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <ul className="absolute right-0 z-10 mt-3 w-56 rounded-2xl border border-creme/20 bg-superficie p-2 text-sm font-medium shadow-xl">
        {itens.map((item, i) => (
          <li key={i}>
            <a
              href={item.ancora}
              onClick={() => setAberto(false)}
              className="block rounded-xl px-4 py-3 text-creme/90 hover:bg-creme/10 focus-visible:anel-de-foco"
            >
              {item.rotulo}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
