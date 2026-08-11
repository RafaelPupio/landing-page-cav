'use client'

import { useEffect, useState } from 'react'

/**
 * Logo animado do hero, sobre fundo preto no arquivo — por isso mix-blend-screen:
 * o preto some e sobra só o brilho da árvore sobre o verde da página.
 *
 * Quem configurou o sistema para reduzir animações não vê o vídeo E não o baixa:
 * o src só é montado depois de confirmar a preferência no cliente. Esconder por
 * CSS economizaria código e gastaria 820 KB do plano de dados de quem pediu menos
 * movimento — que é justamente quem tende a estar num aparelho mais modesto.
 */
export default function LogoAnimado({ src }: { src: string }) {
  const [podeAnimar, setPodeAnimar] = useState(false)

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => setPodeAnimar(!consulta.matches)
    aplicar()
    consulta.addEventListener('change', aplicar)
    return () => consulta.removeEventListener('change', aplicar)
  }, [])

  if (!podeAnimar) return null

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none absolute left-1/2 top-1/2 min-h-[120%] min-w-[120%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-80 mix-blend-screen"
    />
  )
}
