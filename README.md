# SNIPERZ Clothing (Next.js + Notion API)

브랜드 소개형 웹사이트를 위한 Next.js(App Router) 스타터입니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

기본 동작은 로컬 더미데이터를 사용합니다.

## Notion API 연결

1. Notion에서 `brand`, `collection`, `campaign` 데이터베이스 3개를 만듭니다.
2. 각 데이터베이스를 생성한 뒤 **Integrations**에서 생성한 API integration을 연결(Share)합니다.
3. `.env.local` 파일에 아래 값을 입력합니다.

```bash
NOTION_TOKEN=secret_xxx
NOTION_BRAND_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_COLLECTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CAMPAIGN_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

환경변수가 없거나 Notion 응답이 실패하면 자동으로 더미데이터 fallback을 사용합니다.

## Notion 데이터베이스 권장 속성

### 1) brand DB (1개 row 권장)
- `name` (Title)
- `tagline` (Text)
- `description` (Text)

### 2) collection DB
- `title` (Title)
- `slug` (Text 또는 Formula[string])
- `season` (Text)
- `summary` (Text)

### 3) campaign DB
- `title` (Title)
- `slug` (Text 또는 Formula[string])
- `year` (Text)
- `concept` (Text)

## 요금 관련 메모

Notion API는 현재 기준으로 무료로 시작할 수 있지만, 서비스 정책/요금제는 변경될 수 있습니다.
운영 전에는 Notion 공식 요금 페이지와 API 제한 문서를 함께 확인하세요.
