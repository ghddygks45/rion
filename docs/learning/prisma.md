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
- **model**: DB 테이블 구조

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model News {
  id          Int      @id @default(autoincrement())
  ticker      String
  title       String
  url         String   @unique
  press       String
  publishedAt DateTime
  createdAt   DateTime @default(now())
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

---

## 모델(Model) 필드 타입과 어노테이션

### 기본 타입

| Prisma 타입 | 설명 | SQL 타입 |
|---|---|---|
| `Int` | 정수 | `INTEGER` |
| `String` | 문자열 | `TEXT` |
| `Boolean` | true/false | `BOOLEAN` |
| `DateTime` | 날짜+시간 | `TIMESTAMP` |
| `Float` | 소수 | `DOUBLE PRECISION` |

### 어노테이션 (@)

| 어노테이션 | 설명 |
|---|---|
| `@id` | 기본키(Primary Key). 테이블에서 각 행을 유일하게 식별하는 값 |
| `@default(autoincrement())` | 새 데이터 삽입 시 자동으로 1, 2, 3... 증가 |
| `@default(now())` | 삽입 시각을 자동으로 기록 |
| `@unique` | 이 필드에 중복값 저장 불가. DB 레벨에서 강제 |

### `@unique` 활용 예시

뉴스 크롤링 시 같은 기사가 여러 번 수집될 수 있다. url에 `@unique`를 걸면 중복 저장 시도 자체를 DB가 막아준다.

```ts
// url이 이미 있으면 에러 발생 → upsert로 처리 가능
await prisma.news.create({ data: { url: 'https://...', ... } })
```

---

## 마이그레이션(Migration)이란?

DB 구조 변경을 **기록하고 적용**하는 과정이다. 단순히 테이블을 만드는 게 아니라 변경 이력을 SQL 파일로 남긴다.

### `npx prisma migrate dev --name init`

이 명령어 하나가 세 가지 일을 한다:
1. `prisma/migrations/날짜_이름/migration.sql` 파일 생성
2. 그 SQL을 DB에 실제 적용 (테이블 생성/변경)
3. Prisma Client 재생성 (`prisma generate` 자동 실행)

### `migrate dev` vs `db push`

| 명령어 | 마이그레이션 파일 | 용도 |
|---|---|---|
| `prisma migrate dev` | 생성됨 (이력 관리) | 개발/프로덕션 정식 방식 |
| `prisma db push` | 생성 안 됨 | 빠른 프로토타이핑용 |

포트폴리오/실제 서비스에는 `migrate dev`가 맞다. 변경 이력이 Git에 남아서 "DB가 어떻게 진화했는지" 추적 가능하다.

### migration.sql을 Git에 포함하는 이유

새 환경(배포 서버, 팀원 PC)에서 `npx prisma migrate deploy`를 실행하면 이 파일들을 순서대로 적용해서 똑같은 DB 구조를 재현할 수 있다. DB의 버전 관리인 셈이다.
