// 테마그룹별요청(ka90001)
export type KiwoomThemeGroup = {
  thema_grp_cd: string; // 테마코드
  thema_nm: string; // 테마명
  stk_num: string; // 종목수
  flu_sig: string; // 등락기호
  flu_rt: string; // 등락률
  rising_stk_num: string; // 상승종목수
  fall_stk_num: string; // 하락종목수
  dt_prft_rt: string; // 기간수익률
  main_stk: string; // 주요종목
};

export type KiwoomThemeGroupResponse = {
  thema_grp: KiwoomThemeGroup[];
  return_code: number;
  return_msg: string;
};

// 테마구성종목요청(ka90002)
export type KiwoomThemeStock = {
  stk_cd: string; // 종목코드
  stk_nm: string; // 종목명
  cur_prc: string; // 현재가
  flu_sig: string; // 등락기호
  pred_pre: string; // 전일대비
  flu_rt: string; // 등락율
  acc_trde_qty: string; // 누적거래량
  sel_bid: string; // 매도호가
  sel_req: string; // 매도잔량
  buy_bid: string; // 매수호가
  buy_req: string; // 매수잔량
  dt_prft_rt_n: string; // 기간수익률
  trade_prica?: string | undefined;
};

export type KiwoomThemeStockResponse = {
  thema_comp_stk: KiwoomThemeStock[];
  flu_rt: string;
  dt_prft_rt: string;
  return_code: number;
  return_msg: string;
};

// 거래대금상위요청(ka10032)
export type KiwoomTopVolume = {
  stk_cd: string; // 종목코드
  now_rank: string; // 현재순위
  pred_rank: string; // 전일순위
  stk_nm: string; // 종목명
  cur_prc: string; // 현재가
  pred_pre_sig: string; // 전일대비기호
  pred_pre: string; // 전일대비
  flu_rt: string; // 등락률
  sel_bid: string; // 매도호가
  buy_bid: string; // 매수호가
  now_trde_qty: string; // 현재거래량
  pred_trde_qty: string; // 전일거래량
  trde_prica: string; // 거래대금
};

export type KiwoomTopVolumeResponse = {
  trde_prica_upper: KiwoomTopVolume[];
  return_code: number;
  return_msg: string;
};

// 종목정보 조회
export type KiwoomStockInfoResponse = {
  code: number; // 종목코드
  name: string; // 종목명
  listCount: string; // 상장주식수
  auditInfo: string; // 감리구분
  regDay: string; // 상장일
  lastPrice: string; // 전일종가
  state: string; // 종목상태
  marketCode: string; // 시장구분코드
  marketName: string; // 시장명
  upName: string; // 업종명
  upSizeName: string; // 회사크기분류
  companyClassName: string; // 회사분류
  orderWarning: string; // 투자유의종목여부
  nxtEnable: string; // NXT기능여부
  return_code: number;
  return_msg: string;
};

// 종목정보 조회(ka10100)
export type KiwoomStockBasicInfoResponse = {
  code: string; // 종목코드
  name: string; // 종목명
  listCount: string; // 상장주식수
  auditInfo: string; // 감리구분
  regDay: string; // 상장일
  lastPrice: string; // 전일종가
  state: string; // 종목상태
  marketCode: string; // 시장구분코드
  marketName: string; // 시장명
  upName: string; // 업종명
  upSizeName: string; // 회사크기분류
  companyClassName: string; // 회사분류
  orderWarning: string; // 투자유의종목여부
  nxtEnable: string; // NXT기능여부
  kind: string; // 종목구분
  return_code: number;
  return_msg: string;
};

// 키움 데이터 받아와서 새로운 형태로 가공하기 위한 타입
export type KiwoomThemeGroupWithStocks = KiwoomThemeGroup & {
  stocks: KiwoomThemeStock[];
};

// 종목정보 리스트(ka10099): 코스피/코스닥 전 종목 코드+이름 마스터 조회용
export type KiwoomStockListItem = {
  code: string; // 종목코드(단축코드)
  name: string; // 종목명
  listCount: string; // 상장주식수
  auditInfo: string; // 감리구분
  regDay: string; // 상장일
  lastPrice: string; // 전일종가
  state: string; // 종목상태
  marketCode: string; // 시장구분코드
  marketName: string; // 시장명
  upName: string; // 업종명
  upSizeName: string; // 회사크기분류
  companyClassName?: string; // 회사분류(코스닥만 존재)
  orderWarning: string; // 투자유의종목여부
  nxtEnable: string; // NXT가능여부
};

