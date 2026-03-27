# Plan 2-2. 다크/라이트 테마 시스템 구축

## 목표

CSS 변수 기반으로 다크/라이트 모드를 전환할 수 있는 테마 시스템을 구축한다.
컴포넌트 코드는 건드리지 않고 `globals.css`와 theme provider만 수정한다.

---

## 작업 순서

### 1. `app/globals.css` 리팩토링

현재 `@theme`에 색상 값이 하드코딩되어 있는 구조를 CSS 변수를 참조하는 구조로 변경한다.

**변경 전:**
```css
@theme {
  --color-bg: #0A0A0A;
  --color-surface: #141414;
  ...
}
```

**변경 후:**
```css
/* 모드별 CSS 변수 정의 */
:root {
  --bg: #F4F4F5;
  --surface: #FFFFFF;
  ...
}

.dark {
  --bg: #0A0A0A;
  --surface: #141414;
  ...
}

/* Tailwind 토큰은 CSS 변수를 참조 */
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  ...
}
```

**라이트/다크 색상표:**

| 토큰 | 라이트 | 다크 |
|---|---|---|
| bg | `#F4F4F5` | `#0A0A0A` |
| surface | `#FFFFFF` | `#141414` |
| border | `#E4E4E7` | `#232323` |
| text | `#18181B` | `#E5E5E5` |
| text-secondary | `#71717A` | `#A3A3A3` |
| text-disabled | `#A1A1AA` | `#5A5A5A` |
| primary | `#D4A017` | `#D4A017` |
| primary-hover | `#E5B93C` | `#E5B93C` |
| up | `#E63B2E` | `#E63B2E` |
| down | `#2F6BFF` | `#2F6BFF` |
| accent | `#FF6A00` | `#FF6A00` |

> 브랜드/시장 색상(primary, up, down, accent)은 모드에 무관하게 동일

---

### 2. `lib/theme.tsx` — ThemeProvider 구현

- `'use client'`
- `localStorage`에 테마 값 저장/복원
- `html` 요소에 `.dark` 클래스 토글
- `useTheme` 훅 제공 (`theme`, `toggleTheme`)

---

### 3. `app/layout.tsx` — ThemeProvider 적용

기존 Providers로 감싸진 구조에 ThemeProvider 추가.

---

### 4. 테마 토글 버튼 — `components/ui/ThemeToggle.tsx`

- `useTheme` 훅 사용
- 다크 → 라이트 / 라이트 → 다크 전환 버튼
- 아이콘 없이 텍스트로 구현 (`다크` / `라이트`)

---

### 5. `app/page.tsx`에 ThemeToggle 배치 후 확인

---

## 완료 조건

- 버튼 클릭 시 다크/라이트 전환 동작
- 새로고침 후에도 선택한 테마 유지 (localStorage)
- 기본값은 다크모드
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
- localhost:3000 화면 확인 (다크/라이트 전환 스크린샷)
