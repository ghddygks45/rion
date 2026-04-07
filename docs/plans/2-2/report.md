# Report 2-2. 다크/라이트 테마 시스템 구축

## 작업 결과

완료

---

## 만든/수정한 파일 목록

```
app/globals.css               - CSS 변수 기반으로 리팩토링
lib/theme.tsx                 - ThemeProvider, useTheme 훅
components/ui/ThemeToggle.tsx - 토글 버튼 컴포넌트
app/layout.tsx                - ThemeProvider 적용 + FOUC 해결 스크립트
```

---

## 각 파일 상세 설명

### `app/globals.css`

기존에는 `@theme` 블록에 색상 값이 하드코딩되어 있었습니다.

```css
/* 기존 - 다크모드 고정 */
@theme {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
}
```

이 구조는 `@theme`의 값이 빌드 시점에 고정되기 때문에 런타임에 모드를 전환할 수 없습니다. 이를 해결하기 위해 CSS 변수를 2단계로 분리했습니다.

```css
/* 1단계: 모드별 CSS 변수 정의 */
:root {
  --bg: #f4f4f5; /* 라이트 */
  --surface: #ffffff;
}

.dark {
  --bg: #0a0a0a; /* 다크 */
  --surface: #141414;
}

/* 2단계: Tailwind 토큰은 CSS 변수를 참조 */
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
}
```

`<html>`에 `.dark` 클래스가 있으면 `.dark` 블록의 변수가 적용되고, 없으면 `:root` 블록의 변수가 적용됩니다. `bg-bg`, `bg-surface` 같은 Tailwind 클래스는 그대로 유지되면서 내부 값만 바뀝니다.

브랜드/시장 색상(primary, up, down, accent)은 다크/라이트 무관하게 동일하므로 `@theme`에 직접 고정값으로 유지했습니다.

`body`에는 `transition: background-color 0.3s ease, color 0.3s ease`를 추가해서 모드 전환 시 부드럽게 변합니다.

---

### `lib/theme.tsx`

테마 상태를 앱 전체에서 공유하기 위한 React Context Provider입니다.

```ts
type Theme = "dark" | "light";
```

`ThemeProvider`가 하는 일:

1. `useState`로 현재 테마 상태를 관리합니다. 초기값은 `'dark'`입니다.
2. 마운트 시(`useEffect`) localStorage에서 저장된 테마를 읽어 상태에 반영합니다. 저장값이 없으면 다크모드를 기본값으로 적용합니다.
3. `document.documentElement.classList.toggle('dark', ...)`로 `<html>` 요소에 `.dark` 클래스를 붙이거나 제거합니다.

`toggleTheme` 함수가 하는 일:

1. 현재 테마를 반전시킵니다 (`dark` → `light`, `light` → `dark`)
2. `localStorage.setItem('theme', next)`로 선택값을 저장합니다
3. `<html>`의 `.dark` 클래스를 토글합니다

`useTheme` 훅은 `ThemeContext`에서 `theme`와 `toggleTheme`을 꺼내서 반환합니다. `ThemeProvider` 밖에서 호출하면 에러를 던져서 잘못된 사용을 방지합니다.

---

### `components/ui/ThemeToggle.tsx`

`useTheme` 훅으로 현재 테마를 읽고, 클릭 시 `toggleTheme`을 호출하는 버튼입니다.

```tsx
{
  theme === "dark" ? "라이트" : "다크";
}
```

현재 다크모드면 "라이트"를, 라이트모드면 "다크"를 표시합니다. 즉 버튼 텍스트는 "전환할 모드"를 나타냅니다.

---

### `app/layout.tsx`

두 가지 작업을 했습니다.

**1. ThemeProvider 적용**

기존 `Providers`(TanStack Query) 안에 `ThemeProvider`를 감쌌습니다.

```tsx
<Providers>
  <ThemeProvider>{children}</ThemeProvider>
</Providers>
```

**2. FOUC 해결 — 인라인 스크립트**

```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})()`,
    }}
  />
