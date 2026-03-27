# Report 1-3. Tailwind 디자인 토큰 세팅

## 작업 결과
완료

---

## 어떤 작업을 했나

### 1. Pretendard 패키지 설치

```bash
npm install pretendard
```

Pretendard는 한국 프로 앱에서 널리 쓰이는 고품질 한국어 폰트입니다. 깔끔하고 가독성이 높아 데이터 밀도가 높은 RION에 적합합니다.

---

### 2. 수정된 파일

#### `app/layout.tsx`

- Geist 폰트(Next.js 기본 폰트)를 완전히 제거했습니다.
- `next/font/local`로 Pretendard를 등록했습니다. `next/font`를 사용하면 Next.js가 폰트를 최적화해서 빠르게 로드합니다.
- `--font-pretendard`라는 CSS 변수로 등록해서 globals.css에서 사용할 수 있게 했습니다.
- 메타데이터(title, description)도 RION에 맞게 수정했습니다.

#### `app/globals.css`

Tailwind v4의 `@theme` 블록을 사용해 디자인 토큰을 등록했습니다. `@theme`에 등록된 값은 Tailwind 유틸리티 클래스로 바로 사용 가능합니다.

예를 들어 `--color-up: #E63B2E`를 등록하면 `text-up`, `bg-up` 같은 클래스를 쓸 수 있습니다.

**등록된 색상 토큰:**

| 클래스명 | 값 | 용도 |
|---|---|---|
| `bg-bg` / `text-bg` | `#0A0A0A` | 배경 |
| `bg-surface` | `#141414` | 카드/서피스 |
| `border-border` | `#232323` | 테두리 |
| `text-primary` | `#D4A017` | 브랜드 골드 |
| `text-primary-hover` | `#E5B93C` | 골드 호버 |
| `text-up` | `#E63B2E` | 상승 |
| `text-down` | `#2F6BFF` | 하락 |
| `text-accent` | `#FF6A00` | 액센트 |
| `text-text` | `#E5E5E5` | 기본 텍스트 |
| `text-text-secondary` | `#A3A3A3` | 보조 텍스트 |
| `text-text-disabled` | `#5A5A5A` | 비활성 텍스트 |

**폰트:**
- `--font-sans`를 Pretendard로 설정해서 `font-sans` 클래스가 Pretendard를 사용하게 했습니다.
- `body`에 배경색(`#0A0A0A`), 기본 텍스트 색(`#E5E5E5`), Pretendard 폰트를 직접 적용했습니다.

#### `docs/disign.md`

타이포그래피 섹션에 `폰트: Pretendard` 항목을 추가했습니다.

---

## 완료 확인

- `npx tsc --noEmit` 타입 에러 없음
