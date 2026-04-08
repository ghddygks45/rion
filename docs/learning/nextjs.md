# Next.js 학습 노트

## "use client" — 서버/클라이언트 컴포넌트

`"use client"`는 "클라이언트에서만 실행"이 아니라 "클라이언트 기능(useState, useEffect 등)을 쓸 수 있다"는 선언이다.

```ts
"use client"  // 이게 있어야 useState, useEffect 사용 가능
```

**중요:** `"use client"` 컴포넌트도 SSR 시 서버에서 한 번 실행된다. 그래서 `window`에 직접 접근하면 서버에서 에러가 난다.

```ts
// 서버에서 window 접근하면 ReferenceError
window.localStorage  // ❌

// typeof로 환경 체크 후 접근
if (typeof window === "undefined") return "dark"  // 서버면 스킵
localStorage.getItem("theme")  // 브라우저에서만 실행
```

---

## params — 동적 라우트

`/theme/[id]` 같은 동적 라우트에서 URL의 `[id]` 부분을 Next.js가 자동으로 `params`로 넘겨준다.

```
URL: /theme/semiconductor
params: { id: "semiconductor" }
```

**Next.js 15+부터 params가 Promise로 바뀌었다.**

```ts
// Next.js 14 이하
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id  // 즉시 접근 가능
}

// Next.js 15+
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // await으로 꺼내야 함
}
```

이유: SSR 시 URL 파싱이 비동기로 이루어질 수 있어서 Promise로 설계 변경됨.

---

## notFound()

`next/navigation`에서 가져오는 함수. 호출하면 즉시 404 페이지로 이동한다.

```ts
import { notFound } from "next/navigation"

const theme = mockThemeDetails.find((t) => t.id === id)
if (!theme) notFound()  // 없는 id면 404
```

---

## Static vs Dynamic Rendering

| | Static | Dynamic |
|--|--|--|
| 시점 | 빌드 시 미리 생성 | 요청마다 서버에서 생성 |
| 속도 | 빠름 | 상대적으로 느림 |
| 사용 | 모든 사용자 동일한 내용 | 사용자별 다른 내용 |

`cookies()`, `headers()` 같은 요청 의존 함수를 쓰면 해당 페이지가 Dynamic으로 전환된다.

```ts
// layout.tsx에서 cookies() 쓰는 순간 하위 모든 페이지가 Dynamic으로 전환
import { cookies } from "next/headers"
const theme = (await cookies()).get("theme")  // ← 이 한 줄 때문에 전체 Dynamic
```

---

## 다크모드 렌더링 전체 동작 순서

### 관련 파일

```
app/layout.tsx       - 인라인 script (FOUC 방지)
lib/theme.tsx        - ThemeProvider, useState, useEffect, toggleTheme
app/globals.css      - CSS 변수 구조
```

### CSS 변수 구조

```css
/* 1단계: 모드별 CSS 변수 */
:root {
  --bg: #F4F4F5;      /* 기본 = 라이트 */
}
.dark {
  --bg: #0A0A0A;      /* .dark 클래스 있을 때 = 다크 */
}

/* 2단계: Tailwind 토큰은 CSS 변수를 참조 */
@theme {
  --color-bg: var(--bg);  /* bg-bg 클래스로 사용 */
}
```

`<html>`에 `.dark` 클래스가 붙으면 다크모드, 없으면 라이트모드.

---

### 처음 접속 (localStorage 비어있음)

