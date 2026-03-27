# RION 개발 가이드 (Claude 참조용)

## 1. 프로젝트 개요

한국 주식시장 특화 인텔리전스 서비스.
오늘의 테마/섹터 흐름을 빠르게 파악할 수 있는 의사결정 지원 도구.

자세한 내용 → `product.md`, `disign.md` 참조

---

## 2. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일 | Tailwind CSS |
| 서버 상태 | TanStack Query |
| ORM | Prisma |
| DB | Supabase (PostgreSQL) |
| 배포 | Vercel |

---

## 3. 현재 개발 단계 (MVP)

**포함:**
- 버튼 클릭 → 네이버 뉴스 크롤링 → DB 저장 → 화면 표시
- Next.js Route Handlers로 API 처리

**제외 (나중에 추가):**
- LLM 요약/분석
- 자동 크론 스케줄링
- 실시간 알림
- 실시간 시세 연동

---

## 4. 협업 방식

**역할 분리:**
- 사용자: 설계, 판단, 우선순위 결정
- Claude: 지시받은 코딩만 실행

**코딩 원칙:**
- 요청한 범위만 구현한다. 그 이상 하지 않는다.
- 요청하지 않은 기능, 리팩토링, 최적화, 에러 핸들링 추가 금지
- 요청하지 않은 주석, 타입, 유틸 함수 추가 금지
- "이런 것도 하면 좋을 것 같아서" 식의 판단 금지

---

## 5. 디자인 원칙

`disign.md` 를 엄격히 따른다.

핵심만 요약:
- 다크모드: 배경 `#0A0A0A`, 서피스 `#141414`
- 브랜드 골드: `#D4A017`
- 상승: `#E63B2E` / 하락: `#2F6BFF`
- 카드 기반 레이아웃, 장식 최소화
- 추가 색상 도입 금지

---

## 6. 파일 구조 (예정)

```
/app
  /(routes)           - 페이지 라우트 (프론트)
  /api                - API 엔드포인트 (백엔드)

/features             - 기능 단위 모듈 (피처 베이스)
  /themes             - 오늘의 테마 목록
  /theme-detail       - 테마 상세
  /stock-detail       - 종목 상세
  /alerts             - 알림 (나중)
  각 피처 내부:
    /components       - UI 컴포넌트
    /hooks            - TanStack Query 훅

/server               - 서버 전용 로직 (백엔드)
  /crawlers           - 크롤링
  /queries            - DB 쿼리

/prisma               - schema.prisma
/lib                  - 공용 유틸 (양쪽 사용)
```
