'use client'

import { useTheme } from '@/lib/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface text-text-secondary cursor-pointer hover:text-text"
    >
      {theme === 'dark' ? '라이트' : '다크'}
    </button>
  )
}
