'use client'

import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Title from '@/components/ui/Title'
import StockTable from '@/components/ui/StockTable'
import { Theme } from '../types'

type ThemeCardProps = {
  theme: Theme
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  const router = useRouter()
  const variant = theme.avgChangeRate > 0 ? 'up' : theme.avgChangeRate < 0 ? 'down' : 'neutral'
  const sign = theme.avgChangeRate > 0 ? '+' : ''

  return (
    <Card>
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/theme/${theme.id}`)}
      >
        <div className="flex items-center justify-between mb-2">
          <Title level={2}>{theme.name}</Title>
          <Badge variant={variant}>{sign}{theme.avgChangeRate.toFixed(2)}%</Badge>
        </div>
        <p className="text-sm text-text-secondary mb-4">{theme.summary}</p>
      </div>
      <StockTable stocks={theme.stocks} />
    </Card>
  )
}
