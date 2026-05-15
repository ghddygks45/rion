# React 학습 노트

## useState lazy initializer

초기값을 계산하는 로직이 있을 때 함수로 넘긴다. 이 함수는 마운트 시 딱 1번만 실행된다.

```ts
// 단순 초기값
const [theme, setTheme] = useState("dark")

// lazy initializer — 함수로 넘기면 마운트 시 1번만 실행
const [theme, setTheme] = useState<Theme>(() => {
  if (typeof window === "undefined") return "dark"
  return (localStorage.getItem("theme") as Theme) || "dark"
})
```

`localStorage`처럼 "초기에 한 번 읽어서 state로 넣는" 패턴에 적합하다.

---

## useEffect — 역할과 방향

React 공식 문서 기준: useEffect는 **React state → 외부 시스템** 방향으로 동기화할 때 쓴다.

```ts
// ✓ 올바른 방향: state 변화 → DOM 반영
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark")
}, [theme])

// ✗ 잘못된 방향: 외부(localStorage) → state 변경
useEffect(() => {
  setTheme(localStorage.getItem("theme"))  // ESLint 경고 발생
}, [])
```

`useEffect` 안에서 `setState`를 동기적으로 호출하면 ESLint `react-hooks/set-state-in-effect` 경고가 난다. 연쇄 렌더 가능성을 경고하는 것.

---

## Context + useContext + 커스텀 훅

전역 상태를 공유할 때 쓰는 패턴.

```ts
// 1. Context 생성
const ThemeContext = createContext<ThemeContextType | null>(null)

// 2. Provider로 값 공급
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {children}
</ThemeContext.Provider>

// 3. 어디서든 꺼내쓰기
const ctx = useContext(ThemeContext)
```

`useTheme` 같은 커스텀 훅으로 감싸면:
- 반복 제거 (useContext + null 체크를 매번 안 써도 됨)
- Provider 밖에서 호출 시 명확한 에러 메시지

```ts
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

// 사용할 때
const { theme, toggleTheme } = useTheme()
```

---

## .map()이랑 컴포넌트 실행 순서

### 처음에 헷갈렸던 것

map으로 돌리면 ThemeCard 안에 useThemestocks 요청도 있고 아래에 로직들도 많잖아.  
근데 map이 그걸 다 실행하고 다음 번 돌리는건지, 아니면 map은 그냥 싹 돌고 그 뒤에 처리되는건지 헷갈렸다.

### 실제로는 이렇다

map은 ThemeCard를 **실행**하는 게 아니다. 그냥 "ThemeCard 이 props로 그려줘"라는 **메모지**만 만드는 거다.

```tsx
themes.map((theme) => <ThemeCard theme={theme} />)
// 이 순간 ThemeCard 함수 안의 코드는 실행 안 됨
// 그냥 { type: ThemeCard, props: { theme } } 라는 메모지만 생성
```

React가 그 메모지들을 다 받아서 "아 이거 그려야겠다" 하고 ThemeCard 함수를 실제로 실행한다.  
그래서 map 자체는 엄청 빠르다. 메모지만 만드니까.

### 그럼 실행 순서가 어떻게 되냐

```
1. map 돈다 → ThemeCard 메모지 10개 생성 (매우 빠름)

2. React가 ThemeCard 10개 함수 실행
   - 각자 useThemestocks 호출 → "이 요청 처리해줘" 하고 브라우저에 던짐
   - 데이터 아직 없으니까 return null
   
3. 화면에 아무것도 없음

4. 브라우저가 요청 처리하다가 응답 하나 옴
   → 그 카드만 다시 렌더
   → 이때 로직 실행 → 카드 등장

5. 또 응답 옴 → 또 카드 하나 등장
   → 이게 반복되니까 카드가 하나씩 뜨는 거였음
```

### fetch가 왜 동시에 되냐고 생각했는데

map이 순차로 도는데 어떻게 동시에 요청이 가냐고 의아했다.  
근데 `fetch()`는 호출하는 순간 브라우저한테 "이거 처리해줘" 하고 던지고 바로 다음 줄로 간다. 기다리지 않는다.  
그러니까 map이 1번, 2번, 3번 순서로 fetch를 호출해도 그 사이가 마이크로초라서, 브라우저 입장에선 다 동시에 들어온 거나 마찬가지다.

정확히는 "동시에 발사"가 아니라 **"거의 동시에 pending 등록되고, 브라우저가 병렬로 처리"** 가 맞는 표현이다.

### 그래서 결국

- 카드가 하나씩 뜨는 이유: 요청 응답이 각자 다른 타이밍에 오니까
- 느린 요청이 있으면 그 카드만 늦게 뜨는 거
- 브라우저 연결 제한(~6개)이 있어서 자연스럽게 Kiwoom rate limit도 안 넘김 (우연히 안전한 것)

---

## 브라우저 connection limit

### 이게 뭔데

브라우저는 한 도메인에 동시에 연결할 수 있는 수가 제한돼 있다. 크롬 기준 약 6개.

fetch를 10개 동시에 날려도 6개만 실제로 나가고 나머지 4개는 대기열에서 기다린다.  
앞에 있는 게 완료되면 대기 중인 게 나간다.

### 왜 알아야 하냐

Kiwoom API는 초당 5번 요청 제한이 있다.  
서버에서 `Promise.all`로 요청을 동시에 100개 날리면 Kiwoom에 100개가 한꺼번에 도달한다. → 제한 초과 에러

근데 클라이언트에서 요청을 날리면 브라우저가 알아서 6개씩 끊어서 보낸다.  
그리고 각 요청은 왕복 시간이 있으니까(Next.js → Kiwoom → 다시 돌아오기) 실제로 Kiwoom에 도달하는 속도가 분산된다.  
그래서 지금 ThemePage 구조는 **우연히 rate limit에 안 걸리고 있는 것**이다.

```
클라이언트 방식:
  브라우저 → (6개씩) → Next.js → Kiwoom  ← 자동 throttle ✓

서버 Promise.all 방식:
  서버 → (100개 한번에) → Kiwoom  ← rate limit 초과 ✗
```

### 그럼 서버에서 여러 요청을 해야 할 때는?

브라우저가 대신 해주지 않으니까 직접 조절 코드를 짜야 한다.

- `p-limit` 라이브러리: 동시 요청 수를 N개로 제한
- 배치 처리: 5개씩 묶어서 보내고 1초 대기
- `unstable_cache`: 동일한 요청이 여러 번 들어와도 1번만 실제로 Kiwoom 호출

외부 API에 rate limit이 있는 서비스는 보통 **DB 캐시 + 크론 스케줄러** 방식으로 해결한다.  
크론이 주기적으로 Kiwoom에서 데이터 가져와서 DB에 저장하고, 클라이언트는 DB에서만 읽는다.  
이러면 클라이언트 요청이 아무리 많아도 Kiwoom을 직접 부르지 않는다.
