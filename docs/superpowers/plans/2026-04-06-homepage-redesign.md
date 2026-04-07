# SNIPERZ Clothing 프론트엔드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** adererror.com 레퍼런스 기반으로 홈페이지 리디자인 + 컬렉션/이벤트 목록·상세 페이지 구현 (모바일 퍼스트, 스크롤 페이드인 애니메이션)

**Architecture:** Next.js App Router 기반. 내비게이션은 layout.tsx에 포함. 마소너리 카드는 재사용 가능한 Server Component로 분리. 스크롤 애니메이션만 Client Component 사용. Notion API는 lib/notion/client.ts에서 처리.

**Tech Stack:** Next.js 16, React 19, TypeScript, @notionhq/client 2.3.0, picsum.photos (더미 이미지), IntersectionObserver API (외부 라이브러리 없음)

---

## 파일 맵

| 파일 | 작업 |
|------|------|
| `app/globals.css` | 수정 — 내비, 마소너리 그리드, 카드, 페이드인 애니메이션 스타일 추가 |
| `app/layout.tsx` | 수정 — 고정 내비게이션 추가 |
| `app/page.tsx` | 수정 — 홈페이지 리디자인 (히어로 + 컬렉션 + 이벤트 섹션) |
| `app/components/FadeIn.tsx` | 생성 — IntersectionObserver 래퍼 Client Component |
| `app/collections/page.tsx` | 생성 — 컬렉션 목록 페이지 |
| `app/collections/[slug]/page.tsx` | 생성 — 컬렉션 상세 페이지 |
| `app/events/page.tsx` | 생성 — 이벤트 목록 페이지 |
| `app/events/[slug]/page.tsx` | 생성 — 이벤트 상세 페이지 |
| `lib/notion/client.ts` | 수정 — `getCollectionBySlug`, `getEventBySlug` 함수 추가 |

---

## Task 1: CSS 스타일 기반 구축

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: globals.css에 스타일 추가**

기존 내용 아래에 다음을 추가:

```css
/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-logo {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #f8f8f8;
  text-decoration: none;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #bdbdbd;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #f8f8f8;
}

/* Page top padding (nav 높이만큼) */
.page-body {
  padding-top: 64px;
}

/* Hero */
.hero-section {
  padding: 80px 24px 64px;
  max-width: 1120px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Masonry grid */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 24px;
  max-width: 1120px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 0 32px;
  }
}

/* Masonry card */
.masonry-card {
  display: block;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  background: #1a1a1a;
}

.masonry-card:nth-child(even) {
  margin-top: 24px;
}

.masonry-card img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  opacity: 0.8;
  transition: opacity 0.3s, transform 0.4s;
}

.masonry-card:hover img {
  opacity: 1;
  transform: scale(1.03);
}

.masonry-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 12px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
}

.masonry-card-season {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #bdbdbd;
  margin: 0 0 4px;
}

.masonry-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f8f8f8;
  margin: 0;
  line-height: 1.3;
}

/* Section wrapper */
.content-section {
  padding: 64px 0;
  max-width: 1120px;
  margin: 0 auto;
}

.section-header {
  padding: 0 24px 28px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.section-count {
  font-size: 0.68rem;
  color: #666;
  letter-spacing: 0.1em;
}

/* Detail page */
.detail-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 80px 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #888;
  text-decoration: none;
  margin-bottom: 40px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #f8f8f8;
}

.detail-season {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
  margin: 0 0 12px;
}

.detail-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 20px;
  font-family: Georgia, 'Times New Roman', serif;
}

.detail-description {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #c8c8c8;
  margin: 0 0 40px;
}

.detail-main-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  margin-bottom: 8px;
}

.detail-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 2px;
}

.detail-gallery img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.detail-gallery img:hover {
  opacity: 1;
}

/* Fade-in animation */
.fade-in-target {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-target.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero immediate animation */
.hero-animate {
  animation: heroFadeIn 0.8s ease forwards;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Listing page header */
.listing-header {
  padding: 80px 24px 48px;
  max-width: 1120px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 48px;
}

.listing-header h1 {
  font-size: clamp(1.8rem, 5vw, 3rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0;
}
```

- [ ] **Step 2: 개발 서버 실행해서 스타일 오류 없는지 확인**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing && pnpm dev
```

콘솔에 CSS 파싱 오류 없으면 OK.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/globals.css
git commit -m "style: add nav, masonry grid, detail page, and fade-in CSS"
```

---

## Task 2: FadeIn Client Component

**Files:**
- Create: `app/components/FadeIn.tsx`

- [ ] **Step 1: components 디렉토리 생성 및 FadeIn 컴포넌트 작성**

`app/components/FadeIn.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-in-target ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/components/FadeIn.tsx
git commit -m "feat: add FadeIn IntersectionObserver client component"
```

---

