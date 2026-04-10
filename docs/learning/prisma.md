# Prisma 학습 노트

## ORM이란?

ORM(Object-Relational Mapping)은 SQL을 직접 쓰지 않고 JavaScript/TypeScript 코드로 DB를 다루게 해주는 도구다.

원래 방식:
```sql
INSERT INTO news (title, url) VALUES ('제목', 'https://...');
SELECT * FROM news WHERE id = 1;
```

Prisma 사용 시:
```ts
await prisma.news.create({ data: { title: '제목', url: 'https://...' } })
await prisma.news.findUnique({ where: { id: 1 } })
```

TypeScript와 궁합이 좋아서 자동완성과 타입 체크가 된다.

---

## Prisma의 구성 요소

### `prisma/schema.prisma`

Prisma의 설계도 파일. 두 가지를 정의한다.

- **generator**: Prisma Client 코드를 어떻게/어디에 생성할지
- **datasource**: 어떤 종류의 DB를 쓸지 (postgresql, mysql 등)
- **model**: DB 테이블 구조 (plan 3-4에서 추가 예정)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// 나중에 모델 추가 예시:
model News {
  id        Int      @id @default(autoincrement())
  title     String
  url       String
  createdAt DateTime @default(now())
}
```

### `prisma.config.ts`

Prisma CLI 명령어가 읽는 설정 파일. DB 연결 주소를 여기서 지정한다 (Prisma 7부터).

```ts
datasource: {
  url: process.env["DATABASE_URL"],
},
```

### `lib/generated/prisma/`

`npx prisma generate` 실행 시 자동 생성되는 TypeScript 코드들. 직접 편집 금지.

---

## 주요 CLI 명령어

| 명령어 | 역할 |
|---|---|
| `npx prisma init` | 초기 설정 파일들 생성 |
| `npx prisma generate` | schema.prisma 기반으로 TypeScript 클라이언트 코드 생성 |
| `npx prisma db pull` | DB에 있는 테이블을 읽어서 schema.prisma에 자동 작성 |
| `npx prisma migrate dev` | schema.prisma의 모델을 실제 DB 테이블로 생성/변경 |
| `npx prisma studio` | DB 내용을 웹 UI로 볼 수 있는 GUI 실행 |

---

## Prisma 7의 변화 (이전 버전 대비)

### 이전 방식 (Prisma 5.x 이하)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")   // schema.prisma에 url 작성
}
```

```ts
const prisma = new PrismaClient()  // 어댑터 없이 바로 사용
```

### Prisma 7 방식

```prisma
datasource db {
  provider = "postgresql"
  // url 없음! prisma.config.ts로 이동
}
```

```ts
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
```

더 복잡해졌지만, Edge Runtime(Cloudflare Workers 등) 같은 다양한 환경에서도 동작하게 되었다.

---

## 싱글톤 패턴 (lib/prisma.ts)

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

**왜 싱글톤인가:** Next.js 개발 환경에서 파일이 바뀌면 Hot Reload가 발생한다. 이때마다 `new PrismaClient()`가 새로 만들어지면 DB 연결이 쌓인다. PostgreSQL은 동시 연결 수 제한이 있어서 이를 초과하면 에러가 난다.

**해결:** `globalThis`(어디서든 접근 가능한 전역 객체)에 인스턴스를 저장한다. 이미 있으면 새로 만들지 않고 기존 것을 재사용한다(`??` 연산자).

**프로덕션에서 왜 globalThis에 저장 안 하나:** 배포 환경은 Hot Reload가 없어서 한 번만 만들어지기 때문에 저장할 필요가 없다.

---

## 환경변수 파일 두 가지

| 파일 | 읽는 주체 | 용도 |
|---|---|---|
| `.env` | Prisma CLI (`dotenv/config` via `prisma.config.ts`) | `npx prisma migrate`, `npx prisma db pull` 등 터미널 명령어 |
| `.env.local` | Next.js 런타임 | 앱이 실행될 때 `process.env.DATABASE_URL` 접근 |

둘 다 Git에 올리면 안 된다. `.gitignore`에 포함 필수.
