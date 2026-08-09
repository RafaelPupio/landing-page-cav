import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { siteSchema } from '@/content/schema'

const ARQUIVO = path.join(process.cwd(), 'content', 'site.json')

function apenasEmDesenvolvimento(): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 })
  }
  return null
}

export async function GET() {
  const bloqueio = apenasEmDesenvolvimento()
  if (bloqueio) return bloqueio

  const conteudo = await readFile(ARQUIVO, 'utf8')
  return NextResponse.json(JSON.parse(conteudo))
}

export async function PUT(request: Request) {
  const bloqueio = apenasEmDesenvolvimento()
  if (bloqueio) return bloqueio

  const enviado = await request.json()
  const resultado = siteSchema.safeParse(enviado)

  if (!resultado.success) {
    return NextResponse.json(
      { erros: resultado.error.issues.map((i) => `${i.path.join('.')} — ${i.message}`) },
      { status: 422 },
    )
  }

  await writeFile(ARQUIVO, `${JSON.stringify(resultado.data, null, 2)}\n`, 'utf8')
  return NextResponse.json({ ok: true })
}
