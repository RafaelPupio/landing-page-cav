import { notFound } from 'next/navigation'
import FormularioConteudo from '@/components/editor/FormularioConteudo'

export const dynamic = 'force-dynamic'

export default function PaginaEditar() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <FormularioConteudo />
}
