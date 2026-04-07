import Link from 'next/link';
import { notionEnabled } from '@/lib/notion/env';
import { getEventBySlug } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getEvent(slug: string) {
  if (!notionEnabled) {
    return homepageDummyData.events.find((event) => event.slug === slug) ?? null;
  }
  try {
    return await getEventBySlug(slug);
  } catch {
    return homepageDummyData.events.find((event) => event.slug === slug) ?? null;
  }
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <main>
      <div className="detail-page">
        <Link href="/events" className="back-link">
          ← Events
        </Link>

        <p className="detail-season">{event.year}</p>
        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-description">{event.concept}</p>

        <img
          className="detail-main-image"
          src={event.coverImage}
          alt={event.title}
        />
      </div>
    </main>
  );
}
