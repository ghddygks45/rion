// ka90001 응답 타입
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
};

export type Ka90002Response = {
  thema_comp_stk: KiwoomThemeStock[];
  flu_rt: string;
  dt_prft_rt: string;
  return_code: number;
  return_msg: string;
};

export type KiwoomHotStock = {
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

export type Ka10032Response = {
  trde_prica_upper: KiwoomHotStock[];
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
