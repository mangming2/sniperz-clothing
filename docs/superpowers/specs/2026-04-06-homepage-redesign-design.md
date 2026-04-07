# SNIPERZ Clothing — 프론트엔드 디자인 스펙

**날짜:** 2026-04-06  
**레퍼런스:** adererror.com/kr  
**데이터소스:** Notion API (이미 연결 완료)  
**이미지:** picsum.photos 더미 이미지

---

## 공통 원칙

- **모바일 퍼스트** — 주 사용 환경이 모바일 (375px 기준)
- **다크 테마** — 배경 `#0a0a0a`, 텍스트 `#f8f8f8` (기존 globals.css 유지)
- **외부 애니메이션 라이브러리 없음** — IntersectionObserver + CSS transition만 사용
- **외부 UI 라이브러리 없음** — 순수 CSS로 구현

---

## 페이지 구조

### 1. 홈페이지 (`/`)

#### 상단 고정 내비게이션
- 좌: `SNIPERZ` 로고 (홈 링크)
- 우: `Collections` / `Events` 링크
- 배경: `rgba(10,10,10,0.85)` + backdrop-blur
- 스크롤해도 항상 상단에 고정 (`position: fixed`)

#### 히어로 섹션
- tagline (소문자, letter-spacing 넓게, `#bdbdbd`)
- 브랜드명 대형 타이포 (serif 계열, clamp로 반응형)
- description 텍스트
- 페이지 로드 시 fade-in (지연 없이 즉시)

#### Collections 섹션
- 섹션 타이틀 "Collections" — 스크롤 진입 시 fade-in
- 마소너리 그리드: 데스크탑 3열, 모바일 2열
- 각 카드: 이미지(aspect-ratio 2/3) + 오버레이(시즌 라벨 + 제목)
- 홀수 번째 열 카드는 `margin-top: 24px`으로 엇갈린 느낌
- 카드 클릭 시 `/collections/[slug]`로 이동
- 카드들 순차 등장 (stagger: 각 카드 100ms 딜레이)

#### Events 섹션
- Collections와 동일한 마소너리 그리드
- 카드 클릭 시 `/events/[slug]`로 이동

---

### 2. 목록 페이지 (`/collections`, `/events`)

- 내비게이션 동일
- 페이지 타이틀 + 전체 목록을 마소너리 그리드로 표시
- 홈과 동일한 카드 컴포넌트 재사용

---

### 3. 상세 페이지 (`/collections/[slug]`, `/events/[slug]`)

위에서 아래로 순서:

1. **← 뒤로가기** 링크 (`/collections` 또는 `/events`)
2. **시즌/연도 라벨** (소문자, letter-spacing)
3. **대형 제목** (serif, 굵게)
4. **설명 텍스트** (summary 또는 concept)
5. **메인 이미지** (가로 꽉 찬 이미지, aspect-ratio 4/3)
6. **썸네일 갤러리** (3열 정방형 이미지, picsum 시드 다르게)

데이터: Notion slug로 해당 항목 fetch (`databases.query` + filter)

---

## 스크롤 애니메이션

- `IntersectionObserver`로 뷰포트 진입 감지
- 진입 전: `opacity: 0; transform: translateY(20px)`
- 진입 후: `opacity: 1; transform: translateY(0); transition: 0.6s ease`
- 적용 대상: 섹션 타이틀, 카드 그리드, 상세 페이지 각 블록
- 히어로는 페이지 로드 즉시 애니메이션

---

## 파일 구조 계획

```
app/
  layout.tsx           — 내비게이션 포함
  page.tsx             — 홈페이지
  collections/
    page.tsx           — 컬렉션 목록
    [slug]/
      page.tsx         — 컬렉션 상세
  events/
    page.tsx           — 이벤트 목록
    [slug]/
      page.tsx         — 이벤트 상세
  globals.css          — 공통 스타일 + 애니메이션 클래스

lib/
  notion/
    client.ts          — 기존 (slug 필터 함수 추가 필요)
  data/
    get-homepage-data.ts  — 기존
```

---

## Notion 데이터 연동

- 홈/목록: 기존 `getCollectionsFromNotion`, `getEventsFromNotion` 사용
- 상세: slug로 단일 항목 조회하는 함수 추가 필요
  - `getCollectionBySlug(slug)` — databases.query + filter by slug property
  - `getEventBySlug(slug)` — 동일 패턴

---

## 반응형 브레이크포인트

| 구간 | 그리드 |
|------|--------|
| `< 640px` (모바일) | 2열 마소너리 |
| `≥ 640px` (데스크탑) | 3열 마소너리 |

내비게이션은 모바일/데스크탑 동일 (링크 텍스트 크기만 조정).
