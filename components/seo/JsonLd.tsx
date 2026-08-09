export default function JsonLd({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify não escapa "<". Se algum campo de texto livre contiver
      // "</script>", a tag fecharia antes da hora e o resto viraria HTML
      // interpretado pelo navegador. Trocar "<" pela sequência de escape
      // Unicode equivalente é a forma recomendada pela própria documentação
      // do Next.js para JSON-LD — o JSON continua válido, pois essa
      // sequência e "<" são a mesma coisa para qualquer parser JSON.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, '\\u003c') }}
    />
  )
}
