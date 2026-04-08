# 백엔드 기초 — 왜 서버가 필요한가

## 핵심 질문: 브라우저가 키움 API를 직접 부르면 안 되나?

안 된다. **API 키가 노출**되기 때문이다.

브라우저에서 실행되는 코드는 누구나 개발자 도구로 볼 수 있다.
브라우저가 키움 API를 직접 호출하면 앱키/앱시크릿이 그대로 노출된다.

---

## 해결책: 서버를 중간에 둔다

```
브라우저 → 우리 서버 → 키움 API
```

- 브라우저는 우리 서버에만 요청한다
- 앱키/앱시크릿은 서버에만 있다 (.env.local)
- 키움은 서버하고만 대화한다

---

## 기존 프로젝트와 비교

기존에 이런 코드를 썼다면:

```ts
export function useUpdateArticle(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ArticleUpdateRequest) => updateArticle(articleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
    },
  });
}
```

여기서 `updateArticle(url)` 에 넣은 URL이 **백엔드 서버 주소**였다.
그 URL 뒤에서 무슨 일이 일어나는지는 백엔드 개발자가 만들었던 것이다.

지금은 그 URL 자체를 우리가 직접 만드는 것이다.

---

## Next.js에서 백엔드 만드는 방법

Next.js App Router에서는 별도 서버 없이 `app/api/` 안에 `route.ts`를 만들면 자동으로 API 엔드포인트가 된다.

```
app/api/kiwoom/themes/route.ts
→ /api/kiwoom/themes 라는 URL이 자동 생성됨
```

---

## 실제 흐름 (RION 프로젝트 기준)

```
브라우저 (useQuery)
  → /api/kiwoom/themes (route.ts, 우리가 만든 서버 URL)
    → kiwoomFetcher.ts (키움 API 호출 내부 도구)
      → 키움 API 서버
```

필요한 코드는 두 가지:
1. `route.ts` — 백엔드 URL 만드는 코드 (기존 백엔드 개발자가 하던 역할)
2. `useQuery` — 브라우저에서 그 URL을 호출하는 코드 (기존에 쓰던 방식과 동일)
