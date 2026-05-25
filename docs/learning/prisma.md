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
| `@default(now())` | 삽입 시각을 자동으로 기록. **PostgreSQL이 직접 넣어줌** (Prisma가 아님) |
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

---

## Supabase + Prisma 연결 포트 (5432 vs 6543)

Supabase에 연결하는 방법이 두 가지다.

### 포트 5432 — 직접 연결 (Direct connection)

```
앱 → pg 라이브러리 → Supabase DB (포트 5432)
```

- DB 서버에 직접 연결하는 방식
- 마이그레이션(`npx prisma migrate dev`)에 사용
- **Vercel 서버리스 환경에서 문제 발생**: 요청마다 함수가 켜졌다 꺼지면서 DB 연결이 계속 새로 생성됨 → 연결이 수백 개 쌓여서 DB가 감당 못하고 터짐

### 포트 6543 — 풀러 경유 (Connection Pooler)

```
앱 → pg 라이브러리 → Supabase Pooler (포트 6543) → Supabase DB
```

- 중간 다리(Pooler)를 거쳐서 연결하는 방식
- 아무리 많은 요청이 와도 DB 연결은 최대 15개만 유지
- **Vercel 배포 환경에서 필수**: 서버리스 특성상 연결이 폭발적으로 늘어나는 걸 막아줌

### 왜 싱글톤 패턴만으로 해결이 안 되나

`globalThis`에 Prisma 인스턴스를 캐시해서 재사용하는 싱글톤 패턴이 있다. 하지만 Vercel 서버리스는 함수가 완전히 꺼졌다 켜지면 `globalThis`가 초기화된다. 그러면 싱글톤 의미가 없어지고 매번 새 연결이 생긴다. 그래서 앱 레벨 코드만으로는 해결이 안 되고 Pooler가 필요하다.

### 연결 문자열 형식

```
# 직접 연결 (마이그레이션용)
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# 풀러 연결 (앱 런타임용, Vercel 배포)
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

username 형식이 다르다: 직접 연결은 `postgres`, 풀러는 `postgres.[PROJECT-REF]`

---

## @default(now()) — 누가 현재 시각을 넣어주나

```prisma
createdAt  DateTime  @default(now())
```

이 설정이 있으면 데이터를 저장할 때 `createdAt`을 직접 안 써도 자동으로 현재 시각이 들어간다. 그런데 이걸 넣어주는 주체가 **Prisma가 아니라 PostgreSQL(DB 자체)** 이다.

Prisma가 `INSERT INTO` 쿼리를 날릴 때 `createdAt`을 명시하지 않으면, PostgreSQL이 스스로 "지금 몇 시지? 이 컬럼 기본값 채워야겠다"하고 현재 시각을 넣는다. 이게 DB 레벨의 `DEFAULT` 기능이다.

그래서 Prisma 코드에서 `createdAt`을 쓸 필요가 없다:

```ts
// createdAt 없이 저장해도 DB가 알아서 채워줌
prisma.todaysTheme.create({
  data: {
    date: "20260522",
    type: "topVolumeThemes",
    data: [...],
  }
})
```

`@default(autoincrement())`도 마찬가지다. id를 직접 안 넣어도 PostgreSQL이 1, 2, 3... 순서로 자동으로 채워준다.

---

## @@unique — 여러 컬럼 조합에 거는 중복 방지

`@unique`는 컬럼 하나에 중복을 막는다.
`@@unique`(더블 골뱅이)는 **여러 컬럼의 조합**이 중복될 때 막는다.

```prisma
model TodaysTheme {
  id        Int      @id @default(autoincrement())
  date      String   // 예: "20260522"
  type      String   // 예: "topVolumeThemes"
  data      Json

  @@unique([date, type])
}
```

위 예시에서 `date`만으로는 중복 허용, `type`만으로도 중복 허용.
하지만 `date + type` 조합이 같으면 저장이 막힌다.

| date | type | 저장 가능? |
|------|------|----------|
| "20260522" | "topVolumeThemes" | ✅ |
| "20260522" | "topChangeRateThemes" | ✅ (type이 다름) |
| "20260523" | "topVolumeThemes" | ✅ (date가 다름) |
| "20260522" | "topVolumeThemes" | ❌ (조합 중복) |

---

## prisma migrate dev vs prisma generate

두 명령어가 하는 일이 다르다.

```bash
npx prisma migrate dev --name add_todays_theme
```
→ **DB에 실제 테이블을 생성/변경**한다. SQL을 실행하는 것.
→ `prisma generate`도 내부적으로 자동 실행된다.

```bash
npx prisma generate
```
→ **TypeScript 클라이언트 코드만 재생성**한다. DB는 건드리지 않는다.
→ `prisma.todaysTheme.upsert()` 같은 코드가 타입 에러 없이 작동하려면 generate가 먼저 되어 있어야 한다.

스키마를 바꿀 때마다 이 두 가지 세트:
1. `migrate dev` → DB 반영
2. `generate` → TypeScript 반영 (`migrate dev`가 자동으로 해주므로 보통 따로 안 해도 됨)

generate를 따로 쓰는 경우: migrate 없이 타입만 빠르게 갱신하고 싶을 때.

---

## upsert — "있으면 수정, 없으면 생성"

`upsert` = update + insert 합친 말.

```ts
await prisma.todaysTheme.upsert({
  where: { date_type: { date: "20260522", type: "topVolumeThemes" } },
  update: { data: 새데이터 },
  create: { date: "20260522", type: "topVolumeThemes", data: 새데이터 },
});
```

- `where` — 이 조건에 맞는 행이 있는지 찾는다 (@@unique 컬럼 조합으로 찾음)
- `update` — 행이 **있으면** 이 데이터로 덮어쓴다
- `create` — 행이 **없으면** 새로 만든다

`update`만 있으면 행이 없을 때 에러가 나고,
`create`만 있으면 행이 이미 있을 때 에러가 난다.
두 개를 세트로 써야 어느 상황이든 안전하다.

---

## @@unique + upsert 조합으로 "항상 최신 1행 유지하기"

날짜별로 스냅샷 데이터를 저장할 때 자주 쓰는 패턴이다.

`@@unique([date, type])`이 있으면, 같은 `date + type` 조합으로 `upsert`를 몇 번 해도 항상 1행만 유지된다.

```
10시에 저장: date="20260522", type="topVolumeThemes" → 행 생성
11시에 저장: date="20260522", type="topVolumeThemes" → 기존 행 덮어씀 (여전히 1행)
12시에 저장: date="20260522", type="topVolumeThemes" → 또 덮어씀 (여전히 1행)
```

날짜가 바뀌면(`20260523`) 새 행이 생긴다. 이렇게 날짜별로 데이터가 쌓인다.

---

## 스냅샷 방식 DB 저장 전략

실시간 API를 매번 호출하면 두 가지 문제가 있다:
1. 느리다 — API 응답 기다리는 동안 사용자가 로딩을 봐야 한다
2. API 호출 수 제한이 있다 — 키움 같은 유료 API는 초당/일당 호출 횟수 제한이 있다

**스냅샷 방식:**
1. 처음 방문 시 → API 호출 → 데이터 처리 → DB에 저장 (스냅샷 찍기)
2. 이후 방문 시 → DB에서 즉시 가져옴 (API 호출 없음, 빠름)
3. 일정 시간 후 → 다시 API 호출해서 DB 갱신 (`staleTime`으로 제어)

DB가 캐시 역할을 한다. API는 처음 또는 데이터가 오래됐을 때만 호출한다.
