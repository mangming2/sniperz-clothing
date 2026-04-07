const notionToken = process.env.NOTION_TOKEN;
const notionBrandDatabaseId = process.env.NOTION_BRAND_DATABASE_ID;
const notionCollectionDatabaseId = process.env.NOTION_COLLECTION_DATABASE_ID;
const notionEventDatabaseId =
  process.env.NOTION_EVENT_DATABASE_ID ?? process.env.NOTION_CAMPAIGN_DATABASE_ID;

export const notionEnabled = Boolean(
  notionToken && notionBrandDatabaseId && notionCollectionDatabaseId && notionEventDatabaseId
);

export const notionConfig = {
  token: notionToken ?? '',
  brandDatabaseId: notionBrandDatabaseId ?? '',
  collectionDatabaseId: notionCollectionDatabaseId ?? '',
  eventDatabaseId: notionEventDatabaseId ?? ''
};
