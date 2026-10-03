export default function SectionLabel({ index, label, className = '' }: { index: string; label: string; className?: string }) {
  return (
    <p className={`meta flex items-center gap-4 ${className}`}>
      <span className="text-bone">{index}</span>
      <span data-line className="h-px w-12 origin-left bg-bone/30" />
      {label}
    </p>
  )
}
