import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import { notionConfig, notionEnabled } from '@/lib/notion/env';
import { getEventsFromNotion } from '@/lib/notion/client';
import { homepageDummyData } from '@/lib/data/homepage-dummy';

export const revalidate = 60;

async function getEvents() {
  if (!notionEnabled) return homepageDummyData.events;
  try {
    const events = await getEventsFromNotion(notionConfig.eventDatabaseId);
    return events.length > 0 ? events : homepageDummyData.events;
  } catch {
    return homepageDummyData.events;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main>
      <div className="listing-header">
        <h1>Events</h1>
      </div>
      <div className="masonry-grid">
        {events.map((event, i) => (
          <FadeIn key={event.slug} delay={i * 80}>
            <Link href={`/events/${event.slug}`} className="masonry-card">
              <img
                src={event.coverImage}
                alt={event.title}
              />
              <div className="masonry-card-overlay">
                <p className="masonry-card-season">{event.year}</p>
                <p className="masonry-card-title">{event.title}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
