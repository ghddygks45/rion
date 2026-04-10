# Plan 3-4. DB 스키마 설계 및 마이그레이션 (뉴스 전용)

## 목표

뉴스 크롤링 데이터를 저장할 DB 테이블을 설계하고, Prisma migrate로 Supabase에 실제 테이블을 생성한다.

---

## 현재 상태

- Prisma + Supabase 연결 완료 (plan 3-3)
- `prisma/schema.prisma`에 모델 없음 (빈 상태)
- 다음 plan(3-5)에서 네이버 뉴스 크롤링 로직을 구현할 예정

---

## 저장할 데이터

네이버 뉴스 크롤링 결과:
- 기사 제목
- 기사 URL
- 언론사
- 발행 일시
- 관련 종목 티커 (어떤 종목의 뉴스인지)

---

## 모델 설계

### `News`

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

| 필드 | 타입 | 설명 |
|---|---|---|
| id | Int | 자동 증가 PK |
| ticker | String | 관련 종목 코드 (예: "005930") |
| title | String | 기사 제목 |
| url | String | 기사 URL. unique로 중복 저장 방지 |
| press | String | 언론사명 |
| publishedAt | DateTime | 기사 발행 일시 |
| createdAt | DateTime | DB 저장 시각 (자동) |

**url을 unique로 설정하는 이유:** 같은 기사가 여러 번 크롤링될 때 중복 저장을 방지하기 위해.

---

## 구현 단계

### 1. `prisma/schema.prisma`에 News 모델 추가

### 2. `npx prisma migrate dev --name init`

Supabase DB에 실제 테이블 생성. 이 명령어는:
- `prisma/migrations/` 폴더에 마이그레이션 SQL 파일을 생성한다
- Supabase DB에 `news` 테이블을 실제로 만든다
- Prisma Client를 재생성한다

### 3. `npx prisma generate`

Prisma Client 재생성. `prisma.news.create()` 등의 타입이 생성된다.

---

## 완료 조건

- Supabase 대시보드에서 `news` 테이블 확인
- `npx tsc --noEmit` 타입 에러 없음
- `npm run build` 빌드 성공
