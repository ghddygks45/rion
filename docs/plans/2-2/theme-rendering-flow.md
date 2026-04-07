# 테마 렌더링 순서

## 처음 접속 (localStorage 비어있음)

```
1. 서버
   [lib/theme.tsx]
   - useState lazy initializer 실행
   - typeof window === "undefined" → true
   - return "dark" → theme = "dark"
   - "dark" 기준으로 HTML 생성 → 브라우저 전송

2. 브라우저 — <head> 파싱
   [app/layout.tsx - 인라인 script]
   (function(){
     var t = localStorage.getItem('theme') || 'dark'
     // null || 'dark' → 'dark'
     if(t === 'dark') document.documentElement.classList.add('dark')
     // true → <html>에 .dark 붙임
   })()
   - <body> 렌더링 → 처음부터 다크모드 (FOUC 없음)

3. 브라우저 — hydration
   [lib/theme.tsx]
   - lazy initializer 다시 실행
   - typeof window === "undefined" → false
   - localStorage.getItem("theme") → null
   - null || "dark" → "dark"
   - theme = "dark"
   - 서버("dark") = 클라("dark") → 일치 → 재렌더 없음

4. [lib/theme.tsx - useEffect]
   useEffect(() => {
     document.documentElement.classList.toggle("dark", theme === "dark")
     // toggle("dark", true) → 이미 .dark 있음 → 변화 없음
   }, [theme])
```

---

## 토글 클릭 (dark → light)

```
5. [lib/theme.tsx - toggleTheme]
   const next = "dark" === "dark" ? "light" : "dark"  // "light"
   setTheme("light")
   localStorage.setItem("theme", "light")

6. [lib/theme.tsx - useEffect]
   - theme = "light"로 바뀌어 useEffect 재실행
   - classList.toggle("dark", false)
   - .dark 제거 → 라이트모드 전환
```

---

## 새로고침 (localStorage에 "light" 저장된 상태)

```
1. 서버
   [lib/theme.tsx]
   - lazy initializer 실행
   - typeof window === "undefined" → true
   - return "dark" → theme = "dark"
   - "dark" 기준으로 HTML 생성 → 브라우저 전송

2. 브라우저 — <head> 파싱
   [app/layout.tsx - 인라인 script]
   (function(){
     var t = localStorage.getItem('theme') || 'dark'
     // "light" || 'dark' → "light"
     if(t === 'dark') document.documentElement.classList.add('dark')
     // false → .dark 안 붙임
   })()
   - <body> 렌더링 → 라이트모드 (FOUC 없음)

3. 브라우저 — hydration
   [lib/theme.tsx]
   - lazy initializer 다시 실행
   - typeof window === "undefined" → false
   - localStorage.getItem("theme") → "light"
   - theme = "light"
   - 서버("dark") vs 클라("light") 불일치 → 재렌더 → dev 경고

4. [lib/theme.tsx - useEffect]
   - classList.toggle("dark", false)
   - .dark 없음 → 라이트모드 유지
```
