# Plan 3-1. 키움 REST API 연결 + 실제 데이터 확인

## 목표

키움 REST API를 Next.js Route Handler에 연결하고,
실제 데이터가 잘 들어오는지 확인한 뒤 TypeScript 타입을 정의한다.

이 단계에서는 **ka90001 (테마 그룹 조회) 하나만** 먼저 연결해서
인증 흐름과 응답 데이터 형태를 검증한다.

---

## 키움 REST API 정보

- Base URL: `https://api.kiwoom.com`
- 인증: app_key + app_secret → access_token 발급 → Bearer 토큰으로 API 호출
- 사용할 엔드포인트:
  - ka90001 — 테마별 급등 테마 그룹 조회
  - ka90002 — 테마별 구성종목 상세 조회
  - ka10032 — 거래대금상위 요청
  - ka10100 — 종목정보 조회

---

## 구현할 파일

### 1. `.env.local`

```
KIWOOM_APP_KEY=발급받은_앱키
KIWOOM_APP_SECRET=발급받은_앱시크릿
```

### 2. `server/kiwoom/auth.ts`

access_token 발급 함수.

```ts
export async function getKiwoomToken(): Promise<string>
```

- app_key + app_secret으로 키움 토큰 엔드포인트 호출
- access_token 반환

### 3. `server/kiwoom/kiwoomFetcher.ts`

키움 API 공통 호출 함수.

```ts
export async function kiwoomFetch(endpoint: string, body: Record<string, string>): Promise<unknown>
```

- 내부에서 `getKiwoomToken()` 호출
- Authorization 헤더에 Bearer 토큰 포함
- POST 요청 (키움 REST API는 대부분 POST)

### 4. `app/api/kiwoom/themes/route.ts`

ka90001 호출 Route Handler. 테스트용.

```ts
GET /api/kiwoom/themes
```

- `kiwoomFetch`로 ka90001 호출
- 응답 그대로 반환 (타입 정의 전 raw 확인용)

---

## 완료 조건

- `GET /api/kiwoom/themes` 호출 시 키움 실제 데이터 응답 확인
- 응답 JSON 구조 파악 후 이 plan에 기록
- `npx tsc --noEmit` 타입 에러 없음

---

## 다음 단계 (3-2 이후)

응답 구조 확인 후:
- ka90001/ka90002/ka10100 타입 정의
- 각 엔드포인트별 Route Handler 구현
- 목업 데이터 → 실제 API 연결
