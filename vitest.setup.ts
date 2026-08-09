import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// next/font/google baixa e otimiza a fonte via loader do bundler do Next (Webpack/
// Turbopack) em tempo de build — fora dele (aqui, sob Vitest puro) `Poppins` nem é
// uma função. app/layout.tsx é o único lugar do projeto que importa next/font/google;
// mock mínimo para poder importar `metadata` de lá nos testes de SEO sem precisar do
// pipeline de build do Next.
vi.mock('next/font/google', () => ({
  Poppins: () => ({ variable: 'font-poppins-mock' }),
}))
