import { StockDetail } from './types'

const marketIndices = [
  { name: 'KOSPI', value: 2543.12, changeRate: 0.82 },
  { name: 'KOSDAQ', value: 733.45, changeRate: 1.21 },
  { name: '나스닥', value: 18230.14, changeRate: -0.31 },
  { name: 'S&P500', value: 5614.56, changeRate: -0.12 },
  { name: '유가(WTI)', value: 82.34, changeRate: 0.51 },
  { name: '금', value: 2341.20, changeRate: 0.23 },
]

export const mockStockDetails: StockDetail[] = [
  {
    ticker: '005930',
    name: '삼성전자',
    price: 73400,
    changeRate: 2.45,
    signals: ['52주 신고가'],
    supply: { institution: 234, foreign: -128 },
    marketIndices,
    news: [
      { title: '삼성전자, 2분기 HBM 출하량 역대 최대 전망', date: '2026.04.07' },
      { title: '외국인 8거래일 연속 순매도 전환', date: '2026.04.06' },
      { title: '삼성전자, 파운드리 수율 개선으로 수익성 회복 기대', date: '2026.04.05' },
    ],
  },
  {
    ticker: '000660',
    name: 'SK하이닉스',
    price: 189500,
    changeRate: 3.12,
    signals: ['이상 거래량'],
    supply: { institution: 512, foreign: 341 },
    marketIndices,
    news: [
      { title: 'SK하이닉스, 엔비디아향 HBM3E 공급 확대 합의', date: '2026.04.07' },
      { title: 'HBM 수요 급증…SK하이닉스 목표주가 상향', date: '2026.04.06' },
      { title: 'SK하이닉스 청주 M15X 공장 풀가동 돌입', date: '2026.04.05' },
    ],
  },
  {
    ticker: '373220',
    name: 'LG에너지솔루션',
    price: 412000,
    changeRate: 2.21,
    signals: ['이상 거래량'],
    supply: { institution: 187, foreign: -56 },
    marketIndices,
    news: [
      { title: 'IRA 보조금 재개…LG엔솔 수혜 기대', date: '2026.04.07' },
      { title: 'LG에너지솔루션, GM과 배터리 공급 계약 연장', date: '2026.04.06' },
      { title: '2분기 실적 기대감에 외국인 매수세 유입', date: '2026.04.05' },
    ],
  },
  {
    ticker: '079550',
    name: 'LIG넥스원',
    price: 218000,
    changeRate: 4.31,
    signals: ['52주 신고가', '이상 거래량'],
    supply: { institution: 423, foreign: 289 },
    marketIndices,
    news: [
      { title: 'LIG넥스원, 중동향 미사일 계약 5천억 규모 체결', date: '2026.04.07' },
      { title: 'NATO 국방비 증액…LIG넥스원 수혜 본격화', date: '2026.04.06' },
      { title: 'LIG넥스원, 52주 신고가 경신…목표주가 30만원 상향', date: '2026.04.05' },
    ],
  },
]
