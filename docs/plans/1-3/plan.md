# Plan 1-3. Tailwind 디자인 토큰 세팅

## 목표

disign.md 기반 색상 토큰 및 Pretendard 폰트를 세팅해서 전체 프로젝트에서 일관되게 사용

---

## 작업 순서

### 1. Pretendard 패키지 설치

```bash
npm install pretendard
```

### 2. `app/layout.tsx` 수정

- Geist 폰트 import 및 변수 제거
- `next/font/local`로 Pretendard 등록
- `<html>` 태그에 폰트 변수 적용

### 3. `app/globals.css` 수정

- Pretendard를 기본 폰트(`font-family`)로 적용
- 색상 토큰 등록

**색상 토큰:**

| 토큰명                   | 값        | 용도          |
| ------------------------ | --------- | ------------- |
| `--color-bg`             | `#0A0A0A` | 배경          |
| `--color-surface`        | `#141414` | 카드/서피스   |
| `--color-border`         | `#232323` | 테두리        |
| `--color-primary`        | `#D4A017` | 브랜드 골드   |
| `--color-primary-hover`  | `#E5B93C` | 골드 호버     |
| `--color-up`             | `#E63B2E` | 상승          |
| `--color-down`           | `#2F6BFF` | 하락          |
| `--color-accent`         | `#FF6A00` | 액센트        |
| `--color-text`           | `#E5E5E5` | 기본 텍스트   |
| `--color-text-secondary` | `#A3A3A3` | 보조 텍스트   |
| `--color-text-disabled`  | `#5A5A5A` | 비활성 텍스트 |

### 4. `docs/disign.md` 폰트 항목 추가

---

## 완료 조건

- Pretendard 폰트 적용 확인
- 색상 토큰 등록 완료
- `npx tsc --noEmit` 타입 에러 없음
