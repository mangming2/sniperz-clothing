import Link from "next/link";
import { notionEnabled } from "@/lib/notion/env";
import { getCollectionBySlug } from "@/lib/notion/client";
import {
  formatEuroPrice,
  getCollectionSoldOut,
  homepageDummyData,
} from "@/lib/data/homepage-dummy";
import { notFound } from "next/navigation";

export const revalidate = 60;
const instagramDmUrl = "https://www.instagram.com/sniperzclothing1/";

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
  params,
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
        <p className="detail-price-primary">
          {formatEuroPrice(collection.priceEur)}
        </p>
        <p className="detail-description">{collection.summary}</p>
        <div className="detail-meta-row">
          <span
            className={`detail-status-tag ${getCollectionSoldOut(collection.inventory) ? "sold-out" : "in-stock"}`}
          >
            {getCollectionSoldOut(collection.inventory)
              ? "Sold Out"
              : "Available"}
          </span>
          <span className="detail-stock-total">
            Total Stock{" "}
            {collection.inventory.reduce((sum, item) => sum + item.stock, 0)}
          </span>
        </div>

        <div className="detail-visual-grid">
          {collection.images.map((image, index) => (
            <img
              key={image}
              className={
                index === 0 ? "detail-main-image" : "detail-gallery-image"
              }
              src={image}
              alt={`${collection.title} view ${index + 1}`}
            />
          ))}
        </div>

        <section className="inventory-panel">
          <div className="inventory-panel-header">
            <h2>Size Inventory</h2>
          </div>
          <div className="inventory-grid">
            {collection.inventory.map((item) => (
              <div
                key={item.size}
                className={`inventory-card ${item.stock === 0 ? "empty" : ""}`}
              >
                <span className="inventory-size">{item.size}</span>
                <strong className="inventory-stock">
                  {item.stock === 0 ? "Sold Out" : `${item.stock} left`}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dm-panel detail-dm-panel">
          <p className="dm-eyebrow">Order via DM</p>
          <h2>Request this collection on Instagram.</h2>
          <p className="dm-description">
            Send us: {collection.title} / preferred size / quantity.
          </p>
          <a
            className="dm-button"
            href={instagramDmUrl}
            target="_blank"
            rel="noreferrer"
          >
            DM @sniperzclothing1
          </a>
        </section>
      </div>
    </main>
  );
}
