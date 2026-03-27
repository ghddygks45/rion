type TitleProps = {
  level?: 1 | 2 | 3
  children: React.ReactNode
  className?: string
}

const styles = {
  1: 'text-xl font-bold text-text',
  2: 'text-base font-semibold text-text',
  3: 'text-sm font-medium text-text-secondary',
}

export default function Title({ level = 2, children, className = '' }: TitleProps) {
  return (
    <span className={`${styles[level]} ${className}`}>
      {children}
    </span>
  )
}