export type KiwoomStockListResponse = {
  list: KiwoomStockListItem[];
  return_code: number;
  return_msg: string;
};

// 일별거래상세(ka10015)
export type KiwoomDailyTradeDetail = {
  dt: string; // 일자
  close_pric: string; // 종가
  pred_pre_sig: string; // 전일대비기호
  pred_pre: string; // 전일대비
  flu_rt: string; // 등락율
  trde_qty: string; // 거래량
  trde_prica: string; // 거래대금
  bf_mkrt_trde_qty: string; // 장전거래량
  bf_mkrt_trde_wght: string; // 장전거래비중
  opmr_trde_qty: string; // 장중거래량
  opmr_trde_wght: string; // 장중거래비중
  af_mkrt_trde_qty: string; // 장후거래량
  af_mkrt_trde_wght: string; // 장후거래비중
  tot_3: string; // 합계3
  prid_trde_qty: string; // 기간중거래량
  cntr_str: string; // 체결강도
  for_poss: string; // 외인보유
  for_wght: string; // 외인비중
  for_netprps: string; // 외인순매수
  orgn_netprps: string; // 기관순매수
  ind_netprps: string; // 개인순매수
  frgn: string; // 외국계
  crd_remn_rt: string; // 신용잔고율
  prm: string; // 프로그램
  bf_mkrt_trde_prica: string; // 장전거래대금
  bf_mkrt_trde_prica_wght: string; // 장전거래대금비중
  opmr_trde_prica: string; // 장중거래대금
  opmr_trde_prica_wght: string; // 장중거래대금비중
  af_mkrt_trde_prica: string; // 장후거래대금
  af_mkrt_trde_prica_wght: string; // 장후거래대금비중
};

export type KiwoomDailyTradeDetailResponse = {
  daly_trde_dtl: KiwoomDailyTradeDetail[];
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

// 종목일별프로그램매매추이요청(ka90013)
export type ProgramFlowItem = {
  dt: string; // 일자 (YYYYMMDD)
  cur_prc: string; // 현재가 (원)
  pre_sig: string; // 대비기호
  pred_pre: string; // 전일대비 (원)
  flu_rt: string; // 등락율 (%)
  trde_qty: string; // 거래량 (1주 단위)
  prm_sell_amt: string; // 프로그램 매도금액 (백만원)
  prm_buy_amt: string; // 프로그램 매수금액 (백만원)
  prm_netprps_amt: string; // 프로그램 순매수금액 (백만원)
  prm_netprps_amt_irds: string; // 프로그램 순매수금액 증감 (백만원)
  prm_sell_qty: string; // 프로그램 매도수량 (1주)
  prm_buy_qty: string; // 프로그램 매수수량 (1주)
  prm_netprps_qty: string; // 프로그램 순매수수량 (1주)
  prm_netprps_qty_irds: string; // 프로그램 순매수수량 증감 (1주)
  base_pric_tm: string; // 기준가 시간 (HHmmss)
  dbrt_trde_rpy_sum: string; // 대차거래 상환주수합
  remn_rcvord_sum: string; // 잔고수주합
  stex_tp: string; // 거래소구분 (KRX / NXT / 통합)
};

export type ProgramFlowResponse = {
  stk_daly_prm_trde_trnsn: ProgramFlowItem[];
};

// 일별주가요청(ka10086)
export type KiwoomDailyPrice = {
  date: string; // 날짜
  open_pric: string; // 시가
  high_pric: string; // 고가
  low_pric: string; // 저가
  close_pric: string; // 종가
  pred_rt: string; // 전일비
  flu_rt: string; // 등락률
  trde_qty: string; // 거래량
  amt_mn: string; // 금액(백만)
  crd_rt: string; // 신용비
  ind: string; // 개인
  orgn: string; // 기관
  for_qty: string; // 외인수량
  frgn: string; // 외국계
  prm: string; // 프로그램
  for_rt: string; // 외인비
  for_poss: string; // 외인보유
  for_wght: string; // 외인비중
  for_netprps: string; // 외인순매수
  orgn_netprps: string; // 기관순매수
  ind_netprps: string; // 개인순매수
  crd_remn_rt: string; // 신용잔고율
};

export type KiwoomDailyPriceResponse = {
  daly_stkpc: KiwoomDailyPrice[];
};
