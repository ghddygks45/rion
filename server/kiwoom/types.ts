// ka90001 응답 타입

import { StringFilter } from "@/lib/generated/prisma/commonInputTypes";

// 테마 그룹별 요청
export type KiwoomThemeGroup = {
  thema_grp_cd: string;
  thema_nm: string;
  stk_num: string;
  flu_sig: string;
  flu_rt: string;
  rising_stk_num: string;
  fall_stk_num: string;
  dt_prft_rt: string;
  main_stk: string;
};

export type Ka90001Response = {
  thema_grp: KiwoomThemeGroup[];
  return_code: number;
  return_msg: string;
};

// ka90002 응답 타입
// 테마 그룹별 요청
export type KiwoomThemeStock = {
  stk_cd: string;
  stk_nm: string;
  cur_prc: string;
  flu_sig: string;
  pred_pre: string;
  flu_rt: string;
  acc_trde_qty: string;
  sel_bid: string;
  sel_req: string;
  buy_bid: string;
  buy_req: string;
  dt_prft_rt_n: string;
  trade_prica?: string | undefined;
};

export type Ka90002Response = {
  thema_comp_stk: KiwoomThemeStock[];
  flu_rt: string;
  dt_prft_rt: string;
  return_code: number;
  return_msg: string;
};

export type topVolume = {
  stk_cd: string;
  now_rank: string;
  pred_rank: string;
  stk_nm: string;
  cur_prc: string;
  pred_pre_sig: string;
  pred_pre: string;
  flu_rt: string;
  sel_bid: string;
  buy_bid: string;
  now_trde_qty: string;
  pred_trde_qty: string;
  trde_prica: string;
};

export type topVolumeResponse = {
  trde_prica_upper: topVolume[];
  return_code: number;
  return_msg: string;
};

// 종목정보 조회
export type Ka10100Response = {
  code: number;
  name: string;
  listCount: string;
  auditInfo: string;
  regDay: string;
  lastPrice: string;
  state: string;
  marketCode: string;
  marketName: string;
  upName: string;
  upSizeName: string;
  companyClassName: string;
  orderWarning: string;
  nxtEnable: string;
  return_code: number;
  return_msg: string;
};

// 키움 데이터 받아와서 새로운 형태로 가공하기 위한 타입
export type KiwoomThemeGroupWithStocks = KiwoomThemeGroup & {
  stocks: KiwoomThemeStock[];
};

// 종목정보상세 (일별 거래 상세)
export type DailyTradeDetail = {
  dt: string;
  close_pric: string;
  pred_pre_sig: string;
  pred_pre: string;
  flu_rt: string;
  trde_qty: string;
  trde_prica: string;

  bf_mkrt_trde_qty: string;
  bf_mkrt_trde_wght: string;
  opmr_trde_qty: string;
  opmr_trde_wght: string;
  af_mkrt_trde_qty: string;
  af_mkrt_trde_wght: string;

  tot_3: string;
  prid_trde_qty: string;

  cntr_str: string;

  for_poss: string;
  for_wght: string;
  for_netprps: string;
  orgn_netprps: string;
  ind_netprps: string;
  frgn: string;

  crd_remn_rt: string;
  prm: string;

  bf_mkrt_trde_prica: string;
  bf_mkrt_trde_prica_wght: string;
  opmr_trde_prica: string;
  opmr_trde_prica_wght: string;
  af_mkrt_trde_prica: string;
  af_mkrt_trde_prica_wght: string;
};

export type Ka10015Response = {
  daly_trde_dtl: DailyTradeDetail[];
};

export type PopularStockResponse = {
  item_inq_rank: PopularStock[];
};

export type PopularStock = {
  stk_nm: string; // 종목명
  bigd_rank: string; // 조회순위
  rank_chg: string; // 순위변동
  rank_chg_sign: string; // 순위변동부호
  past_curr_prc: string; // 현재가
  base_comp_sign: string; // 기준가대비부호
  base_comp_chgr: string; // 기준가대비등락률
  prev_base_sign: string; // 전일대비부호
  prev_base_chgr: string; // 전일대비등락률
  dt: string; // 날짜
  tm: string; // 시간
  stk_cd: string; // 종목코드
};

export type TopChangeRateStockResponse = {
  limitUp: topChangeRateStock[]; // 상한가
  topRate: topChangeRateStock[]; // 등락률 상위
  updown_pric: topChangeRateStock[];
};

export type topChangeRateStock = {
  stk_cd: string; // 종목코드
  stk_infr: string; // 종목정보
  stk_nm: string; // 종목명
  cur_prc: string; // 현재가
  pred_pre_sig: string; // 전일대비부호
  pred_pre: string; // 전일대비
  flu_rt: string; // 등락률
  trde_qty: string; // 거래량
  pred_trde_qty: string; // 예상거래량
  sel_req: string; // 매도잔량
  sel_bid: string; // 매도호가
  buy_bid: string; // 매수호가
  buy_req: string; // 매수잔량
  cnt: string; // 건수
};

export type topProgramBuysResponse = {
  kospiProgramBuys: topProgramBuys[];
  kosdaqProgramBuys: topProgramBuys[];
  prm_netprps_upper_50: topProgramBuys[];
};

export type topProgramBuys = {
  rank: string; // 순위
  stk_cd: string; // 종목코드
  stk_nm: string; // 종목명
  cur_prc: string; // 현재가
  flu_sig: string; // 등락기호
  pred_pre: string; // 전일대비
  flu_rt: string; // 등락율
  acc_trde_qty: string; // 누적거래량
  prm_sell_amt: string; // 프로그램매도금액
  prm_buy_amt: string; // 프로그램매수금액
  prm_netprps_amt: string; // 프로그램순매수금액
};
