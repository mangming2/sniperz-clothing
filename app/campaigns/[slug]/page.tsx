import Link from 'next/link';
import { notionEnabled } from '@/lib/notion/env';
import { getCampaignBySlug } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getCampaign(slug: string) {
  if (!notionEnabled) {
    return homepageDummyData.campaigns.find((c) => c.slug === slug) ?? null;
  }
  try {
    return await getCampaignBySlug(slug);
  } catch {
    return homepageDummyData.campaigns.find((c) => c.slug === slug) ?? null;
  }
}

export default async function CampaignDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);

  if (!campaign) notFound();

  return (
    <main>
      <div className="detail-page">
        <Link href="/campaigns" className="back-link">
          ← Campaigns
        </Link>

        <p className="detail-season">{campaign.year}</p>
        <h1 className="detail-title">{campaign.title}</h1>
        <p className="detail-description">{campaign.concept}</p>

        <img
          className="detail-main-image"
          src={`https://picsum.photos/seed/cam-${slug}-main/800/600`}
          alt={campaign.title}
        />

        <div className="detail-gallery">
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={`https://picsum.photos/seed/cam-${slug}-g${n}/300/300`}
              alt={`${campaign.title} ${n}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
