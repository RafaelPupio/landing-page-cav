'use client'

import { useEffect, useState } from 'react'

type Valor = string | number | boolean | null | Valor[] | { [k: string]: Valor }

function achatar(objeto: Valor, prefixo = ''): [string, string][] {
  if (typeof objeto !== 'object' || objeto === null) return [[prefixo, String(objeto)]]
  return Object.entries(objeto).flatMap(([chave, valor]) =>
    achatar(valor as Valor, prefixo ? `${prefixo}.${chave}` : chave),
  )
}

function definir(alvo: Record<string, unknown>, caminho: string, valor: string) {
  const partes = caminho.split('.')
  let atual: Record<string, unknown> = alvo
  for (const parte of partes.slice(0, -1)) {
    atual = atual[parte] as Record<string, unknown>
  }
  atual[partes[partes.length - 1]] = valor
}

export default function FormularioConteudo() {
  const [conteudo, setConteudo] = useState<Record<string, unknown> | null>(null)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then(setConteudo)
  }, [])

  if (!conteudo) return <p className="p-8">Carregando…</p>

  const campos = achatar(conteudo as Valor)

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const copia = structuredClone(conteudo) as Record<string, unknown>
    for (const [caminho, valor] of dados.entries()) {
      definir(copia, caminho, String(valor))
    }
    const resposta = await fetch('/api/content', { method: 'PUT', body: JSON.stringify(copia) })
    const corpo = await resposta.json()
    setMensagem(resposta.ok ? 'Salvo.' : `Erros: ${corpo.erros.join(' | ')}`)
  }

  return (
    <form onSubmit={salvar} className="mx-auto max-w-3xl space-y-4 bg-creme p-8 text-grafite">
      <h1 className="text-2xl font-bold">Editar conteúdo do site</h1>
      {campos.map(([caminho, valor]) => (
        <label key={caminho} className="block">
          <span className="block font-mono text-xs text-grafite/70">{caminho}</span>
          <textarea
            name={caminho}
            defaultValue={valor}
            rows={valor.length > 120 ? 5 : 1}
            className="w-full rounded border border-grafite/30 p-2 text-sm"
          />
        </label>
      ))}
      <button type="submit" className="rounded-full bg-verde-escuro px-6 py-3 font-semibold text-creme">
        Salvar
      </button>
      {mensagem && <p role="status">{mensagem}</p>}
    </form>
  )
}
