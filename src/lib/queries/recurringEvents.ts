import { sanityClient } from "../sanity";

export interface RecurringEvent {
  _id: string;
  title: { no: string; en?: string };
  dayOfWeek: string;
  time?: string;
  discipline?: string;
  location?: string;
  description?: { no?: string; en?: string };
  sortOrder?: number;
}

export async function getAllRecurringEvents(): Promise<RecurringEvent[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "recurringEvent"] | order(sortOrder asc) {
        _id,
        title,
        dayOfWeek,
        time,
        discipline,
        location,
        description,
        sortOrder
      }`
    );
  } catch {
    return [];
  }
}
