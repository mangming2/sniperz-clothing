import { homepageDummyData, HomepageData } from './homepage-dummy';
import { notionConfig, notionEnabled } from '../notion/env';
import {
  getBrandFromNotion,
  getEventsFromNotion,
  getCollectionsFromNotion
} from '../notion/client';

export async function getHomepageData(): Promise<HomepageData> {
  if (!notionEnabled) {
    return homepageDummyData;
  }

  try {
    const [brand, collections, events] = await Promise.all([
      getBrandFromNotion(notionConfig.brandDatabaseId),
      getCollectionsFromNotion(notionConfig.collectionDatabaseId),
      getEventsFromNotion(notionConfig.eventDatabaseId)
    ]);

    if (!brand?.name) {
      return homepageDummyData;
    }

    return {
      brand,
      collections: collections.length > 0 ? collections : homepageDummyData.collections,
      events: events.length > 0 ? events : homepageDummyData.events
    };
  } catch {
    return homepageDummyData;
  }
}
