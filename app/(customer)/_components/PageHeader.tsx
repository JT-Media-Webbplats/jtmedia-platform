import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  description?: string
  aside?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, aside }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="font-bakerie text-brand-green-dark text-base mb-1.5 tracking-wide">{eyebrow}</p>}
        <h1 className="font-playfair font-black text-3xl md:text-4xl text-black">{title}</h1>
        {description && <p className="text-black/50 text-sm mt-2 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {aside}
    </div>
  )
}
