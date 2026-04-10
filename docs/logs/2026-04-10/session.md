# 세션 회의록 - 2026-04-10

## 참여자
- 사용자 (기획/설계 담당)
- Claude (개발 담당)

---

## 현황 파악

plan 3-2까지 완료된 상태. plan 3-3(Supabase + Prisma 연결) 진행.

---

## plan 3-3. Supabase + Prisma 연결

### 주요 결정 사항

#### Prisma 7 드라이버 어댑터 방식 채택

`npx prisma init` 실행 결과 Prisma 7.7.0이 설치됨. Prisma 7은 이전 버전(5.x 이하)과 달리:
- `schema.prisma`에 `url` 작성 불가 → `prisma.config.ts`로 분리
- 직접 DB 연결 시 드라이버 어댑터(`@prisma/adapter-pg`) 필수

버전 다운그레이드 대신 최신 방식을 따르기로 결정.

#### 환경변수 두 곳에 설정

- `.env` → Prisma CLI 명령어용 (`prisma.config.ts`가 읽음)
- `.env.local` → Next.js 런타임용

#### PrismaClient 싱글톤 (`lib/prisma.ts`)

Hot Reload 시 DB 연결 누적 방지를 위해 `globalThis` 기반 싱글톤 패턴 사용.

### 설치 패키지

- `prisma`, `@prisma/client`
- `@prisma/adapter-pg`, `pg`, `@types/pg`

구현 완료. 자세한 내용 → `docs/plans/3-3/report.md`

---

## 현재 상태

- plan 3-3 완료

## 다음 할 일

- plan 3-4 진행 (DB 스키마 설계 및 마이그레이션 - 뉴스 전용)
