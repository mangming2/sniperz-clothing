import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { notionConfig, notionEnabled } from '@/lib/notion/env';
import { getCampaignsFromNotion } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';

export const revalidate = 60;

async function getCampaigns() {
  if (!notionEnabled) return homepageDummyData.campaigns;
  try {
    const campaigns = await getCampaignsFromNotion(notionConfig.campaignDatabaseId);
    return campaigns.length > 0 ? campaigns : homepageDummyData.campaigns;
  } catch {
    return homepageDummyData.campaigns;
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <main>
      <div className="listing-header">
        <h1>Campaigns</h1>
      </div>
      <div className="masonry-grid">
        {campaigns.map((campaign, i) => (
          <FadeIn key={campaign.slug} delay={i * 80}>
            <Link href={`/campaigns/${campaign.slug}`} className="masonry-card">
              <img
                src={`https://picsum.photos/seed/cam-${campaign.slug}/400/600`}
                alt={campaign.title}
              />
              <div className="masonry-card-overlay">
                <p className="masonry-card-season">{campaign.year}</p>
                <p className="masonry-card-title">{campaign.title}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
