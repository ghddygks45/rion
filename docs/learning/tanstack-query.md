# TanStack Query — useQuery 기초

## useQuery가 뭔가

서버에서 데이터를 가져오는 훅이에요.
그냥 `fetch`만 쓰면 로딩 상태, 에러 상태, 캐싱, 재요청을 직접 다 만들어야 하는데, `useQuery`가 그걸 다 알아서 해준다.

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ['themes'],
  queryFn: async () => {
    const res = await fetch('/api/kiwoom/themes')
    return res.json()
  }
})
```

- `data` — 가져온 데이터
- `isLoading` — 데이터 불러오는 중이면 true
- `isError` — 에러 났으면 true

---

## queryKey

TanStack Query가 캐시를 관리하는 이름표.

`['themes']`라고 지정하면:
- 같은 키로 `useQuery`를 쓰는 컴포넌트가 여러 개여도 API를 한 번만 호출하고 캐시에서 꺼내줌
- 데이터를 강제로 새로 불러오고 싶을 때 `invalidateQueries({ queryKey: ['themes'] })`로 지정 가능

---

## queryFn

실제로 데이터를 가져오는 함수. `useQuery`한테 "데이터는 이 함수로 가져와"라고 알려주는 것.

---

## refetchInterval

```ts
useQuery({
  queryKey: ['themes'],
  refetchInterval: 10000, // 10초마다 재요청
  queryFn: ...
})
```

N밀리초마다 `queryFn`을 자동으로 다시 실행한다.
주식 시세처럼 주기적으로 갱신이 필요할 때 사용.

키움 REST API는 WebSocket이 아닌 요청-응답 방식이라 진짜 실시간은 안 된다.
`refetchInterval`로 근사 실시간을 구현하는 방식을 선택했다.

---

## 데이터 매핑 패턴

외부 API는 우리 서비스 형식으로 데이터를 주지 않는다.
받아온 데이터를 우리 타입에 맞게 변환하는 것을 **매핑(mapping)** 이라고 한다.

```ts
// 키움 원본 → 우리 Theme 타입으로 변환
return data.thema_grp.map((item) => ({
  id: item.thema_grp_cd,         // thema_grp_cd → id
  name: item.thema_nm,           // thema_nm → name
  avgChangeRate: parseFloat(item.flu_rt), // "+18.08" → 18.08 (문자열 → 숫자)
  summary: '',                   // 키움에 없는 필드, 빈 값으로 채움
  stocks: [],                    // 다른 API에서 별도 조회 필요
}))
```

키움은 숫자 데이터도 문자열로 내려준다. (`flu_rt: "+18.08"`)
`parseFloat()`으로 숫자로 변환해야 한다.

---

## res.json()을 두 번 하는 이유

- `NextResponse.json(data)` (서버, route.ts) — 데이터를 JSON 문자열로 **포장**해서 브라우저에 전송
- `res.json()` (브라우저, useQuery) — JSON 문자열을 **열어서** 자바스크립트 객체로 변환

택배로 비유하면:
- 서버: 물건을 박스에 포장
- 브라우저: 박스를 열어서 물건 꺼내기

---

## 클라이언트 컴포넌트 필요 이유

`useQuery`는 브라우저에서만 실행되는 훅이다.
Next.js 서버 컴포넌트에서는 쓸 수 없어서 `"use client"`를 파일 맨 위에 추가해야 한다.

---

## useQuery 제네릭 타입

`useQuery<T>`의 T는 **queryFn이 최종적으로 return하는 값의 타입**이다.

```ts
// queryFn이 MarketIndexResponse를 return → 제네릭도 MarketIndexResponse
useQuery<MarketIndexResponse>({
  queryFn: async () => res.json() as MarketIndexResponse,
})

// queryFn이 { price, changeRate }를 return → 제네릭도 그거
useQuery<{ price: number; changeRate: number }>({
  queryFn: async () => ({ price: 100, changeRate: 2.5 }),
})

// 제네릭 생략 → TypeScript가 return값 보고 자동 추론 (가장 단순)
useQuery({
  queryFn: async () => ({ price: 100, changeRate: 2.5 }),
})
```

### 자주 하는 실수

```ts
// ❌ 제네릭은 MarketIndexResponse인데 실제 return은 { price, changeRate }
useQuery<MarketIndexResponse>({
  queryFn: async () => {
    return { price: 100, changeRate: 2.5 }; // 타입 충돌 에러
  },
})
```

제네릭과 실제 return 타입이 다르면 TypeScript 에러가 난다.  
제네릭을 생략하면 TypeScript가 알아서 추론해주므로 가장 단순하다.

---

## API 필드명 변환 — 어디서 할까

외부 API(특히 증권사)는 필드명이 `bstp_nmix_prpr`, `bstp_nmix_prdy_ctrt` 처럼 읽기 어렵다.  
화면에서 쓸 `price`, `changeRate` 같은 이름으로 바꾸는 작업을 어디서 할지 결정해야 한다.

### 선택지 비교

| 위치 | 특징 |
|------|------|
| route.ts | route가 변환 책임까지 가짐 |
| queryFn 안 | 단순, 캐시에 가공본 저장 |
| select | 캐시엔 원본, 컴포넌트엔 가공본 |
| 컴포넌트 안 | UI에 데이터 로직이 섞임 ❌ |

### queryFn 안에서 변환하는 방법

```ts
export function useDomesticMarket() {
  return useQuery({
    queryKey: ["domesticMarket"],
    queryFn: async () => {
      const res = await fetch("/api/hankuk/domestic-market");
      const raw = await res.json(); // raw는 중간 변수
      return {
        price: Number(raw.kospi.output.bstp_nmix_prpr),
        changeRate: Number(raw.kospi.output.bstp_nmix_prdy_ctrt),
      };
    },
  });
}
```

- `MarketIndexResponse` 타입은 `raw`의 타입이지, `useQuery` 제네릭과 상관없다
- `queryFn`이 return하는 것은 `{ price, changeRate }`이므로 제네릭은 생략하고 추론에 맡긴다

---

## select — 언제 쓰고 왜 쓰나

### 기본 개념

`select`는 캐시에 저장된 원본 데이터를 컴포넌트에 전달하기 전에 변환하는 옵션이다.

```ts
useQuery<MarketIndexResponse, Error, { price: number; changeRate: number }>({
  queryFn: async () => res.json() as MarketIndexResponse, // 원본 그대로 return
  select: (raw) => ({                                      // 여기서 변환
    price: Number(raw.kospi.output.bstp_nmix_prpr),
    changeRate: Number(raw.kospi.output.bstp_nmix_prdy_ctrt),
  }),
})
```

- 캐시에는 `MarketIndexResponse` (원본) 저장
- 컴포넌트가 받는 `data`는 `{ price: number; changeRate: number }` (변환본)

### select가 빛나는 상황 — 리렌더 최적화

```ts
// 컴포넌트 A — price만 필요
useQuery({ ..., select: (data) => data.kospi.price })

