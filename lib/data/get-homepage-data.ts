import { homepageDummyData, HomepageData } from './homepage-dummy';
import { notionConfig, notionEnabled } from '../notion/env';
import {
  getBrandFromNotion,
  getCampaignsFromNotion,
  getCollectionsFromNotion
} from '../notion/client';

export async function getHomepageData(): Promise<HomepageData> {
  if (!notionEnabled) {
    return homepageDummyData;
  }

  try {
    const [brand, collections, campaigns] = await Promise.all([
      getBrandFromNotion(notionConfig.brandDatabaseId),
      getCollectionsFromNotion(notionConfig.collectionDatabaseId),
      getCampaignsFromNotion(notionConfig.campaignDatabaseId)
    ]);

    if (!brand?.name) {
      return homepageDummyData;
    }

    return {
      brand,
      collections: collections.length > 0 ? collections : homepageDummyData.collections,
      campaigns: campaigns.length > 0 ? campaigns : homepageDummyData.campaigns
    };
  } catch {
    return homepageDummyData;
  }
}
