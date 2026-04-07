import Link from "next/link";
import FadeIn from "./components/FadeIn";
import { getHomepageData } from "@/lib/data/get-homepage-data";
import { getCollectionSoldOut } from "@/lib/data/homepage-dummy";

export const revalidate = 60;
const instagramDmUrl = "https://www.instagram.com/sniperzclothing1/";

export default async function HomePage() {
  const data = await getHomepageData();
  const featuredCollections = data.collections.slice(0, 4);
  const featuredEvents = data.events.slice(0, 4);

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
            <div className="section-heading">
              <h2>Collections</h2>
              <span className="section-count">{data.collections.length}</span>
            </div>
            <Link href="/collections" className="section-more-link">
              View All
            </Link>
          </div>
        </FadeIn>
        <div className="masonry-grid">
          {featuredCollections.map((collection, i) => (
            <FadeIn key={`${collection.slug}-${i}`} delay={i * 100}>
              <Link
                href={`/collections/${collection.slug}`}
                className="masonry-card"
              >
                <img
                  src={collection.coverImage}
                  alt={collection.title}
                />
                <span
                  className={`collection-status-tag ${
                    getCollectionSoldOut(collection.inventory)
                      ? "sold-out"
                      : "in-stock"
                  }`}
                >
                  {getCollectionSoldOut(collection.inventory)
                    ? "Sold Out"
                    : "Available"}
                </span>
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
            <div className="section-heading">
              <h2>Events</h2>
              <span className="section-count">{data.events.length}</span>
            </div>
            <Link href="/events" className="section-more-link">
              View All
            </Link>
          </div>
        </FadeIn>
        <div className="masonry-grid">
          {featuredEvents.map((event, i) => (
            <FadeIn key={`${event.slug}-${i}`} delay={i * 100}>
              <Link
                href={`/events/${event.slug}`}
                className="masonry-card"
              >
                <img
                  src={event.coverImage}
                  alt={event.title}
                />
                <div className="masonry-card-overlay">
                  <p className="masonry-card-title">{event.title}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="dm-section">
        <FadeIn>
          <div className="dm-panel">
            <p className="dm-eyebrow">Direct Order</p>
            <h2>Request your order via Instagram DM.</h2>
            <p className="dm-description">
              Send us the collection name and preferred size through Instagram,
              and we will confirm stock and next steps directly.
            </p>
            <a
              className="dm-button"
              href={instagramDmUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Instagram
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
