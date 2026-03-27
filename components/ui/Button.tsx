type ButtonProps = {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  className = '',
}: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-accent text-white',
    secondary: 'bg-surface border border-border text-text',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
