const CAMINHOS: Record<number, string> = {
  1: 'M154 12c48 8 92 40 106 88 14 48-2 112-44 148-42 36-110 44-158 20C10 244-8 190 3 140 14 90 50 42 92 22c20-10 42-14 62-10Z',
  2: 'M180 6c40 22 62 76 54 128-8 52-46 102-96 118-50 16-112 0-142-40-30-40-28-108 4-152C32 16 88-6 128 2c18 4 36 0 52 4Z',
  3: 'M120 0c62 0 118 52 128 116 10 64-26 132-84 156-58 24-138 4-158-56C-14 156 6 76 56 32 76 14 98 0 120 0Z',
}

export default function Blob({
  variante,
  className = '',
}: {
  variante: 1 | 2 | 3
  className?: string
}) {
  return (
    <svg viewBox="0 0 260 280" aria-hidden="true" focusable="false" className={className}>
      <path d={CAMINHOS[variante]} fill="currentColor" />
    </svg>
  )
}
