export type Signal = '52주 신고가' | '이상 거래량' | '52주 신저가'

export type MarketIndex = {
  name: string
  value: number
  changeRate: number
}

export type Supply = {
  institution: number
  foreign: number
}

export type StockDetail = {
  ticker: string
  name: string
  price: number
  changeRate: number
  signals: Signal[]
  supply: Supply
  marketIndices: MarketIndex[]
  news: { title: string; date: string }[]
}
