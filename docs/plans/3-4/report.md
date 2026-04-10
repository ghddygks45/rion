# Plan 3-4 완료 보고서: DB 스키마 설계 및 마이그레이션

## 무엇을 했나

`prisma/schema.prisma`에 `News` 모델을 추가하고, `prisma migrate dev`로 Supabase에 실제 테이블을 생성했다.

---

## 만들거나 수정한 파일

### `prisma/schema.prisma` (수정)

News 모델을 추가했다.

```prisma
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

| 필드 | 설명 |
|---|---|
| id | 자동 증가 PK |
| ticker | 관련 종목 코드 (예: "005930") |
| title | 기사 제목 |
| url | 기사 URL. `@unique`로 중복 저장 방지 |
| press | 언론사명 |
| publishedAt | 기사 발행 일시 |
| createdAt | DB 저장 시각 (자동) |

`url`을 `@unique`로 설정한 이유: 같은 기사가 여러 번 크롤링돼도 중복 저장되지 않도록 하기 위해.

### `prisma/migrations/20260410144201_init/migration.sql` (자동 생성)

`prisma migrate dev` 실행 시 자동으로 생성된 SQL 파일이다. 실제로 Supabase DB에 적용된 SQL이 기록된다.

```sql
CREATE TABLE "News" (
  "id" SERIAL NOT NULL,
  "ticker" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "press" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "News_url_key" ON "News"("url");
```

이 파일은 Git에 포함시킨다. 나중에 다른 환경(팀원 PC, 배포 서버 등)에서 같은 DB 구조를 재현할 수 있기 때문이다.

### `lib/generated/prisma/` (재생성)

`npx prisma generate`로 재생성됐다. 이제 `prisma.news.create()`, `prisma.news.findMany()` 등의 타입이 사용 가능하다.

---

## 실행한 명령어

```bash
npx prisma migrate dev --name init
```

이 명령어가 하는 일:
1. `schema.prisma`의 변경사항을 감지
2. `prisma/migrations/` 폴더에 SQL 파일 생성
3. Supabase DB에 SQL 적용 (테이블 실제 생성)
4. Prisma Client 재생성

---

## 완료 검증

- Supabase 대시보드 Table Editor에서 `News` 테이블 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