## Task 3: 내비게이션 — layout.tsx 수정

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: layout.tsx 수정**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNIPERZ Clothing',
  description: 'SNIPERZ 브랜드 소개 사이트'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-logo">Sniperz</Link>
          <div className="nav-links">
            <Link href="/collections">Collections</Link>
            <Link href="/campaigns">Events</Link>
          </div>
        </nav>
        <div className="page-body">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000` 접속. 상단에 고정 내비게이션 보이는지, 스크롤해도 유지되는지 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/layout.tsx
git commit -m "feat: add fixed navigation to layout"
```

---

## Task 4: 홈페이지 리디자인 — page.tsx 수정

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: page.tsx 전체 교체**

```tsx
import Link from 'next/link';
import FadeIn from './components/FadeIn';
import { getHomepageData } from '@/lib/data/get-homepage-data';

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main>
      {/* Hero */}
      <section className="hero-section hero-animate">
        <p className="eyebrow">{data.brand.tagline}</p>
        <h1>{data.brand.name}</h1>
        <p className="description">{data.brand.description}</p>
      </section>

      {/* Collections */}
      <section className="content-section">
        <FadeIn>
          <div className="section-header">
            <h2>Collections</h2>
            <span className="section-count">{data.collections.length}</span>
          </div>
        </FadeIn>
        <div className="masonry-grid">
          {data.collections.map((collection, i) => (
            <FadeIn key={collection.slug} delay={i * 100}>
              <Link href={`/collections/${collection.slug}`} className="masonry-card">
                <img
                  src={`https://picsum.photos/seed/col-${collection.slug}/400/600`}
                  alt={collection.title}
                />
                <div className="masonry-card-overlay">
                  <p className="masonry-card-season">{collection.season}</p>
                  <p className="masonry-card-title">{collection.title}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="content-section">
        <FadeIn>
          <div className="section-header">
            <h2>Events</h2>
            <span className="section-count">{data.campaigns.length}</span>
          </div>
        </FadeIn>
        <div className="masonry-grid">
          {data.campaigns.map((campaign, i) => (
            <FadeIn key={campaign.slug} delay={i * 100}>
              <Link href={`/campaigns/${campaign.slug}`} className="masonry-card">
                <img
                  src={`https://picsum.photos/seed/cam-${campaign.slug}/400/600`}
                  alt={campaign.title}
                />
                <div className="masonry-card-overlay">
                  <p className="masonry-card-season">{campaign.year}</p>
                  <p className="masonry-card-title">{campaign.title}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000` — 히어로 텍스트, 마소너리 카드 2섹션, 스크롤 시 페이드인 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/page.tsx
git commit -m "feat: redesign homepage with masonry grid and scroll fade-in"
```

---

## Task 5: Notion 슬러그 조회 함수 추가

**Files:**
- Modify: `lib/notion/client.ts`

- [ ] **Step 1: client.ts에 슬러그 조회 함수 추가**

기존 `getCampaignsFromNotion` 함수 아래에 추가:

```ts
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.collectionDatabaseId,
    filter: {
      property: 'slug',
      rich_text: { equals: slug }
    },
    page_size: 1
  });

  const page = response.results.find((entry) => isFullPageOrDatabase(entry) && isFullPage(entry));
  if (!page || !isFullPage(page)) return null;

  return {
    title: getTitle(page, 'title'),
    slug: getSlug(page, 'slug'),
    season: getRichText(page, 'season'),
    summary: getRichText(page, 'summary')
  };
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.campaignDatabaseId,
    filter: {
      property: 'slug',
      rich_text: { equals: slug }
    },
    page_size: 1
  });

  const page = response.results.find((entry) => isFullPageOrDatabase(entry) && isFullPage(entry));
  if (!page || !isFullPage(page)) return null;

  return {
    title: getTitle(page, 'title'),
    slug: getSlug(page, 'slug'),
    year: getRichText(page, 'year'),
    concept: getRichText(page, 'concept')
  };
}
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add lib/notion/client.ts
git commit -m "feat: add getCollectionBySlug and getCampaignBySlug to Notion client"
```

---

## Task 6: 컬렉션 목록 페이지

**Files:**
- Create: `app/collections/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { notionConfig, notionEnabled } from '@/lib/notion/env';
import { getCollectionsFromNotion } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';

export const revalidate = 60;

async function getCollections() {
  if (!notionEnabled) return homepageDummyData.collections;
  try {
    const collections = await getCollectionsFromNotion(notionConfig.collectionDatabaseId);
    return collections.length > 0 ? collections : homepageDummyData.collections;
  } catch {
    return homepageDummyData.collections;
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main>
      <div className="listing-header">
        <h1>Collections</h1>
      </div>
      <div className="masonry-grid">
        {collections.map((collection, i) => (
          <FadeIn key={collection.slug} delay={i * 80}>
            <Link href={`/collections/${collection.slug}`} className="masonry-card">
              <img
                src={`https://picsum.photos/seed/col-${collection.slug}/400/600`}
                alt={collection.title}
              />
              <div className="masonry-card-overlay">
                <p className="masonry-card-season">{collection.season}</p>
                <p className="masonry-card-title">{collection.title}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000/collections` — 목록 헤더 + 마소너리 그리드 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/collections/page.tsx
git commit -m "feat: add collections listing page"
```

---

## Task 7: 캠페인 목록 페이지

**Files:**
- Create: `app/campaigns/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { notionConfig, notionEnabled } from '@/lib/notion/env';
import { getCampaignsFromNotion } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';

export const revalidate = 60;

async function getCampaigns() {
  if (!notionEnabled) return homepageDummyData.campaigns;
  try {
    const campaigns = await getCampaignsFromNotion(notionConfig.campaignDatabaseId);
    return campaigns.length > 0 ? campaigns : homepageDummyData.campaigns;
  } catch {
    return homepageDummyData.campaigns;
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <main>
      <div className="listing-header">
        <h1>Events</h1>
      </div>
      <div className="masonry-grid">
        {campaigns.map((campaign, i) => (
          <FadeIn key={campaign.slug} delay={i * 80}>
            <Link href={`/campaigns/${campaign.slug}`} className="masonry-card">
              <img
                src={`https://picsum.photos/seed/cam-${campaign.slug}/400/600`}
                alt={campaign.title}
              />
              <div className="masonry-card-overlay">
                <p className="masonry-card-season">{campaign.year}</p>
                <p className="masonry-card-title">{campaign.title}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000/campaigns` — 목록 헤더 + 마소너리 그리드 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/campaigns/page.tsx
git commit -m "feat: add campaigns listing page"
```

---

## Task 8: 컬렉션 상세 페이지

**Files:**
- Create: `app/collections/[slug]/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
import Link from 'next/link';
import { notionEnabled } from '@/lib/notion/env';
import { getCollectionBySlug } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getCollection(slug: string) {
  if (!notionEnabled) {
    return homepageDummyData.collections.find((c) => c.slug === slug) ?? null;
  }
  try {
    return await getCollectionBySlug(slug);
  } catch {
    return homepageDummyData.collections.find((c) => c.slug === slug) ?? null;
  }
}

export default async function CollectionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) notFound();

  return (
    <main>
      <div className="detail-page">
        <Link href="/collections" className="back-link">
          ← Collections
        </Link>

        <p className="detail-season">{collection.season}</p>
        <h1 className="detail-title">{collection.title}</h1>
        <p className="detail-description">{collection.summary}</p>

        <img
          className="detail-main-image"
          src={`https://picsum.photos/seed/col-${slug}-main/800/600`}
          alt={collection.title}
        />

        <div className="detail-gallery">
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={`https://picsum.photos/seed/col-${slug}-g${n}/300/300`}
              alt={`${collection.title} ${n}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000/collections/fractured-basics` (또는 Notion에 넣은 슬러그) — 뒤로가기, 제목, 설명, 메인 이미지, 갤러리 3장 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/collections/
git commit -m "feat: add collection detail page"
```

---

## Task 9: 캠페인 상세 페이지

**Files:**
- Create: `app/campaigns/[slug]/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
import Link from 'next/link';
import { notionEnabled } from '@/lib/notion/env';
import { getCampaignBySlug } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getCampaign(slug: string) {
  if (!notionEnabled) {
    return homepageDummyData.campaigns.find((c) => c.slug === slug) ?? null;
  }
  try {
    return await getCampaignBySlug(slug);
  } catch {
    return homepageDummyData.campaigns.find((c) => c.slug === slug) ?? null;
  }
}

export default async function CampaignDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);

  if (!campaign) notFound();

  return (
    <main>
      <div className="detail-page">
        <Link href="/campaigns" className="back-link">
          ← Events
        </Link>

        <p className="detail-season">{campaign.year}</p>
        <h1 className="detail-title">{campaign.title}</h1>
        <p className="detail-description">{campaign.concept}</p>

        <img
          className="detail-main-image"
          src={`https://picsum.photos/seed/cam-${slug}-main/800/600`}
          alt={campaign.title}
        />

        <div className="detail-gallery">
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={`https://picsum.photos/seed/cam-${slug}-g${n}/300/300`}
              alt={`${campaign.title} ${n}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3000/campaigns/silence-in-concrete` (또는 Notion에 넣은 슬러그) — 뒤로가기, 연도, 제목, 컨셉, 메인 이미지, 갤러리 확인.

- [ ] **Step 3: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add app/campaigns/
git commit -m "feat: add campaign detail page"
```

---

## Task 10: .gitignore에 .superpowers 추가

**Files:**
- Modify: `.gitignore` (없으면 생성)

- [ ] **Step 1: .gitignore에 추가**

```
.superpowers/
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/jiho/Documents/GitHub/sniperz-clothing
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```
