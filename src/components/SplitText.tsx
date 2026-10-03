import type { HTMLAttributes } from 'react'

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  text: string
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3'
  className?: string
  /** Un mot par élément animable (défaut) ou une ligne par « \n ». */
  by?: 'word' | 'line'
  [data: `data-${string}`]: string | undefined
}

/**
 * Découpe un texte en mots ou lignes masqués pour les révélations GSAP
 * (cibles : `.split-inner`). Le texte complet reste lisible par les lecteurs d’écran.
 */
export default function SplitText({ text, as = 'span', className, by = 'word', ...rest }: Props) {
  const Tag = as as 'span'
  const parts = by === 'line' ? text.split('\n') : text.split(' ')
  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      {parts.map((part, i) =>
        by === 'line' ? (
          <span key={i} className="split-line" aria-hidden>
            <span className="split-inner">{part}</span>
          </span>
        ) : (
          <span key={i} aria-hidden>
            <span className="split-word">
              <span className="split-inner">{part}</span>
            </span>
            {i < parts.length - 1 ? ' ' : null}
          </span>
        ),
      )}
    </Tag>
  )
}
