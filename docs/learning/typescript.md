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
