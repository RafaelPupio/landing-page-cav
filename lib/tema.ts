import type { CSSProperties } from 'react'
import type { Tema } from '@/content/schema'

export function variaveisDeTema(tema: Tema): CSSProperties {
  return {
    '--verde-escuro': tema.verdeEscuro,
    '--verde-limao': tema.verdeLimao,
    '--creme': tema.creme,
    '--grafite': tema.grafite,
    '--fundo': tema.fundo,
    '--superficie': tema.superficie,
  } as CSSProperties
}
