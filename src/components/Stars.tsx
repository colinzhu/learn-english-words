import { Icon } from './Icon'

export function Stars({
  value,
  max = 3,
  size = 18,
  showEmpty = true,
  className,
}: {
  value: number
  max?: number
  size?: number
  showEmpty?: boolean
  className?: string
}) {
  return (
    <span
      className={`stars ${className ?? ''}`}
      role="img"
      aria-label={`${value} / ${max} 颗星`}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = index < value
        if (!filled && !showEmpty) return null
        return (
          <span key={index} className={`star ${filled ? 'star--filled' : 'star--empty'}`}>
            <Icon name="star" size={size} />
          </span>
        )
      })}
    </span>
  )
}

export function StarBurst({ count }: { count: number }) {
  return (
    <span className="star-burst" aria-hidden="true">
      {Array.from({ length: Math.min(count, 5) }, (_, index) => (
        <Icon key={index} name="star" size={16 + (index % 3) * 5} />
      ))}
    </span>
  )
}
