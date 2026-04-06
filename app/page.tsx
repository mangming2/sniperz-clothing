import { getHomepageData } from '@/lib/data/get-homepage-data';

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">{data.brand.tagline}</p>
        <h1>{data.brand.name}</h1>
        <p className="description">{data.brand.description}</p>
      </section>

      <section className="section">
        <h2>Collections</h2>
        <ul className="card-grid">
          {data.collections.map((collection) => (
            <li className="card" key={collection.slug}>
              <p className="label">{collection.season}</p>
              <h3>{collection.title}</h3>
              <p>{collection.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Campaigns</h2>
        <ul className="card-grid">
          {data.campaigns.map((campaign) => (
            <li className="card" key={campaign.slug}>
              <p className="label">{campaign.year}</p>
              <h3>{campaign.title}</h3>
              <p>{campaign.concept}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
