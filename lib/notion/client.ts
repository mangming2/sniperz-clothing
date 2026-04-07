import { Client, isFullPage, isFullPageOrDatabase } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { notionConfig } from "./env";
import {
  buildCollectionImages,
  type BrandInfo,
  type Collection,
  type Event,
} from "../data/homepage-dummy";

const notion = new Client({ auth: notionConfig.token });
const loadingImagePath = "/images/loading.png";
const notionRevalidateSeconds = 300;

type NotionPage = Parameters<typeof isFullPage>[0];

function getTitle(page: NotionPage, key: string): string {
  // TS 에러 해결: Full Page인지 먼저 검증합니다.
  if (!isFullPage(page)) return "";

  const property = page.properties[key];
  if (!property || property.type !== "title") {
    return "";
  }

  return property.title
    .map((item) => item.plain_text)
    .join("")
    .trim();
}

function getRichText(page: NotionPage, key: string): string {
  // TS 에러 해결: Full Page인지 먼저 검증합니다.
  if (!isFullPage(page)) return "";

  const property = page.properties[key];
  if (!property || property.type !== "rich_text") {
    return "";
  }

  return property.rich_text
    .map((item) => item.plain_text)
    .join("")
    .trim();
}

function getSlug(page: NotionPage, key: string): string {
  // TS 에러 해결: Full Page인지 먼저 검증합니다.
  if (!isFullPage(page)) return "";

  const property = page.properties[key];

  if (!property) {
    return "";
  }

  if (property.type === "rich_text") {
    return property.rich_text
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "formula" && property.formula.type === "string") {
    return property.formula.string?.trim() ?? "";
  }

  return "";
}

function getUrl(page: NotionPage, key: string): string {
  if (!isFullPage(page)) return "";

  const property = page.properties[key];
  if (!property || property.type !== "url") {
    return "";
  }

  return property.url?.trim() ?? "";
}

function getNumber(page: NotionPage, key: string): number | null {
  if (!isFullPage(page)) return null;

  const property = page.properties[key];
  if (!property || property.type !== "number") {
    return null;
  }

  return property.number;
}

function getFiles(page: NotionPage, key: string): string[] {
  if (!isFullPage(page)) return [];

  const property = page.properties[key];
  if (!property || property.type !== "files") {
    return [];
  }

  return property.files
    .map((file) => {
      if (file.type === "external") return file.external.url;
      if (file.type === "file") return file.file.url;
      return "";
    })
    .filter(Boolean);
}

function getImageSources(page: NotionPage, key: string): string[] {
  const files = getFiles(page, key);
  if (files.length > 0) return files;

  const url = getUrl(page, key);
  if (url) return [url];

  const richText = getRichText(page, key);
  if (!richText) return [];

  return richText
    .split(/\s*,\s*|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEventDescription(page: NotionPage): string {
  return getRichText(page, "description") || getRichText(page, "concept");
}

function getFallbackInventory(slug: string): Collection["inventory"] {
  const presetMap: Record<string, Collection["inventory"]> = {
    "fractured-basics": [
      { size: "S", stock: 0 },
      { size: "M", stock: 2 },
      { size: "L", stock: 1 },
      { size: "XL", stock: 0 },
    ],
    "night-workshop": [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    "ghost-uniform": [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 1 },
    ],
  };

  return (
    presetMap[slug] ?? [
      { size: "S", stock: 1 },
      { size: "M", stock: 3 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
    ]
  );
}

function getFallbackPrice(slug: string): number {
  const presetMap: Record<string, number> = {
    "fractured-basics": 280,
    "night-workshop": 340,
    "ghost-uniform": 220,
  };

  return presetMap[slug] ?? 250;
}

function getCollectionInventory(page: NotionPage, slug: string): Collection["inventory"] {
  const stockEntries = [
    { size: "S", stock: getNumber(page, "stock_s") },
    { size: "M", stock: getNumber(page, "stock_m") },
    { size: "L", stock: getNumber(page, "stock_l") },
    { size: "XL", stock: getNumber(page, "stock_xl") },
  ];

  const hasExplicitStock = stockEntries.some((item) => item.stock !== null);
  if (!hasExplicitStock) {
    return getFallbackInventory(slug);
  }

  return stockEntries.map((item) => ({
    size: item.size,
    stock: item.stock ?? 0,
  }));
}

function buildCollectionFromPage(page: NotionPage): Collection | null {
  if (!isFullPage(page)) return null;

  const slug = getSlug(page, "slug");
  const fallbackImages = buildCollectionImages(
    slug || getTitle(page, "title").toLowerCase(),
  );
  const galleryImages = getImageSources(page, "gallery_images");
  const coverImage =
    getImageSources(page, "cover_image")[0] ||
    galleryImages[0] ||
    loadingImagePath;
  const images =
    galleryImages.length > 0
      ? galleryImages
      : coverImage !== loadingImagePath
        ? [coverImage]
        : fallbackImages.images.length > 0
          ? [loadingImagePath, ...fallbackImages.images.slice(0, 3)]
          : [loadingImagePath];

  return {
    title: getTitle(page, "title"),
    slug,
    season: getRichText(page, "season"),
    summary: getRichText(page, "summary"),
    priceEur: getNumber(page, "price_eur") ?? getFallbackPrice(slug),
    coverImage,
    images,
    inventory: getCollectionInventory(page, slug),
  };
}

function buildEventFromPage(page: NotionPage): Event | null {
  if (!isFullPage(page)) return null;

  const slug = getSlug(page, "slug");
  const coverImage =
    getImageSources(page, "cover_image")[0] ||
    loadingImagePath;

  return {
    title: getTitle(page, "title"),
    slug,
    description: getEventDescription(page),
    coverImage,
  };
}

async function fetchBrandFromNotion(
  databaseId: string,
): Promise<BrandInfo | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1,
  });

  const firstPage = response.results.find(
    (entry) => isFullPageOrDatabase(entry) && isFullPage(entry),
  );

  if (!firstPage || !isFullPage(firstPage)) {
    return null;
  }

  return {
    name: getTitle(firstPage, "name"),
    tagline: getRichText(firstPage, "tagline"),
    description: getRichText(firstPage, "description"),
  };
}

