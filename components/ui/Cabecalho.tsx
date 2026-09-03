import Image from 'next/image'
import FaixaServico from '@/components/ui/FaixaServico'
import MenuCelular from '@/components/ui/MenuCelular'
import type { Site } from '@/content/schema'

/**
 * Cabeçalho fixo, translúcido, com no máximo cinco âncoras e o botão de visita
 * sempre à mão. No celular os links vivem no MenuCelular, que continua sendo um
 * <details> nativo — abre pelo teclado e funciona antes da hidratação.
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

        <MenuCelular itens={cabecalho.itens} rotulo={cabecalho.menuRotulo} />
      </div>
    </header>
  )
}
