import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { notionConfig, notionEnabled } from '@/lib/notion/env';
import { getCollectionsFromNotion } from '@/lib/notion/client';
import { getCollectionSoldOut, homepageDummyData } from '@/lib/data/homepage-dummy';

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
                src={collection.coverImage}
                alt={collection.title}
              />
              <span className={`collection-status-tag ${getCollectionSoldOut(collection.inventory) ? 'sold-out' : 'in-stock'}`}>
                {getCollectionSoldOut(collection.inventory) ? 'Sold Out' : 'Available'}
              </span>
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
