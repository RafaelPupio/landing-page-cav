import type { ReactNode } from 'react'

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-creme/35 px-4 py-2 text-sm text-creme">
      {children}
    </li>
  )
}
