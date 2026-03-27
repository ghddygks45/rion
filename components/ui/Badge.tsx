type BadgeProps = {
  variant: 'up' | 'down' | 'neutral'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    up: 'text-up',
    down: 'text-down',
    neutral: 'text-text-secondary',
  }

  return (
    <span className={`text-sm font-medium tabular-nums ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
