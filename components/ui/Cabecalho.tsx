import Image from 'next/image'
import FaixaServico from '@/components/ui/FaixaServico'
import type { Site } from '@/content/schema'

/**
 * Cabeçalho fixo, translúcido, com no máximo cinco âncoras e o botão de visita
 * sempre à mão. No celular os links vivem dentro de um <details> — menu sem
 * JavaScript, que abre pelo teclado e não quebra se a hidratação falhar.
 */
export default function Cabecalho({
  cabecalho,
  faixa,
  nome,
  emblema,
}: {
  cabecalho: Site['cabecalho']
  faixa: Site['faixaServico']
  nome: string
  emblema: string
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-creme/10 bg-fundo/85 backdrop-blur-lg">
      <FaixaServico faixa={faixa} />

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <a href="#inicio" className="flex items-center gap-2.5 rounded focus-visible:anel-de-foco">
          {emblema && (
            <Image src={emblema} alt="" width={452} height={377} className="h-8 w-auto" priority />
          )}
          <span className="text-sm font-bold uppercase leading-tight tracking-tight text-creme">
            {nome}
          </span>
        </a>

        <nav aria-label="Seções do site" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {cabecalho.itens.map((item, i) => (
              <li key={i}>
                <a
                  href={item.ancora}
                  className="text-creme/90 underline-offset-8 transition hover:text-creme hover:underline focus-visible:anel-de-foco"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={cabecalho.ctaAncora}
          className="hidden shrink-0 rounded-full bg-creme px-5 py-2.5 text-sm font-semibold text-verde-escuro transition hover:opacity-90 focus-visible:anel-de-foco md:inline-block"
        >
          {cabecalho.ctaTexto}
        </a>

        <details className="relative md:hidden">
          <summary
            className="flex cursor-pointer list-none items-center rounded p-2 focus-visible:anel-de-foco [&::-webkit-details-marker]:hidden"
            aria-label={cabecalho.menuRotulo}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <ul className="absolute right-0 z-10 mt-3 w-56 rounded-2xl border border-creme/20 bg-superficie p-2 text-sm font-medium shadow-xl">
            {cabecalho.itens.map((item, i) => (
              <li key={i}>
                <a
                  href={item.ancora}
                  className="block rounded-xl px-4 py-3 text-creme/90 hover:bg-creme/10 focus-visible:anel-de-foco"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </header>
  )
}
