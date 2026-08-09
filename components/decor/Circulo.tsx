const TAMANHOS = { sm: 16, md: 32, lg: 56 } as const
const CORES = {
  escuro: 'var(--verde-escuro)',
  limao: 'var(--verde-limao)',
  creme: 'var(--creme)',
} as const

export default function Circulo({
  tamanho,
  cor,
  className = '',
}: {
  tamanho: keyof typeof TAMANHOS
  cor: keyof typeof CORES
  className?: string
}) {
  const d = TAMANHOS[tamanho]
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill={CORES[cor]} />
    </svg>
  )
}
