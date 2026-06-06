import { sanityClient } from "../sanity";

export interface SanityEvent {
  _id: string;
  title: { no: string; en?: string };
  description?: { no?: string; en?: string };
  date: string;
  endDate?: string;
  category: string;
  discipline?: string;
  difficulty?: string;
  registerUrl?: string;
}

export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  try {
    const now = new Date().toISOString();
    return await sanityClient.fetch(
      `*[_type == "event" && date >= $now] | order(date asc) {
        _id,
        title,
        description,
        date,
        endDate,
        category,
        discipline,
        difficulty,
        registerUrl
      }`,
      { now }
    );
  } catch {
    return [];
  }
}

export async function getAllEvents(): Promise<SanityEvent[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "event"] | order(date asc) {
        _id,
        title,
        description,
        date,
        endDate,
        category,
        discipline,
        difficulty,
        registerUrl
      }`
    );
  } catch {
    return [];
  }
}
