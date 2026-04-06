import { defineQuery } from 'next-sanity';

export const homepageQuery = defineQuery(`{
  "brand": *[_type == "brand"][0]{
    name,
    tagline,
    description
  },
  "collections": *[_type == "collection"] | order(_createdAt desc)[0...6]{
    title,
    "slug": slug.current,
    season,
    summary
  },
  "campaigns": *[_type == "campaign"] | order(year desc)[0...6]{
    title,
    "slug": slug.current,
    year,
    concept
  }
}`);
