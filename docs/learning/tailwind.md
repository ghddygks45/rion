# Tailwind CSS 학습 노트

## v4 — 클래스 기반 다크모드 설정

Tailwind v4에서 `dark:` 변형은 기본적으로 시스템 설정(미디어 쿼리)으로 동작한다.

```css
/* Tailwind v4 기본 — 시스템 다크모드일 때만 적용 */
@media (prefers-color-scheme: dark) { ... }
```

`.dark` 클래스를 `<html>`에 붙여서 제어하는 방식을 쓰려면 `globals.css`에 아래 한 줄을 추가해야 한다.

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

**의미:** `.dark` 클래스가 붙은 요소 또는 그 하위 요소에서 `dark:` 유틸리티를 적용한다.

```html
<html class="dark">
  <body>
    <div class="dark:bg-black">  ← 적용됨
```

이 설정이 없으면 `<html class="dark">`가 붙어있어도 `dark:hover:bg-white` 같은 유틸리티가 전혀 작동하지 않는다.

> IDE에서 `Unknown at rule @variant` 경고가 뜰 수 있지만 Tailwind v4 전용 문법이라 빌드/런타임에는 문제없다.

---

## v4 — dark:hover: 특이성(Specificity) 충돌

`dark:hover:`와 `hover:`를 같이 쓰면 충돌이 발생할 수 있다.

```css
/* hover:bg-black/5    → :hover          → 점수: 10 */
/* dark:hover:bg-white → :where() + :hover → 점수: 0 + 10 = 10 */
```

`:where()`는 특이성이 0이라 점수가 같아지고, 나중에 선언된 `hover:bg-black/5`가 항상 이긴다. 그래서 다크모드에서 `dark:hover:`가 적용되지 않는다.

**해결:** `@variant dark`를 `:where()` 대신 `:is()`로 선언한다.

```css
/* 기존 - :where() → specificity 0 */
@variant dark (&:where(.dark, .dark *));

/* 변경 - :is() → .dark의 specificity 유지 */
@variant dark (&:is(.dark, .dark *));
```

`:is()`는 안에 있는 선택자의 특이성을 그대로 유지한다. `.dark *`는 클래스(10) + 태그(1) = 11점이 되어 `hover:`(10점)보다 높아진다.

```css
/* 변경 후 */
/* dark:hover:bg-white → :is(.dark *) + :hover → 점수: 11 + 10 = 21 */
/* hover:bg-black/5    → :hover                → 점수: 10 */
/* dark:hover:가 확실히 이김 */
```
