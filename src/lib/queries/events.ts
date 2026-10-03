import { sanityClient, getSanityClient } from "../sanity";
import { bodyProjection } from "./shared";

export interface SanityEvent {
  _id: string;
  slug: string;
  title: { no: string };
  description?: { no?: string };
  body?: { no?: unknown[] };
  image?: { asset?: { _ref: string }; alt?: string };
  date: string;
  endDate?: string;
  location?: string;
  category: string;
  disciplines?: string[];
  difficulty?: string;
  registerUrl?: string;
  cancelled?: boolean;
  externalSource?: string;
  externalId?: string;
}

const eventProjection = `
  _id,
  "slug": slug.current,
  title,
  description,
  ${bodyProjection},
  image,
  date,
  endDate,
  location,
  category,
  disciplines,
  difficulty,
  registerUrl,
  cancelled,
  externalSource,
  externalId
`;

/** Kommende aktiviteter, inkludert de som har startet men ikke er ferdige ennå. */
export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  try {
    const now = new Date().toISOString();
    return await sanityClient.fetch(
      `*[_type == "event" && coalesce(endDate, date) >= $now] | order(date asc) { ${eventProjection} }`,
      { now }
    );
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<SanityEvent | null> {
  try {
    const client = await getSanityClient();
    return await client.fetch(
      `*[_type == "event" && slug.current == $slug][0] { ${eventProjection} }`,
      { slug }
    );
  } catch {
    return null;
  }
}
