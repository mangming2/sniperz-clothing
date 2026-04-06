import { Client, isFullPage, isFullPageOrDatabase } from '@notionhq/client';
import { notionConfig } from './env';
import type { BrandInfo, Campaign, Collection } from '../data/homepage-dummy';

const notion = new Client({ auth: notionConfig.token });

type NotionPage = Parameters<typeof isFullPage>[0];

function getTitle(page: NotionPage, key: string): string {
  const property = page.properties[key];
  if (!property || property.type !== 'title') {
    return '';
  }

  return property.title.map((item) => item.plain_text).join('').trim();
}

function getRichText(page: NotionPage, key: string): string {
  const property = page.properties[key];
  if (!property || property.type !== 'rich_text') {
    return '';
  }

  return property.rich_text.map((item) => item.plain_text).join('').trim();
}

function getSlug(page: NotionPage, key: string): string {
  const property = page.properties[key];

  if (!property) {
    return '';
  }

  if (property.type === 'rich_text') {
    return property.rich_text.map((item) => item.plain_text).join('').trim();
  }

  if (property.type === 'formula' && property.formula.type === 'string') {
    return property.formula.string?.trim() ?? '';
  }

  return '';
}

export async function getBrandFromNotion(databaseId: string): Promise<BrandInfo | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1
  });

  const firstPage = response.results.find((entry) => isFullPageOrDatabase(entry) && isFullPage(entry));

  if (!firstPage || !isFullPage(firstPage)) {
    return null;
  }

  return {
    name: getTitle(firstPage, 'name'),
    tagline: getRichText(firstPage, 'tagline'),
    description: getRichText(firstPage, 'description')
  };
}

export async function getCollectionsFromNotion(databaseId: string): Promise<Collection[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 6
  });

  return response.results
    .filter((entry) => isFullPageOrDatabase(entry) && isFullPage(entry))
    .map((page) => ({
      title: getTitle(page, 'title'),
      slug: getSlug(page, 'slug'),
      season: getRichText(page, 'season'),
      summary: getRichText(page, 'summary')
    }))
    .filter((collection) => Boolean(collection.title && collection.slug));
}

export async function getCampaignsFromNotion(databaseId: string): Promise<Campaign[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 6
  });

  return response.results
    .filter((entry) => isFullPageOrDatabase(entry) && isFullPage(entry))
    .map((page) => ({
      title: getTitle(page, 'title'),
      slug: getSlug(page, 'slug'),
      year: getRichText(page, 'year'),
      concept: getRichText(page, 'concept')
    }))
    .filter((campaign) => Boolean(campaign.title && campaign.slug));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.collectionDatabaseId,
    // Note: 'slug' must be a rich_text property in Notion (not a formula) for this filter to work.
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
    slug,
    season: getRichText(page, 'season'),
    summary: getRichText(page, 'summary')
  };
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const response = await notion.databases.query({
    database_id: notionConfig.campaignDatabaseId,
    // Note: 'slug' must be a rich_text property in Notion (not a formula) for this filter to work.
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
    slug,
    year: getRichText(page, 'year'),
    concept: getRichText(page, 'concept')
  };
}
