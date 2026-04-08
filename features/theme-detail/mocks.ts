import { ThemeDetail } from './types'

export const mockThemeDetails: ThemeDetail[] = [
  {
    id: 'semiconductor',
    name: '반도체',
    summary: 'AI 수혜 기대감에 메모리 반도체 전 종목 강세, 외국인 순매수 집중',
    avgChangeRate: 2.41,
    news: [
      { title: '삼성전자, 2분기 HBM 출하량 역대 최대 전망', date: '2026.04.07' },
      { title: 'SK하이닉스, 엔비디아향 HBM3E 공급 확대 합의', date: '2026.04.06' },
      { title: '한미반도체 "TC본더 수주 잔고 1조 돌파"', date: '2026.04.05' },
    ],
    stocks: [
      { name: '삼성전자', price: 73400, changeRate: 2.45, volume: 4320000000, href: '/stock/005930', signal: '52주 신고가' },
      { name: 'SK하이닉스', price: 189500, changeRate: 3.12, volume: 2100000000, href: '/stock/000660', signal: '이상 거래량' },
      { name: '한미반도체', price: 94200, changeRate: 1.67, volume: 980000000, href: '/stock/042700' },
    ],
  },
  {
    id: 'ev-battery',
    name: '2차전지',
    summary: '미국 IRA 보조금 지급 재개 소식에 배터리 셀·소재 동반 상승',
    avgChangeRate: 1.83,
    news: [
      { title: 'IRA 보조금 재개…LG엔솔·삼성SDI 수혜 기대', date: '2026.04.07' },
      { title: '에코프로비엠, 양극재 수출 계약 1.2조 체결', date: '2026.04.06' },
      { title: 'POSCO홀딩스, 리튬 생산량 목표치 상향 조정', date: '2026.04.05' },
    ],
    stocks: [
      { name: 'LG에너지솔루션', price: 412000, changeRate: 2.21, volume: 1540000000, href: '/stock/373220', signal: '이상 거래량' },
      { name: '삼성SDI', price: 318000, changeRate: 1.58, volume: 870000000, href: '/stock/006400' },
      { name: '에코프로비엠', price: 142500, changeRate: 1.72, volume: 630000000, href: '/stock/247540', signal: '52주 신고가' },
      { name: 'POSCO홀딩스', price: 387000, changeRate: 1.80, volume: 520000000, href: '/stock/005490' },
    ],
  },
  {
    id: 'defense',
    name: '방산',
    summary: '유럽 재무장 수요 확대 및 중동 긴장 고조로 방산주 전반 강세',
    avgChangeRate: 3.27,
    news: [
      { title: '유럽 NATO 국방비 증액 확정…K방산 수혜 본격화', date: '2026.04.07' },
      { title: '한화에어로, 폴란드 추가 수주 협상 마무리 단계', date: '2026.04.06' },
      { title: 'LIG넥스원, 중동향 미사일 계약 5천억 규모 체결', date: '2026.04.05' },
    ],
    stocks: [
      { name: 'LIG넥스원', price: 218000, changeRate: 4.31, volume: 760000000, href: '/stock/079550', signal: '52주 신고가' },
      { name: '한화에어로스페이스', price: 342000, changeRate: 3.05, volume: 1120000000, href: '/stock/012450', signal: '이상 거래량' },
      { name: '현대로템', price: 67400, changeRate: 2.44, volume: 430000000, href: '/stock/064350' },
    ],
  },
  {
    id: 'ai-data-center',
    name: 'AI·데이터센터',
    summary: '빅테크 AI 투자 확대 발표 이후 서버·전력·냉각 관련주 동반 급등',
    avgChangeRate: -0.92,
    news: [
      { title: '마이크로소프트, AI 데이터센터 투자 100조 발표', date: '2026.04.07' },
      { title: '국내 전력 인프라 수요 급증…두산에너빌 주목', date: '2026.04.06' },
      { title: 'SK텔레콤, AI 데이터센터 운영 사업 본격 진출', date: '2026.04.05' },
    ],
    stocks: [
      { name: 'SK텔레콤', price: 51800, changeRate: -1.24, volume: 340000000, href: '/stock/017670' },
      { name: '두산에너빌리티', price: 24350, changeRate: -0.61, volume: 290000000, href: '/stock/034020', signal: '이상 거래량' },
      { name: '서진시스템', price: 38700, changeRate: -0.90, volume: 180000000, href: '/stock/178320' },
    ],
  },
]
