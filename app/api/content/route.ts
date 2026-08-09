import { randomUUID } from 'node:crypto'
import { readFile, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { ehDesenvolvimento } from '@/lib/ambiente'
import { siteSchema } from '@/content/schema'

const ARQUIVO = path.join(process.cwd(), 'content', 'site.json')

function bloqueioForaDeDesenvolvimento(): NextResponse | null {
  return ehDesenvolvimento() ? null : new NextResponse(null, { status: 404 })
}

/**
 * Grava `conteudo` em `caminho` de forma atômica: escreve num arquivo
 * temporário no mesmo diretório e troca por cima com `rename` (atômico no
 * mesmo sistema de arquivos). Se o processo morrer no meio da escrita, o
 * `content/site.json` original permanece intacto — nunca fica truncado.
 * Sem isso, `content/load.ts` (que importa esse JSON estaticamente) passaria
 * a falhar com um erro de parse pouco óbvio no próximo `npm run dev`/`build`.
 */
async function gravarAtomico(caminho: string, conteudo: string) {
  const temporario = path.join(path.dirname(caminho), `.${path.basename(caminho)}.${randomUUID()}.tmp`)
  try {
    await writeFile(temporario, conteudo, 'utf8')
    await rename(temporario, caminho)
  } catch (erro) {
    await unlink(temporario).catch(() => {})
    throw erro
  }
}

export async function GET() {
  const bloqueio = bloqueioForaDeDesenvolvimento()
  if (bloqueio) return bloqueio

  const conteudo = await readFile(ARQUIVO, 'utf8')

  let bruto: unknown
  try {
    bruto = JSON.parse(conteudo)
  } catch {
    return NextResponse.json(
      { erro: 'O arquivo content/site.json não é um JSON válido. Corrija-o manualmente antes de usar o editor.' },
      { status: 500 },
    )
  }

  const resultado = siteSchema.safeParse(bruto)
  if (!resultado.success) {
    return NextResponse.json(
      {
        erro: 'O arquivo content/site.json está com o conteúdo inválido e não pode ser aberto no editor.',
        erros: resultado.error.issues.map((i) => `${i.path.join('.')} — ${i.message}`),
      },
      { status: 500 },
    )
  }

  return NextResponse.json(resultado.data)
}

export async function PUT(request: Request) {
  const bloqueio = bloqueioForaDeDesenvolvimento()
  if (bloqueio) return bloqueio

  const enviado = await request.json()
  const resultado = siteSchema.safeParse(enviado)

  if (!resultado.success) {
    return NextResponse.json(
      { erros: resultado.error.issues.map((i) => `${i.path.join('.')} — ${i.message}`) },
      { status: 422 },
    )
  }

  try {
    await gravarAtomico(ARQUIVO, `${JSON.stringify(resultado.data, null, 2)}\n`)
  } catch {
    return NextResponse.json(
      { erros: ['Não foi possível salvar content/site.json no disco. Tente novamente.'] },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
