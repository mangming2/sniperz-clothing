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

      {/* Campaigns */}
      <section className="content-section">
        <FadeIn>
          <div className="section-header">
            <h2>Campaigns</h2>
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
