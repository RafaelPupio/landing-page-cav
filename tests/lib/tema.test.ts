import { describe, expect, it } from 'vitest'
import { variaveisDeTema } from '@/lib/tema'

describe('variaveisDeTema', () => {
  it('converte os tokens em custom properties CSS', () => {
    const estilo = variaveisDeTema({
      verdeEscuro: '#44581A',
      verdeLimao: '#A3C63C',
      creme: '#F7F5EC',
      grafite: '#1F1F1C',
    })
    expect(estilo).toEqual({
      '--verde-escuro': '#44581A',
      '--verde-limao': '#A3C63C',
      '--creme': '#F7F5EC',
      '--grafite': '#1F1F1C',
    })
  })
})
