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
