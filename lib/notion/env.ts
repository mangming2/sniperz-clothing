const notionToken = process.env.NOTION_TOKEN;
const notionBrandDatabaseId = process.env.NOTION_BRAND_DATABASE_ID;
const notionCollectionDatabaseId = process.env.NOTION_COLLECTION_DATABASE_ID;
const notionCampaignDatabaseId = process.env.NOTION_CAMPAIGN_DATABASE_ID;

export const notionEnabled = Boolean(
  notionToken && notionBrandDatabaseId && notionCollectionDatabaseId && notionCampaignDatabaseId
);

export const notionConfig = {
  token: notionToken ?? '',
  brandDatabaseId: notionBrandDatabaseId ?? '',
  collectionDatabaseId: notionCollectionDatabaseId ?? '',
  campaignDatabaseId: notionCampaignDatabaseId ?? ''
};