</head>
```

**FOUC(Flash of Unstyled Content)란?** 새로고침 후 다크모드가 유지되긴 하는데, 잠깐 라이트모드로 보였다가 스르륵 다크로 전환되는 현상입니다.

**왜 발생하는가?** `useEffect`는 React가 렌더링을 완료한 이후에 실행됩니다. 순서를 보면 브라우저가 HTML을 받아 `.dark` 없이 라이트모드로 화면을 그리고, 그 다음 React가 실행되고, 그 다음 `useEffect`가 돌면서 `.dark`를 붙입니다. 이때 `body`에 transition이 걸려 있으니 라이트 → 다크로 애니메이션이 발동합니다.

**해결 원리:** `<head>` 안의 `<script>`는 브라우저가 `<body>`를 파싱하기 전에 동기적으로 실행됩니다. 이 스크립트가 localStorage를 읽어서 `dark`이면 즉시 `<html>`에 `.dark`를 붙입니다. 이후 `<body>`가 그려질 때는 이미 `.dark`가 붙어있으므로 처음부터 다크모드로 렌더링됩니다. React나 `useEffect`가 실행될 시점엔 이미 올바른 상태이므로 아무 변화가 없고, transition도 발동하지 않습니다.

`dangerouslySetInnerHTML`은 React에서 HTML 문자열을 직접 삽입하는 prop입니다. 외부 입력이 아닌 우리가 직접 작성한 고정 코드이므로 XSS 위험이 없습니다.

---

## 트러블슈팅: FOUC 문제

### 문제 발생

`body`에 transition을 추가한 후, 다크모드로 설정하고 새로고침하면 잠깐 라이트모드로 보였다가 스르륵 다크모드로 전환되는 현상이 발생했습니다.

### 원인 분석

`useEffect`가 React 렌더링 이후에 실행되기 때문입니다. 실행 순서를 보면 다음과 같습니다.

1. 브라우저가 서버로부터 HTML을 받음 → `.dark` 클래스 없음 → 라이트모드로 화면이 그려짐
2. React 로드 및 hydration 실행
3. `useEffect` 실행 → localStorage 읽음 → `<html>`에 `.dark` 추가
4. `body`의 transition 발동 → 라이트 → 다크로 애니메이션이 재생됨

### 해결 방안 검토

**A안 — 인라인 스크립트:** `<head>`에 `<script>`를 넣어 `<body>` 렌더링 전에 동기적으로 실행. localStorage를 읽어 즉시 `.dark`를 붙임.

**B안 — SSR + 쿠키:** localStorage 대신 쿠키에 테마 저장. 서버가 요청 시 쿠키를 읽어 처음부터 `.dark`가 붙은 HTML을 내려줌. 가장 원칙적인 방법이지만, `layout.tsx`에서 `cookies()`를 읽는 순간 하위 모든 페이지가 Dynamic Rendering으로 전환됨. 테마 하나 때문에 전체 페이지를 동적으로 만드는 건 과하다고 판단해 제외.

**C안 — transition 조건부 비활성화:** 마운트 시 transition을 잠깐 끄고 첫 렌더 후 다시 켜는 방식. 타이밍 관리가 까다롭고 코드가 지저분해져 제외.

**SSG/ISR:** 테마는 사용자별 개인 설정이라 빌드 시점에 알 수 없어 불가능.

### 적용한 해결책

A안을 선택해 `layout.tsx`의 `<head>`에 인라인 스크립트를 추가했습니다. 브라우저가 `<body>`를 파싱하기 전에 이 스크립트가 동기적으로 실행되어 localStorage 값을 읽고 즉시 `.dark`를 붙입니다. 이후 `<body>`가 그려질 때는 이미 올바른 테마가 적용된 상태이므로 transition이 발동할 상황 자체가 없어집니다.

---

## 추가 논의 (2026-04-07)

### theme.tsx 리팩토링

ESLint `react-hooks/set-state-in-effect` 경고로 인해 코드를 React 공식 권장 방식으로 변경했다.

**변경 전:** `useState("dark")` + `useEffect`에서 `setTheme` + `classList.toggle`

**변경 후:**

- `useState` lazy initializer로 localStorage에서 초기값 읽기
- `useEffect([theme])`으로 DOM 클래스만 동기화 (setState 없음)
- `toggleTheme` 안의 `classList.toggle` 제거 (useEffect가 자동 처리)

### 왜 쿠키로 안 하는가

쿠키 방식은 서버가 요청 시 쿠키를 읽어 처음부터 올바른 테마로 렌더하므로 FOUC도 없고 dev 경고도 없다.

그러나 `cookies()`를 `layout.tsx`에서 호출하는 순간 하위 모든 페이지가 Static → Dynamic Rendering으로 전환된다. 테마 하나 때문에 전체 앱이 매 요청마다 서버에서 렌더되는 건 과한 트레이드오프다.

### 왜 dev 경고를 감수하는가

light 모드 저장 후 새로고침 시 `Encountered a script tag while rendering React component` 경고가 발생한다.

원인: 서버는 항상 `"dark"`로 렌더(window 없음), 클라이언트는 localStorage에서 `"light"` 읽음 → 불일치 → React 재렌더 → script 태그 경고.

이 경고는 React 19에서 새로 추가된 dev 전용 경고다. 프로덕션 빌드에서는 발생하지 않는다. `next-themes` 등 커뮤니티 표준 라이브러리들도 동일한 인라인 script 방식을 사용하며, 현재 Next.js + React 19 생태계 전체가 안고 있는 이슈다. 현실적으로 최선의 방법이라 감수하기로 결정했다.

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- 다크/라이트 전환 동작 확인
- 새로고침 후 테마 유지 확인
- FOUC 없이 새로고침 후 즉시 올바른 테마로 렌더링 확인
