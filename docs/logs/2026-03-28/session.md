# 세션 회의록 - 2026-03-28

## 참여자
- 사용자 (기획/설계 담당)
- Claude (개발 담당)

---

## 회의 내용

### 로드맵 개편

라이트모드 디자인 시스템 도입 논의로 로드맵을 개편했다. Phase 번호 체계를 정리하고 (1-1, 1-2... 형식), Phase 2에 `2-2. 다크/라이트 테마 시스템 구축`을 추가했다. 기존 2-2~2-4는 2-3~2-5로 밀렸다.

### Plan 2-1. 공통 컴포넌트 구현

5개 컴포넌트를 구현했다: `Card`, `Button`, `Badge`, `Title`, `StockTable`.

주요 결정사항:
- `Title` 컴포넌트를 별도 분리해 level 1~3 계층 지원. `Card` 내부에서도 사용.
- `StockTable`은 `title` prop으로 카드 헤더 포함 여부 선택 가능하도록 사용자가 수정.
- 종목 행 클릭 시 이동 방식으로 `router.push` → `Link(contents)` → 롤백 → `Link(absolute inset-0)` 순으로 논의 후 최종 absolute Link 방식 채택.
- `<tr>`에 padding이 적용되지 않는 HTML 스펙 이슈 확인. 양끝 `<td>`에 `pl-4`/`pr-4`로 해결.
- `table-fixed`로 컬럼 너비 고정.

---

### Plan 2-2. 다크/라이트 테마 시스템 구축

CSS 변수 기반으로 다크/라이트 모드를 전환하는 테마 시스템을 구축했다. globals.css를 2단계 구조(:root/.dark → @theme)로 리팩토링하고, ThemeProvider와 useTheme 훅을 구현했다. localStorage로 선택 유지, body transition으로 부드러운 전환 적용.

---

## 현재 상태

- plan 2-1 완료
- plan 2-2 완료

## 다음 할 일

- plan 2-3: 오늘의 테마 목록 피처
