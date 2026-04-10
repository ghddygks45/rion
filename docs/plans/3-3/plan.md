# Plan 3-3. Supabase 프로젝트 생성 + Prisma 연결

## 목표

Supabase에 PostgreSQL DB를 생성하고 Prisma ORM을 연결한다.
이후 뉴스 크롤링 데이터를 저장할 기반을 마련한다.

---

## 현재 상태

- Prisma 패키지는 아직 설치되지 않음
- Supabase 프로젝트 없음
- DB 연결 없음

---

## 구현 단계

### 1. Supabase 프로젝트 생성 (수동, 사용자 작업)

- https://supabase.com 에서 새 프로젝트 생성
- 프로젝트 생성 후 Settings → Database → Connection string (URI) 복사

### 2. Prisma 설치

```bash
npm install prisma @prisma/client
npx prisma init
```

- `prisma/schema.prisma` 생성됨
- `.env` 파일에 `DATABASE_URL` 항목 생성됨

### 3. `.env` 설정

```env
DATABASE_URL="postgresql://..."  # Supabase Connection string (URI) 붙여넣기
```

### 4. `prisma/schema.prisma` 설정

datasource와 generator만 확인. 모델은 plan 3-4에서 추가.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Prisma Client 싱글톤 생성

`lib/prisma.ts` — Next.js dev 환경에서 hot reload 시 중복 인스턴스 방지

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 6. 연결 확인

`npx prisma db pull` 실행하여 Supabase DB 연결이 정상인지 확인.

---

## 완료 조건

- `npx prisma db pull` 성공 (연결 확인)
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
