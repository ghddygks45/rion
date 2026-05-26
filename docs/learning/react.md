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

---

## 버튼 컴포넌트 설계 — hover, active, size, 탭 전환

### 버튼에 "살아있는 느낌" 주기

처음에 버튼 컴포넌트에 hover 효과를 넣자는 이야기가 나왔다. hover란 마우스 커서를 요소 위에 올렸을 때의 상태를 말한다. 웹에서 버튼은 단순히 텍스트가 담긴 사각형이 아니다. 사용자가 "이건 클릭할 수 있는 거구나"라고 직감적으로 느낄 수 있어야 한다. 그 신호를 주는 방법 중 하나가 마우스를 올렸을 때 색이나 투명도가 살짝 바뀌는 것이다.

Tailwind CSS에서는 이런 상태별 스타일을 클래스 이름 앞에 접두사를 붙여서 표현한다. `hover:`를 붙이면 그 스타일은 마우스가 올라와 있을 때만 적용된다.

```tsx
// 마우스를 올렸을 때 투명도 90%로 살짝 어두워짐
'bg-accent text-white hover:opacity-90'

// 마우스를 올렸을 때 배경색이 border 색상으로 바뀜
'bg-surface border border-border text-text hover:bg-border'
```

클릭할 때 눌리는 느낌은 `active:`를 쓴다. 마우스 버튼을 누르고 있는 순간에만 스타일이 적용된다.

```tsx
'active:scale-95'
```

`scale-95`는 요소를 원래 크기의 95%로 줄인다는 뜻이다. 클릭하는 순간 살짝 작아졌다가 손을 떼면 돌아온다. 이 변화가 부드럽게 보이려면 `transition-all`을 함께 써야 한다.

여기서 중요한 포인트. 원래 코드에 `transition-colors`가 있었는데, 이걸 `transition-all`로 바꿔야 했다. `transition-colors`는 이름 그대로 **색상** 변화만 부드럽게 처리해준다. `scale`처럼 크기가 변하는 건 처리하지 못해서 애니메이션 없이 툭 변했다가 툭 돌아온다. `transition-all`은 모든 종류의 변화를 부드럽게 처리한다.

```tsx
const base = 'rounded-lg font-medium transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'
const variants = {
  primary: 'bg-accent text-white hover:opacity-90 active:scale-95',
  secondary: 'bg-surface border border-border text-text hover:bg-border active:scale-95',
}
```

---

### 탭 컴포넌트를 언제 따로 만들어야 하나

처음엔 탭을 아주 단순하게 처리하려 했다. 페이지에 버튼 두 개를 놓고, 각각 클릭하면 상태를 바꾸는 방식이었다.

```tsx
// 원래 코드
<Button onClick={() => setActiveTab("volume")}>거래대금 상위</Button>
<Button variant="secondary" onClick={() => setActiveTab("changeRate")}>테마 상승률 상위</Button>
```

이 방식은 간단하다는 장점이 있다. 한두 곳에서만 쓴다면 충분하다. 그런데 여러 페이지에서 같은 패턴을 반복해서 쓸 것 같다면 이야기가 달라진다. 탭 두 개가 있고, 하나를 누르면 primary로 바뀌고 나머지는 secondary로 돌아가는 동작 — 이 패턴이 페이지마다 있다면, 그 로직을 매번 다시 짜야 한다. 나중에 탭 스타일을 바꾸고 싶으면 쓰는 곳을 전부 찾아서 고쳐야 한다.

그래서 Tab 컴포넌트를 따로 만들었다. 탭 관련 로직을 한 곳에 모아두고, 쓸 때는 탭 목록만 넘겨주면 되는 방식으로.

---

### 데이터를 어떻게 넘길 것인가 — 배열 두 개 vs 객체 배열

Tab 컴포넌트를 처음 만들 때 이런 구조로 시작했다.

```tsx
type TabProps = {
  tabs: string[];   // 내부에서 쓸 key값
  title: string[];  // 화면에 표시할 텍스트
}
```

이렇게 쓰는 거다.

```tsx
<Tab
  tabs={["volume", "changeRate"]}
  title={["거래대금 상위", "테마 상승률 상위"]}
/>
```

`tabs[0]`인 `"volume"`은 `title[0]`인 `"거래대금 상위"`와 짝이 된다. 인덱스로 두 배열을 연결하는 방식이다.

이 방식의 문제는 배열 순서가 어긋나도 에러가 나지 않는다는 것이다. 실수로 title 배열 순서를 바꿔도 TypeScript는 아무 말도 안 한다. 그냥 잘못된 key에 잘못된 제목이 붙어서 렌더링된다. 버그를 찾기 아주 어려워진다.

더 안전한 방법은 key와 label을 하나의 객체로 묶어서 배열 하나로 만드는 것이다.

```tsx
type Tab = {
  key: string;
  label: string;
}

type TabProps = {
  tabs: Tab[];
}
```

```tsx
<Tab
  tabs={[
    { key: "volume", label: "거래대금 상위" },
    { key: "changeRate", label: "테마 상승률 상위" },
  ]}
/>
```

