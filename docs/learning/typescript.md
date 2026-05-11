# TypeScript 학습 노트

## as — 타입 단언 (Type Assertion)

TypeScript에게 "이 값은 이 타입이야, 믿어"라고 강제로 알려주는 문법.

```ts
localStorage.getItem("theme")  // 반환 타입: string | null

// string | null을 Theme | null로 강제 지정
const stored = localStorage.getItem("theme") as Theme | null
```

**주의:** `as`는 런타임에 아무 일도 안 한다. 타입 검사만 통과시키는 것이고 실제 값을 변환하지 않는다.

```ts
localStorage.setItem("theme", "banana")
const stored = localStorage.getItem("theme") as Theme  // TypeScript는 Theme인 줄 앎
// 실제 런타임 값은 "banana" — 타입과 다를 수 있음
```

내가 직접 저장한 값이라 확실할 때만 쓴다.

---

## 서버 타입 vs UI 타입 (Props 설계)

서버/데이터 타입과 컴포넌트 Props 타입을 분리한다.

```ts
// 서버 타입 — API나 DB에서 오는 전체 데이터 구조
type ThemeDetail = {
  id: string
  name: string
  summary: string
  avgChangeRate: number
  news: NewsItem[]
  stocks: ThemeDetailStock[]
}

// UI 타입 — 컴포넌트가 실제로 필요한 것만
type Props = {
  name: string
  avgChangeRate: number
  summary: string
}
```

컴포넌트에 전체 데이터 타입을 통째로 넘기면 "이 컴포넌트는 news, stocks도 필요하다"는 의미가 된다. 실제로 안 쓰는 필드까지 의존성이 생겨버리므로, 필요한 것만 Props로 정의한다.

```tsx
// 부모에서 넘겨줄 때
<ThemeDetailHeader
  name={theme.name}
  avgChangeRate={theme.avgChangeRate}
  summary={theme.summary}
/>
```

---

## UI 타입 어디에 정의할까

### 기준: 어디서 쓰이나

**한 파일에서만 쓰임 → 그 파일 안에 바로 작성**

```ts
// ThemeCard.tsx 안에서만 쓰는 타입
type ThemeCardProps = {
  name: string;
  changeRate: number;
};
```

**여러 파일에서 공유 → 별도 types.ts**

```
features/themes/
├── components/ThemeCard.tsx
├── hooks/useThemes.ts
└── types.ts  ← 둘 다 import해서 쓸 때
```

### 이 프로젝트 기준

| 타입 종류 | 위치 |
|----------|------|
| props 타입 | 컴포넌트 파일 안 |
| 훅 반환 타입 | 훅 파일 안 |
| 페이지 + 컴포넌트 + 훅이 공유 | `features/[도메인]/types.ts` |
| 서버 API 원시 타입 | `server/[서비스]/types.ts` |

처음엔 쓰는 파일 안에 두고, 여러 곳에서 쓰이기 시작하면 그때 분리한다. 미리 분리하지 않는다.

### 서버 타입을 훅에서 쓰면 안 되는 이유

`server/hankuk/types.ts`의 `MarketIndexResponse`는 증권사 API 원시 응답 타입이다.  
`bstp_nmix_prpr` 같은 필드명 그대로다.  
이걸 훅이나 컴포넌트에서 직접 쓰면 서버 관심사가 UI 코드까지 침투하게 된다.

훅의 `queryFn` 안에서 변환해서 clean한 이름으로 return하면,  
컴포넌트는 서버 타입을 전혀 몰라도 된다.

---

## optional 필드 (?)

`?`를 붙이면 있어도 되고 없어도 되는 필드가 된다.

```ts
type ThemeDetailStock = {
  name: string        // 필수
  price: number       // 필수
  signal?: Signal     // 옵셔널 — 없어도 됨
}

// signal 없이도 유효
{ name: '삼성전자', price: 73400, changeRate: 2.45, volume: 430000000, href: '/stock/005930' }

// signal 있어도 유효
{ name: 'SK하이닉스', price: 189500, changeRate: 3.12, volume: 210000000, href: '/stock/000660', signal: '52주 신고가' }
```
