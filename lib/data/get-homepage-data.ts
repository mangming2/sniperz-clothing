import { homepageDummyData, HomepageData } from './homepage-dummy';
import { sanityClient } from '../sanity/client';
import { sanityEnabled } from '../sanity/env';
import { homepageQuery } from '../sanity/queries';

export async function getHomepageData(): Promise<HomepageData> {
  if (!sanityEnabled) {
    return homepageDummyData;
  }

  const sanityData = await sanityClient.fetch<HomepageData | null>(homepageQuery);

  if (!sanityData?.brand) {
    return homepageDummyData;
  }

  return {
    brand: sanityData.brand,
    collections: sanityData.collections ?? homepageDummyData.collections,
    campaigns: sanityData.campaigns ?? homepageDummyData.campaigns
  };
}
