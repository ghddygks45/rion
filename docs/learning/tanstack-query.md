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
