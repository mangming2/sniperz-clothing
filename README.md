# SNIPERZ Clothing (Next.js + Sanity)

브랜드 소개형 웹사이트를 위한 Next.js(App Router) 스타터입니다.

## 시작하기

```bash
npm install
npm run dev
```

기본 동작은 로컬 더미데이터를 사용합니다.

## Sanity 연결

`.env.local` 파일 생성 후 아래 변수 설정:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

환경변수가 없으면 자동으로 더미데이터 fallback을 사용합니다.

## Sanity 권장 스키마 타입

- `brand`
  - `name` (string)
  - `tagline` (string)
  - `description` (text)
- `collection`
  - `title` (string)
  - `slug` (slug)
  - `season` (string)
  - `summary` (text)
- `campaign`
  - `title` (string)
  - `slug` (slug)
  - `year` (string)
  - `concept` (text)
