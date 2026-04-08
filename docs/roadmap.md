# RION 개발 로드맵

## Phase 1. 기반 세팅

- [x] 1-1. Next.js 프로젝트 생성 (TypeScript, Tailwind, App Router)
- [x] 1-2. TanStack Query 설치 및 Provider 세팅
- [x] 1-3. Tailwind 디자인 토큰 세팅 (disign.md 기반 색상, 폰트)
- [x] 1-4. Vercel 배포 연결 (GitHub 연동)

---

## Phase 2. 프론트엔드 (목업 데이터)

- [x] 2-1. 공통 컴포넌트 구현 (카드, 테이블, 버튼, 타이틀 등)
- [x] 2-2. 다크/라이트 테마 시스템 구축 (CSS 변수 기반 모드 전환)
- [x] 2-3. 오늘의 테마 목록 피처
- [x] 2-4. 테마 상세 피처
- [x] 2-5. 종목 상세 피처

---

## Phase 3. 백엔드 연결

- [x] 3-1. 키움 REST API 연결 + 실제 데이터 확인 + 타입 정의
- [x] 3-2. 키움 API 데이터 브라우저 연결 테스트 (테마 목록 실데이터)
- [ ] 3-3. Supabase 프로젝트 생성 + Prisma 연결
- [ ] 3-4. DB 스키마 설계 및 마이그레이션 (뉴스 전용)
- [ ] 3-5. 네이버 뉴스 크롤링 로직 구현
- [ ] 3-6. 크롤링 결과 DB 저장 로직
- [ ] 3-7. API Route 구현 (Next.js Route Handlers)
- [ ] 3-8. 목업 데이터 → 실제 API 연결

---

## Phase 4. 고도화 (나중)

- [ ] 4-1. LLM 요약 연동
- [ ] 4-2. 크론 자동화 (cron-job.org)
- [ ] 4-3. 알림 시스템
