import { notFound } from 'next/navigation'
import { ehDesenvolvimento } from '@/lib/ambiente'
import FormularioConteudo from '@/components/editor/FormularioConteudo'

export const dynamic = 'force-dynamic'

export default function PaginaEditar() {
  if (!ehDesenvolvimento()) notFound()
  return <FormularioConteudo />
}