key와 label이 항상 같은 객체 안에 붙어있다. 순서가 어긋날 수가 없다. 탭을 추가하고 싶으면 배열에 객체 하나를 추가하면 되고, 삭제하고 싶으면 하나를 빼면 된다.

---

### 선택된 탭을 어떻게 기억하고 표시할까 — activeKey 패턴

탭 컴포넌트 안에서 "지금 어떤 탭이 선택됐는지"를 기억해야 variant를 primary/secondary로 구분할 수 있다. 이걸 처리하는 방법이 두 가지 있다.

**방법 1 — 컴포넌트 내부에서 상태 관리 (간단)**

```tsx
export default function Tab({ tabs, onChange }: TabProps) {
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  return (
    <div className="flex gap-1">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeKey === key ? "primary" : "secondary"}
          onClick={() => {
            setActiveKey(key);
            onChange?.(key);
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
```

**방법 2 — 부모가 상태를 들고 Tab은 prop으로 받기**

```tsx
type TabProps = {
  tabs: Tab[];
  activeKey: string;
  onChange?: (key: string) => void;
}

export default function Tab({ tabs, activeKey, onChange }: TabProps) {
  return (
    <div className="flex gap-1">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeKey === key ? "primary" : "secondary"}
          onClick={() => onChange?.(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
```

이 프로젝트에서는 방법 2를 선택했다. 페이지에서 이미 `activeTab`이라는 상태를 들고 있고, 그 상태에 따라 보여줄 데이터도 달라지기 때문이다. 상태를 페이지에서 관리하는 게 더 자연스럽다.

```tsx
// 페이지에서
const [activeTab, setActiveTab] = useState("volume");

<Tab
  tabs={[...]}
  activeKey={activeTab}
  onChange={(key) => setActiveTab(key)}
/>
```

`activeTab`이 `"volume"`이면 Tab 내부에서 `activeKey === key` 비교할 때 `"volume"` key를 가진 탭만 primary, 나머지는 secondary가 된다.

---

### map에서 return을 빠뜨리는 실수

JavaScript에서 `map`은 배열의 각 항목을 변환해서 새 배열을 만드는 함수다. 그 함수는 반드시 변환된 값을 **반환(return)** 해야 한다.

```tsx
// 잘못됨 — 중괄호를 썼지만 return이 없음
{tabs.map((tab) => {
  <Button key={tab}>{tab}</Button>  // 이 줄은 실행됐다가 그냥 버려짐
})}
```

중괄호 `{}`는 "함수 본문을 직접 쓰겠다"는 뜻이다. 이 경우 `return`을 명시적으로 써야 값이 반환된다. `return`이 없으면 함수는 `undefined`를 반환하고, map은 `undefined`가 담긴 배열을 만든다. React는 그걸 화면에 그릴 수가 없어서 아무것도 표시되지 않는다.

```tsx
// 맞음 — return 명시
{tabs.map((tab) => {
  return <Button key={tab}>{tab}</Button>
})}

// 더 간결하게 — 소괄호()로 바꾸면 자동으로 반환됨
{tabs.map((tab) => (
  <Button key={tab}>{tab}</Button>
))}
```

React에서 `map`으로 리스트를 렌더링할 때 소괄호 방식을 가장 많이 쓴다.

---

### onClick에 함수를 "넘기는 것"과 "실행하는 것"의 차이

버튼에서 클릭 이벤트를 처리할 때 흔히 하는 실수가 있다. `onClick`에는 "클릭했을 때 실행할 함수"를 넘겨야 하는데, 함수를 실행한 결과를 넘겨버리는 것이다.

```tsx
// 잘못됨 — 컴포넌트가 렌더링되는 순간 즉시 실행됨
<Button onClick={setRefreshButton(true)}>새로고침</Button>
```

이 코드는 컴포넌트가 화면에 그려지는 순간 `setRefreshButton(true)`가 바로 실행된다. 클릭을 기다리지 않는다. 그리고 `setRefreshButton`이 실행되고 나서 반환하는 값(`void`, 즉 아무것도 없음)이 `onClick`에 전달된다. `onClick`은 함수를 받아야 하는데 `void`를 받으니 TypeScript가 에러를 낸다.

```tsx
// 맞음 — 화살표 함수로 감싸서 "함수 자체"를 넘김
<Button onClick={() => setRefreshButton(true)}>새로고침</Button>
```

화살표 함수 `() => ...`로 감싸면, 이 전체가 하나의 **함수**가 된다. `onClick`은 이 함수를 보관해두었다가 클릭 이벤트가 발생했을 때 실행한다.

간단하게 기억하는 방법: `onClick={무언가()}` 형태는 거의 항상 잘못됐다. `onClick={() => 무언가()}`가 맞다.

---

### useEffect 안에서 setState를 직접 호출하면 안 되는 이유

새로고침 버튼을 처음에 이런 구조로 짰다.

