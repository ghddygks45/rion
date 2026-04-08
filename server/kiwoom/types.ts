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