```
1. 서버 [lib/theme.tsx]
   - useState lazy initializer 실행
   - typeof window === "undefined" → true (서버엔 window 없음)
   - return "dark" → theme 초기값 = "dark"
   - "dark" 기준으로 HTML 생성 → 브라우저로 전송

2. 브라우저 — <head> 파싱 [app/layout.tsx 인라인 script]
   (function(){
     var t = localStorage.getItem('theme') || 'dark'
     // localStorage 비어있음 → null || 'dark' → 'dark'
     if(t === 'dark') document.documentElement.classList.add('dark')
     // true → <html>에 .dark 붙임
   })()
   → <body> 렌더링 시 이미 .dark 붙어있음 → 처음부터 다크모드 (FOUC 없음)

3. 브라우저 — React hydration [lib/theme.tsx]
   - lazy initializer 다시 실행 (브라우저에서)
   - typeof window === "undefined" → false
   - localStorage.getItem("theme") → null
   - null || "dark" → "dark"
   - theme = "dark"
   - 서버("dark") = 클라("dark") → 일치 → 재렌더 없음

4. useEffect 실행 [lib/theme.tsx]
   useEffect(() => {
     document.documentElement.classList.toggle("dark", theme === "dark")
     // toggle("dark", true) → 이미 .dark 있음 → 변화 없음
   }, [theme])
```

---

### 토글 클릭 (dark → light)

```
1. toggleTheme 실행 [lib/theme.tsx]
   const next = "dark" === "dark" ? "light" : "dark"  // "light"
   setTheme("light")                    // React state 변경
   localStorage.setItem("theme", "light")  // 저장

2. useEffect([theme]) 재실행 [lib/theme.tsx]
   - theme = "light"로 바뀌었으니 useEffect 재실행
   - classList.toggle("dark", false)
   - <html>에서 .dark 제거 → 라이트모드 전환
```

---

### 새로고침 (localStorage에 "light" 저장된 상태)

```
1. 서버 [lib/theme.tsx]
   - lazy initializer 실행
   - typeof window === "undefined" → true
   - return "dark" → theme = "dark" (서버는 항상 dark)
   - "dark" 기준으로 HTML 생성 → 브라우저로 전송

2. 브라우저 — <head> 파싱 [app/layout.tsx 인라인 script]
   (function(){
     var t = localStorage.getItem('theme') || 'dark'
     // "light" || 'dark' → "light"
     if(t === 'dark') document.documentElement.classList.add('dark')
     // false → .dark 안 붙임
   })()
   → <body> 렌더링 → .dark 없음 → 라이트모드 (FOUC 없음)

3. 브라우저 — React hydration [lib/theme.tsx]
   - lazy initializer 다시 실행
   - localStorage.getItem("theme") → "light"
   - theme = "light"
   - 서버("dark") vs 클라("light") 불일치 → React 재렌더 → dev 경고 발생

4. useEffect 실행 [lib/theme.tsx]
   - classList.toggle("dark", false)
   - .dark 없음 → 라이트모드 유지
```

---

### dev 경고가 뜨는 이유

light 모드 새로고침 시 `Encountered a script tag while rendering React component` 경고가 난다.

```
서버: theme = "dark" (window 없으니 항상)
클라: theme = "light" (localStorage 읽음)
→ 불일치 → React 재렌더 → script 태그 경고
```

- 프로덕션 빌드에서는 발생하지 않는 dev 전용 경고
- next-themes 등 커뮤니티 표준 라이브러리도 동일한 방식 사용
- 쿠키로 해결 가능하나 전체 앱이 Dynamic Rendering으로 전환되는 트레이드오프 있음

---

## FOUC (Flash of Unstyled Content) 방지

새로고침 시 테마가 잠깐 번쩍이는 현상을 막기 위해 `<head>`에 인라인 스크립트를 넣는다.

```tsx
// app/layout.tsx
<script dangerouslySetInnerHTML={{
  __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})()`
}} />
```

**왜 작동하는가:** `<head>` 안의 `<script>`는 `<body>` 파싱 전에 동기적으로 실행된다. 그래서 화면이 그려지기 전에 `.dark` 클래스가 이미 붙어있다.

**렌더링 순서:**
```
1. 서버 → HTML 생성 (theme state = "dark")
2. 브라우저 <head> 파싱 → 인라인 script 동기 실행
   → localStorage 읽음 → .dark 클래스 즉시 적용
3. <body> 렌더링 → 이미 올바른 테마 적용 (FOUC 없음)
4. React hydration → useEffect → classList 최종 동기화
```
