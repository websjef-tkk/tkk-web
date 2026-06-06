import { sanityClient } from "../sanity";

export interface SanityPerson {
  _id: string;
  name: string;
  role: { no: string; en?: string };
  group: "board" | "leaders" | "others";
  sortOrder?: number;
  phone?: string;
  email: string;
}

export async function getAllPeople(): Promise<SanityPerson[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "person"] | order(group asc, sortOrder asc) {
        _id,
        name,
        role,
        group,
        sortOrder,
        phone,
        email
      }`
    );
  } catch {
    return [];
  }
}