// 컴포넌트 B — volume만 필요
useQuery({ ..., select: (data) => data.kospi.volume })
```

같은 캐시를 공유하면서, price가 바뀌면 A만 리렌더링, volume이 바뀌면 B만 리렌더링된다.  
**select가 반환하는 값이 바뀔 때만** 해당 컴포넌트가 리렌더링된다.

### select가 굳이 필요 없는 상황

같은 데이터를 컴포넌트들이 **비슷하게** 쓴다면 `queryFn` 안에서 변환해도 충분하다.  
주식 지수 데이터는 어차피 전체가 한 번에 바뀌기 때문에 select로 최적화할 여지가 거의 없다.

---

## 리렌더되면 useQuery가 또 요청하지 않냐? (무한루프 안 되는 이유)

### 처음에 헷갈렸던 것

응답이 오면 리렌더가 된다. 리렌더되면 코드가 위에서부터 다시 실행된다.  
그럼 useThemestocks도 다시 실행될텐데, 그러면 또 요청이 나가고, 또 응답 오고, 또 리렌더되고...  
무한루프에 빠져야 맞는 거 아닌가?

### 실제로는 이렇다

`useQuery`는 매 렌더마다 fetch를 새로 보내지 않는다.  
내부적으로 **queryKey로 캐시를 확인**한다.

```
useThemestocks("theme_001") 첫 실행
  → TanStack Query: "['themestocks', 'theme_001'] 캐시에 있나?"
  → 없음 → fetch 보냄

응답 옴 → 캐시에 저장 → 리렌더 발생

useThemestocks("theme_001") 다시 실행 (리렌더로 인해)
  → TanStack Query: "['themestocks', 'theme_001'] 캐시에 있나?"
  → 있음 → 캐시 데이터 즉시 반환, fetch 안 보냄 ← 여기서 끊김
```

그래서 무한루프가 안 된다. queryKey가 캐시의 이름표 역할을 해서 "이미 가져온 데이터"라는 걸 안다.

### useStockTopVolum이 카드 10개에서 불려도 1번만 요청되는 이유

ThemeCard마다 `useStockTopVolum()`을 호출하는데 실제로는 Kiwoom에 1번만 요청이 간다.  
이유가 바로 이거다. 모든 ThemeCard가 `queryKey: ["topVolume"]`으로 똑같은 키를 쓰니까,  
첫 번째 카드가 요청하고 캐시에 저장하면 나머지 9개는 캐시에서 꺼내온다.

---

## 기본 재요청 동작 (refetch 기본 설정)

TanStack Query는 기본적으로 **3가지 상황에서 자동으로 재요청**한다.

```
1. refetchOnMount       — 컴포넌트가 마운트될 때
2. refetchOnWindowFocus — 다른 탭 갔다가 돌아올 때  ← 가장 자주 체감
3. refetchOnReconnect   — 네트워크 끊겼다 다시 연결될 때
```

### staleTime

`staleTime` 기본값은 `0`이다. 데이터를 받자마자 "오래된 데이터"로 간주한다.  
그래서 위 3가지 상황이 발생하면 바로 재요청한다.

```ts
useQuery({
  queryKey: ["domesticMarket"],
  queryFn: async () => { ... },
  staleTime: 1000 * 60, // 1분 동안은 신선한 데이터로 간주 → 재요청 안 함
})
```

개발 중에 탭을 자주 전환하면 콘솔에 API 요청이 계속 찍히는 것을 볼 수 있는데, 그게 `refetchOnWindowFocus` 때문이다.

### 재요청 후 리렌더링

재요청이 완료되면 `data`가 새로 바뀌므로 컴포넌트가 리렌더링된다.

```
탭 전환 → refetchOnWindowFocus → API 재요청 → 새 data 도착 → 리렌더링
```

단, **이전 데이터와 값이 같으면 리렌더링 안 한다.**  
TanStack Query가 내부적으로 비교해서 실제로 값이 바뀐 경우에만 리렌더링을 트리거한다.
