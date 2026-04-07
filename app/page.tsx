import Link from "next/link";
import FadeIn from "./components/FadeIn";
import { getHomepageData } from "@/lib/data/get-homepage-data";
import { getCollectionSoldOut } from "@/lib/data/homepage-dummy";

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
            <h2>Events</h2>
            <span className="section-count">{data.events.length}</span>
          </div>
        </FadeIn>
        <div className="masonry-grid">
          {data.events.map((event, i) => (
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
                  <p className="masonry-card-season">{event.year}</p>
                  <p className="masonry-card-title">{event.title}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
