'use client'

import { useTheme } from '@/lib/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary cursor-pointer hover:text-text"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-transform duration-300 ${isDark ? 'rotate-0' : '-rotate-90'}`}
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <path
              d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  )
}
