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
