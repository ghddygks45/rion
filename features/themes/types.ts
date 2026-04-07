import { StockRow } from '@/components/ui/StockTable'

export type Theme = {
  id: string
  name: string
  summary: string
  avgChangeRate: number
  stocks: StockRow[]
}
