# Plan 3-1 Report — 키움 REST API 연결 + 실제 데이터 확인

## 구현 완료 일자
2026-04-08

---

## 개요

키움 REST API를 Next.js Route Handler에 연결하고, ka90001(테마 그룹 조회)로 실제 데이터가 잘 들어오는지 확인했다. 응답 구조를 기반으로 TypeScript 타입을 정의했다.

---

## 구현한 파일

### `.env.local`
앱키와 앱시크릿을 보관하는 환경변수 파일. `.gitignore`에 등록되어 있어 GitHub에 올라가지 않는다.

```
KIWOOM_APP_KEY=...
KIWOOM_APP_SECRET=...
```

### `server/kiwoom/auth.ts`
키움 OAuth 토큰을 발급받는 함수.

- 엔드포인트: `POST https://api.kiwoom.com/oauth2/token`
- 요청 body: `grant_type: 'client_credentials'`, `appkey`, `secretkey`
- 응답에서 `token` 필드를 반환

### `server/kiwoom/kiwoomFetcher.ts`
키움 API를 호출하는 공통 함수. 제네릭 타입 `<T>`를 사용해 엔드포인트별로 응답 타입을 지정할 수 있다.

- 내부에서 `getKiwoomToken()` 호출
- `authorization: Bearer {token}` 헤더 포함
- `api-id` 헤더로 어떤 TR(트랜잭션)인지 지정

### `server/kiwoom/types.ts`
키움 API 응답 타입 정의. 실제 응답 JSON을 기반으로 작성했다.

- `KiwoomThemeGroup` — 테마 그룹 항목 하나
- `Ka90001Response` — ka90001 전체 응답

**주의:** 키움 API는 숫자 데이터도 모두 `string`으로 내려온다. (예: `flu_rt: "+18.08"`, `stk_num: "5"`)

### `app/api/kiwoom/themes/route.ts`
`GET /api/kiwoom/themes` 엔드포인트. 브라우저(또는 TanStack Query)가 호출하는 우리 서버 API.

ka90001 파라미터:
- `qry_tp: '0'` — 전체 검색
- `date_tp: '1'` — 1일전 기준
- `flu_pl_amt_tp: '3'` — 상위 등락률
- `stex_tp: '1'` — KRX

---

## 실제 응답 구조 (ka90001)

```json
{
  "thema_grp": [
    {
      "thema_grp_cd": "200",
      "thema_nm": "건설_해외건설",
      "stk_num": "5",
      "flu_sig": "2",
      "flu_rt": "+18.08",
      "rising_stk_num": "5",
      "fall_stk_num": "0",
      "dt_prft_rt": "+18.08",
      "main_stk": "대우건설, GS건설"
    }
  ],
  "return_code": 0,
  "return_msg": "정상적으로 처리되었습니다"
}
```

---

## 아키텍처 정리

```
브라우저 (useQuery)
  → GET /api/kiwoom/themes  (route.ts, Next.js Route Handler)
    → kiwoomFetch()  (kiwoomFetcher.ts)
      → getKiwoomToken()  (auth.ts)
      → POST https://api.kiwoom.com/api/dostk/thme
        → 키움 서버
```

브라우저가 키움 API를 직접 호출하지 않는 이유: 앱키/앱시크릿이 노출되기 때문. 서버(route.ts)가 중간에서 키움을 호출하고 데이터만 전달한다.

---

## 완료 조건 확인

- [x] `GET /api/kiwoom/themes` 호출 시 키움 실제 데이터 응답 확인
- [x] 응답 JSON 구조 파악 및 report에 기록
- [x] `npx tsc --noEmit` 타입 에러 없음
