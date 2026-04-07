import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-border bg-surface">
      <Link href="/" className="text-primary font-bold text-lg tracking-tight">RION</Link>
      <ThemeToggle />
    </header>
  )
}
