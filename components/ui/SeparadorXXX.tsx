export default function SeparadorXXX() {
  return (
    <svg
      width="72"
      height="20"
      viewBox="0 0 72 20"
      aria-hidden="true"
      focusable="false"
      className="mx-auto my-10 text-verde-limao"
    >
      {[6, 28, 50].map((x) => (
        <g key={x} stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <line x1={x} y1="4" x2={x + 14} y2="16" />
          <line x1={x + 14} y1="4" x2={x} y2="16" />
        </g>
      ))}
    </svg>
  )
}
