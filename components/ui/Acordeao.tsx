'use client'

import { useState, type ReactNode } from 'react'

export type ItemAcordeao = {
  id: string
  titulo: string
  conteudo: ReactNode
}

export default function Acordeao({ itens }: { itens: ItemAcordeao[] }) {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <div className="divide-y divide-creme/20 border-y border-creme/20">
      {itens.map((item) => {
        const estaAberto = aberto === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`gatilho-${item.id}`}
                aria-expanded={estaAberto}
                aria-controls={`painel-${item.id}`}
                onClick={() => setAberto(estaAberto ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
              >
                {item.titulo}
                <span aria-hidden="true" className="text-2xl leading-none text-verde-limao">
                  {estaAberto ? '−' : '+'}
                </span>
              </button>
            </h3>
            {estaAberto && (
              <div
                role="region"
                id={`painel-${item.id}`}
                aria-labelledby={`gatilho-${item.id}`}
                className="pb-8"
              >
                {item.conteudo}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