```tsx
// 버튼 클릭 → refreshButton을 true로 바꿈
<Button onClick={() => setRefreshButton(true)}>새로고침</Button>

// refreshButton이 바뀌면 effect 실행 → 쿼리 무효화 → refreshButton을 false로 초기화
useEffect(() => {
  if (!refreshButton) return;
  queryClient.invalidateQueries({ queryKey: ["themes"] });
  setRefreshButton(false); // ← ESLint가 경고를 낸다
}, [refreshButton]);
```

이 구조가 동작하긴 하지만 ESLint가 경고를 낸다. 이유를 이해하려면 React가 화면을 그리는 순서를 알아야 한다.

React는 상태가 바뀌면 컴포넌트를 다시 렌더링하고, 렌더링이 끝난 뒤에 `useEffect`를 실행한다. 그런데 `useEffect` 안에서 또 `setState`를 호출하면, 상태가 또 바뀌고, 또 렌더링되고, 또 effect가 실행되는 연쇄가 생길 수 있다. 이를 cascading render라고 한다. 의도치 않은 무한 루프가 생기거나 성능이 나빠질 수 있다.

위 코드는 `if (!refreshButton) return;` 조건 덕분에 무한 루프는 안 생기지만, 구조 자체가 불필요하게 복잡하다. 버튼 클릭 → state 변경 → effect 실행 → 또 state 변경이라는 4단계를 거치고 있는데, 사실 1단계면 충분하다.

버튼의 `onClick`에서 바로 쿼리를 무효화하면 된다. 사용자가 버튼을 클릭하는 것 자체가 트리거이기 때문에, 굳이 state를 중간 다리로 쓸 필요가 없다.

```tsx
// 이게 전부다
<Button onClick={() => {
  queryClient.invalidateQueries({ queryKey: ["themes"] });
  queryClient.invalidateQueries({ queryKey: ["themestocks"] });
  queryClient.invalidateQueries({ queryKey: ["topVolume"] });
}}>
  새로고침
</Button>
```

`refreshButton` state도, 그 effect도 전부 필요 없어진다. useEffect의 올바른 용도는 "React 외부의 시스템과 동기화"할 때다. 버튼 클릭처럼 명확한 사용자 동작에 반응하는 건 그냥 이벤트 핸들러(`onClick`)에서 처리하면 된다.

---

### TanStack Query의 중복 요청 방지와 버튼 비활성화

새로고침 버튼을 빠르게 여러 번 눌렀을 때 서버에 요청이 여러 번 갈까봐 걱정이 됐다. 그런데 TanStack Query는 이미 이걸 처리해준다.

같은 `queryKey`에 대한 요청이 이미 진행 중이면, 새 요청을 따로 보내지 않고 기존 요청에 합친다. 이를 deduplication(중복 제거)이라고 한다. 버튼을 5번 빠르게 눌러도 실제 네트워크 요청은 1번만 간다.

하지만 사용자 입장에서는 버튼을 눌렀는데 아무 피드백이 없으면 "눌린 건가?" 싶어서 또 누르게 된다. 그래서 로딩 중일 때 버튼을 비활성화하는 게 좋은 UX다.

`useIsFetching()`은 지금 앱 전체에서 fetching 중인 쿼리 수를 숫자로 반환한다. 0이면 아무것도 로딩 중이 아닌 것이고, 0보다 크면 뭔가 로딩 중이다.

```tsx
import { useIsFetching } from "@tanstack/react-query";

const isFetching = useIsFetching();

<Button
  disabled={isFetching > 0}
  onClick={() => {
    queryClient.invalidateQueries({ queryKey: ["themes"] });
    queryClient.invalidateQueries({ queryKey: ["themestocks"] });
    queryClient.invalidateQueries({ queryKey: ["topVolume"] });
  }}
>
  새로고침
</Button>
```

Button 컴포넌트는 `disabled` prop을 받으면 클릭이 안 되게 처리하고 투명도도 낮춰서 시각적으로도 비활성 상태임을 알려준다.

---

### Button에 size prop 추가하기

버튼이 쓰이는 곳마다 크기가 다를 수 있다. 헤더에 작은 버튼, 폼 하단에 큰 버튼처럼. 처음엔 `className`을 직접 넘겨서 크기를 조절할 수도 있지만, 이러면 일관성이 깨진다. 어떤 곳에선 `px-3 py-1`, 다른 곳에선 `px-3 py-1.5`처럼 제각각이 된다.

컴포넌트에 `size` prop을 두고 Tailwind 클래스를 객체로 매핑하는 패턴이 더 좋다.

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  // ...
}

const sizes = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
}
```

기본값을 `md`로 설정하면, 기존에 `size`를 안 쓰던 코드는 전부 `md`로 동작한다. 기존 UI가 깨지지 않는다.

이 패턴의 핵심은 **크기의 선택지를 미리 정해두는 것**이다. 쓰는 사람이 임의의 값을 넣는 게 아니라 `"sm" | "md" | "lg"` 중에서 고르게 한다. 디자인 시스템에서 모든 버튼의 크기가 이 세 가지 중 하나라는 규칙이 생기고, UI 전체가 일관성을 유지한다.
