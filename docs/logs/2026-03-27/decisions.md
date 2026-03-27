# 결정사항 - 2026-03-27

## 기술 스택
- **프론트**: Next.js + TypeScript + Tailwind CSS + TanStack Query
- **백엔드**: Next.js Route Handlers (별도 서버 없음)
- **DB**: Supabase (PostgreSQL) + Prisma
- **배포**: Vercel

## 아키텍처
- 피처 베이스 폴더 구조 (`/features/themes`, `/features/theme-detail` 등)
- 서버 로직은 `/server/crawlers`, `/server/queries`로 분리

## MVP 범위
- 포함: 버튼 클릭 → 네이버 크롤링 → DB 저장 → 화면 표시
- 제외: LLM 연동, 크론 자동화, 실시간 알림

## 개발 순서
- Vercel 배포 초반 연결
- 프론트 목업 먼저 완성 → 백엔드 연결

## 협업 방식
- 사용자: 설계/판단
- Claude: 지시받은 코딩만 실행, 범위 초과 금지
