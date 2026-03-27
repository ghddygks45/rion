# Report 1-4. Vercel 배포 연결

## 작업 결과
완료

---

## 어떤 작업을 했나

### Vercel + GitHub 연동

- GitHub 저장소와 Vercel 프로젝트를 연결했습니다.
- main 브랜치 push 시 프로덕션 자동 배포가 동작합니다.
- develop 브랜치 push 시 Preview URL이 자동 생성됩니다.

### 브랜치 전략

| 브랜치 | Vercel 동작 |
|---|---|
| `main` | 프로덕션 배포 (자동) |
| `develop` | Preview URL 생성 (자동) |

---

## 완료 확인

- Vercel 대시보드에서 배포 확인
- main 브랜치 push → 자동 배포 동작 확인
