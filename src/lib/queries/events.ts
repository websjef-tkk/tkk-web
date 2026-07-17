import { sanityClient } from "../sanity";
import { bodyProjection } from "./shared";

export interface SanityEvent {
  _id: string;
  slug: string;
  title: { no: string; en?: string };
  description?: { no?: string; en?: string };
  body?: { no?: unknown[]; en?: unknown[] };
  isRecurring?: boolean;
  date?: string;
  endDate?: string;
  dayOfWeek?: string;
  time?: string;
  location?: string;
  category: string;
  discipline?: string;
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
  isRecurring,
  date,
  endDate,
  dayOfWeek,
  time,
  location,
  category,
  discipline,
  difficulty,
  registerUrl,
  cancelled,
  externalSource,
  externalId
`;

export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  try {
    const now = new Date().toISOString();
    return await sanityClient.fetch(
      `*[_type == "event" && isRecurring != true && date >= $now] | order(date asc) { ${eventProjection} }`,
      { now }
    );
  } catch {
    return [];
  }
}

export async function getRecurringEvents(): Promise<SanityEvent[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "event" && isRecurring == true] | order(sortOrder asc) { ${eventProjection} }`
    );
  } catch {
    return [];
  }
}

export async function getAllEvents(): Promise<SanityEvent[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "event"] | order(isRecurring asc, date asc) { ${eventProjection} }`
    );
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<SanityEvent | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "event" && slug.current == $slug][0] { ${eventProjection} }`,
      { slug }
    );
  } catch {
    return null;
  }
}