async function fetchCollectionsFromNotion(
  databaseId: string,
): Promise<Collection[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 6,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return response.results
    .filter((entry) => isFullPageOrDatabase(entry) && isFullPage(entry))
    .map((page) => buildCollectionFromPage(page))
    .filter((collection): collection is Collection => collection !== null)
    .filter((collection) => Boolean(collection.title && collection.slug));
}

async function fetchEventsFromNotion(
  databaseId: string,
): Promise<Event[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 6,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return response.results
    .filter((entry) => isFullPageOrDatabase(entry) && isFullPage(entry))
    .map((page) => buildEventFromPage(page))
    .filter((event): event is Event => event !== null)
    .filter((event) => Boolean(event.title && event.slug));
}

async function fetchCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.collectionDatabaseId,
    // Note: 'slug' must be a rich_text property in Notion (not a formula) for this filter to work.
    filter: {
      property: "slug",
      rich_text: { equals: slug },
    },
    page_size: 1,
  });

  const page = response.results.find(
    (entry) => isFullPageOrDatabase(entry) && isFullPage(entry),
  );
  if (!page || !isFullPage(page)) return null;

  return buildCollectionFromPage(page);
}

async function fetchEventBySlug(
  slug: string,
): Promise<Event | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.eventDatabaseId,
    // Note: 'slug' must be a rich_text property in Notion (not a formula) for this filter to work.
    filter: {
      property: "slug",
      rich_text: { equals: slug },
    },
    page_size: 1,
  });

  const page = response.results.find(
    (entry) => isFullPageOrDatabase(entry) && isFullPage(entry),
  );
  if (!page || !isFullPage(page)) return null;

  return buildEventFromPage(page);
}

export async function getBrandFromNotion(
  databaseId: string,
): Promise<BrandInfo | null> {
  return unstable_cache(
    async () => fetchBrandFromNotion(databaseId),
    ["notion-brand", databaseId],
    {
      revalidate: notionRevalidateSeconds,
      tags: ["notion", "notion:brand"],
    },
  )();
}

export async function getCollectionsFromNotion(
  databaseId: string,
): Promise<Collection[]> {
  return unstable_cache(
    async () => fetchCollectionsFromNotion(databaseId),
    ["notion-collections", databaseId],
    {
      revalidate: notionRevalidateSeconds,
      tags: ["notion", "notion:collections"],
    },
  )();
}

export async function getEventsFromNotion(
  databaseId: string,
): Promise<Event[]> {
  return unstable_cache(
    async () => fetchEventsFromNotion(databaseId),
    ["notion-events", databaseId],
    {
      revalidate: notionRevalidateSeconds,
      tags: ["notion", "notion:events"],
    },
  )();
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  return unstable_cache(
    async () => fetchCollectionBySlug(slug),
    ["notion-collection-by-slug", slug],
    {
      revalidate: notionRevalidateSeconds,
      tags: ["notion", `notion:collection:${slug}`],
    },
  )();
}

export async function getEventBySlug(
  slug: string,
): Promise<Event | null> {
  return unstable_cache(
    async () => fetchEventBySlug(slug),
    ["notion-event-by-slug", slug],
    {
      revalidate: notionRevalidateSeconds,
      tags: ["notion", `notion:event:${slug}`],
    },
  )();
}
