# Plan 3-3 완료 보고서: Supabase + Prisma 연결

## 무엇을 했나

Supabase PostgreSQL 데이터베이스에 Prisma ORM을 연결했다.
아직 테이블은 없고, "연결이 된다"는 것만 확인한 단계다.
이후 plan들(뉴스 크롤링 저장, API 연결)을 위한 DB 접근 기반을 마련했다.

---

## 만들거나 수정한 파일

### `prisma/schema.prisma` (신규)

Prisma의 설계도 파일이다. 두 가지를 정의한다.

- **generator**: Prisma Client를 어떻게 생성할지. `prisma-client` 제너레이터를 사용하고, 생성된 코드를 `lib/generated/prisma`에 저장하도록 지정했다.
- **datasource**: 어떤 종류의 DB를 쓸지. `postgresql`을 지정했다. Prisma 7부터 url은 여기에 쓰지 않는다.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### `prisma.config.ts` (자동 생성 후 유지)

`npx prisma init` 실행 시 자동으로 생성된 파일이다. Prisma CLI 명령어(`prisma db pull`, `prisma migrate` 등)가 이 파일을 읽어서 DB 연결 주소를 파악한다. `.env` 파일의 `DATABASE_URL`을 읽어오도록 설정되어 있다.

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### `.env` (신규)

Prisma CLI 명령어가 읽는 환경변수 파일이다. `DATABASE_URL`을 실제 Supabase 연결 문자열로 설정했다. **Git에 올라가면 안 된다.**

### `.env.local` (수정)

Next.js 앱이 실행될 때 읽는 환경변수 파일이다. `DATABASE_URL`을 추가했다. `.env`와 내용은 같지만 역할이 다르다. `.env`는 CLI용, `.env.local`은 런타임용이다.

### `lib/prisma.ts` (신규)

앱 전체에서 사용할 PrismaClient 싱글톤이다. 가장 중요한 파일이다.

```ts
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**왜 싱글톤인가:** Next.js 개발 환경에서는 코드 변경 시 Hot Reload가 발생한다. 그때마다 `new PrismaClient()`가 새로 만들어지면 DB 연결이 쌓인다. Supabase 무료 플랜은 동시 연결 수 제한이 있어 이를 초과하면 에러가 난다. `globalThis`에 인스턴스를 저장해 재사용함으로써 이를 방지한다.

**왜 어댑터가 필요한가:** Prisma 7부터 직접 DB 연결을 위해 드라이버 어댑터가 필수다. `@prisma/adapter-pg`가 PostgreSQL용 어댑터이고, 내부적으로 `pg` 라이브러리를 사용한다.

### `lib/generated/prisma/` (자동 생성)

`npx prisma generate` 실행 시 자동 생성된 TypeScript 코드들이다. 직접 편집하지 않는다. 모델을 추가할 때마다 재생성한다.

---

## 설치한 패키지

| 패키지 | 역할 |
|---|---|
| `prisma` | Prisma CLI 도구 (init, generate, migrate 등 명령어) |
| `@prisma/client` | 앱에서 DB를 조회할 때 사용하는 라이브러리 |
| `@prisma/adapter-pg` | Prisma 7의 PostgreSQL 드라이버 어댑터 |
| `pg` | Node.js용 PostgreSQL 클라이언트 |
| `@types/pg` | pg의 TypeScript 타입 정의 |

---

## Prisma 7의 변화 (이전 버전과 다른 점)

Prisma 5.x 이하에서는 아래처럼 단순했다.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```ts
// 어댑터 없이 바로 사용 가능했다
const prisma = new PrismaClient()
```

Prisma 7에서는:
- `schema.prisma`에 `url` 작성 불가 → `prisma.config.ts`로 이동
- `new PrismaClient()`에 드라이버 어댑터를 반드시 전달해야 함

더 복잡해졌지만, 이 방식은 Prisma를 다양한 환경(Edge Runtime, Cloudflare Workers 등)에서도 쓸 수 있게 한다.

---

## 완료 검증

- `npx prisma db pull` → Supabase 연결 성공 확인 (DB가 비어있어 P4001이 뜨지만 연결은 됨)
- `npx tsc --noEmit` → 타입 에러 없음
- `npm run build` → 빌드 성공
