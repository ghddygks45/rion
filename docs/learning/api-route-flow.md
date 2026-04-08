# Next.js Route Handler + 외부 API 연결 흐름

## 왜 이렇게 하는가

브라우저가 키움 API를 직접 부르면 앱키/앱시크릿이 개발자 도구에 노출된다.
그래서 서버(route.ts)가 중간에서 키움을 대신 호출하고, 브라우저에는 데이터만 전달한다.

---

## 사용자 관점에서 본 흐름

1. 사용자가 브라우저에서 테마 목록 페이지를 연다
2. 브라우저가 `/api/kiwoom/themes`로 데이터를 요청한다
3. 우리 서버가 키움한테 "테마 데이터 줘"라고 요청한다
4. 키움이 데이터를 주면 브라우저에 전달한다
5. 화면에 테마 목록이 표시된다

브라우저는 키움을 직접 본 적이 없다. 우리 서버만 봤다.

---

## 각 파일의 역할

### `.env.local`

앱키/앱시크릿 보관함. 코드에 직접 쓰면 GitHub에 노출되므로 이 파일에만 저장.
`.gitignore`에 등록되어 절대 외부에 올라가지 않는다.
코드에서는 `process.env.KIWOOM_APP_KEY`로 꺼내 쓴다.

### `server/kiwoom/auth.ts`

키움한테 "나 인증된 사용자야, 토큰 줘"라고 요청하는 함수.
앱키 + 앱시크릿을 보내면 키움이 access_token을 발급해준다.
이 토큰을 이후 모든 API 호출에 붙여야 데이터를 받을 수 있다.

### `server/kiwoom/kiwoomFetcher.ts`

키움 API를 호출하는 공통 도구 함수. "서비스 함수" 또는 "API 클라이언트 함수"라고 부른다.
매번 토큰 발급, 헤더 세팅을 반복하지 않도록 하나로 묶어놨다.
`route.ts`가 "요청 받는 문"이라면, `kiwoomFetch`는 "실제 일하는 직원"이다.

### `server/kiwoom/types.ts`

키움 API 실제 응답을 보고 만든 타입 정의.
키움은 숫자도 전부 문자열(string)로 내려준다. (예: `flu_rt: "+18.08"`)
타입이 있으면 응답 데이터 쓸 때 자동완성이 되고, 오타가 나면 에러가 잡힌다.

### `app/api/kiwoom/themes/route.ts`

브라우저가 실제로 호출하는 우리 서버의 API 엔드포인트.
Next.js는 이 파일에 `GET` 함수가 있으면 자동으로 `/api/kiwoom/themes` URL을 만들어준다.
`kiwoomFetch`를 호출해서 키움 데이터를 받고, `NextResponse.json(data)`로 브라우저에 돌려준다.

---

## 코드 흐름 상세

```
브라우저
  → GET /api/kiwoom/themes 요청

route.ts (GET 함수 실행)
  → kiwoomFetch('/api/dostk/thme', 'ka90001', { ... }) 호출

kiwoomFetcher.ts (kiwoomFetch 함수 실행)
  → getKiwoomToken() 호출해서 토큰 발급
  → 토큰을 authorization 헤더에 붙여서 키움 API 호출
  → 키움 응답을 JSON으로 변환해서 반환

route.ts
  → 받은 데이터를 NextResponse.json(data)로 브라우저에 전달

브라우저
  → 데이터 수신 → 화면 표시
```

---

## 자주 헷갈리는 개념

**GET vs POST**

- GET: "데이터 달라" (브라우저 → 우리 서버)
- POST: "내가 데이터 보낼게, 처리해줘" (우리 서버 → 키움)
- 키움 API는 데이터 조회도 POST 방식을 쓴다

**NextResponse.json(data)**

- 키움한테서 받은 데이터를 브라우저에 돌려주는 택배 상자
- JSON 형식으로 포장해서 전달한다

**제네릭 `<T>`**

- `kiwoomFetch`는 여러 API를 호출할 수 있다 (ka90001, ka90002, ka10100 등)
- 각 API마다 응답 구조가 다르니까, 호출할 때 "이번 응답은 이 타입이야"라고 알려주는 것
- `kiwoomFetch<Ka90001Response>(...)` → 응답이 Ka90001Response 타입임을 TypeScript가 알 수 있다

**기존 프로젝트와 비교**

- 기존: `fetch('https://백엔드서버.com/articles')` → 남이 만든 서버 URL 사용
- 지금: `fetch('/api/kiwoom/themes')` → 우리가 직접 만든 서버 URL 사용
- 브라우저 코드(useQuery)는 완전히 동일한 방식. 다른 건 그 URL의 주인이 누구냐뿐
