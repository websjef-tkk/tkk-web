import { NextRequest, NextResponse } from "next/server";
import { fetchIsonenEvents, isonenStartDate, type IsonenEvent } from "@/lib/isonen";
import { sanityWriteClient } from "@/lib/sanity";

// Kjøres hver time av GitHub Actions (.github/workflows/sync-isonen.yml) og
// daglig av Vercel Cron (vercel.json) som reserve.

/** Feltene som eies av iSonen og overskrives ved hver synk. Alt annet eies av redaksjonen. */
interface SyncedFields {
  "title.no": string;
  date: string;
  endDate?: string;
  location?: string;
  registerUrl: string;
  cancelled: boolean;
}

interface ExistingDoc {
  _id: string;
  externalId: string;
  title?: { no?: string };
  date?: string;
  endDate?: string;
  location?: string;
  registerUrl?: string;
  cancelled?: boolean;
}

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return req.headers.get("authorization") === `Bearer ${expected}`;
}

function syncedFields(event: IsonenEvent): SyncedFields {
  return {
    "title.no": event.title,
    date: event.date,
    endDate: event.endDate,
    location: event.location,
    registerUrl: event.registerUrl,
    cancelled: event.cancelled,
  };
}

/** Patcher bare feltene som faktisk er endret. Returnerer true hvis noe ble skrevet. */
async function updateIfChanged(doc: ExistingDoc, fields: SyncedFields): Promise<boolean> {
  const current: Record<string, unknown> = {
    "title.no": doc.title?.no,
    date: doc.date,
    endDate: doc.endDate,
    location: doc.location,
    registerUrl: doc.registerUrl,
    cancelled: doc.cancelled ?? false,
  };
  const set: Record<string, unknown> = {};
  const unset: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    const old = current[key];
    const same =
      (key === "date" || key === "endDate") && typeof old === "string" && typeof value === "string"
        ? new Date(old).getTime() === new Date(value).getTime()
        : old === value;
    if (same) continue;
    if (value === undefined) unset.push(key);
    else set[key] = value;
  }
  if (Object.keys(set).length === 0 && unset.length === 0) return false;
  let patch = sanityWriteClient.patch(doc._id).set(set);
  if (unset.length > 0) patch = patch.unset(unset);
  await patch.commit();
  return true;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Laster ned bildet fra iSonen og laster det opp til Sanity. Feil her stopper ikke importen. */
async function uploadImage(event: IsonenEvent) {
  if (!event.imageUrl) return undefined;
  try {
    const res = await fetch(event.imageUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const asset = await sanityWriteClient.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
      filename: `isonen-${event.externalId}`,
    });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: event.title };
  } catch (err) {
    console.warn(`Klarte ikke importere bilde for ${event.externalId}:`, err);
    return undefined;
  }
}

async function createDraft(event: IsonenEvent) {
  await sanityWriteClient.create({
    _id: `drafts.event-isonen-${event.externalId}`,
    _type: "event",
    title: { no: event.title },
    slug: { _type: "slug", current: `${slugify(event.title)}-${event.externalId.slice(-6)}` },
    date: event.date,
    endDate: event.endDate,
    location: event.location,
    registerUrl: event.registerUrl,
    cancelled: event.cancelled,
    category: event.category,
    image: await uploadImage(event),
    externalSource: "isonen",
    externalId: event.externalId,
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startDate = isonenStartDate();
  let events: IsonenEvent[];
  try {
    events = await fetchIsonenEvents(startDate);
  } catch (err) {
    console.error("iSonen-synk feilet:", err);
    return NextResponse.json({ error: "Klarte ikke hente data fra iSonen" }, { status: 502 });
  }

  try {
    return NextResponse.json(await syncToSanity(events, startDate));
  } catch (err) {
    // Ruten er beskyttet av CRON_SECRET, så feilmeldingen kan trygt vises i GitHub-loggen.
    console.error("Skriving til Sanity feilet:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Skriving til Sanity feilet: ${message}` }, { status: 500 });
  }
}

async function syncToSanity(events: IsonenEvent[], startDate: string) {
  // Både publiserte dokumenter og kladder, slik at begge holdes oppdatert.
  const existing = await sanityWriteClient.fetch<ExistingDoc[]>(
    `*[_type == "event" && externalSource == "isonen"]{ _id, externalId, title, date, endDate, location, registerUrl, cancelled }`,
    {},
    { perspective: "raw" }
  );
  const docsByExternalId = new Map<string, ExistingDoc[]>();
  for (const doc of existing) {
    docsByExternalId.set(doc.externalId, [...(docsByExternalId.get(doc.externalId) ?? []), doc]);
  }

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const event of events) {
    const docs = docsByExternalId.get(event.externalId);
    if (!docs) {
      await createDraft(event);
      created++;
      continue;
    }
    const fields = syncedFields(event);
    let changed = false;
    for (const doc of docs) {
      if (await updateIfChanged(doc, fields)) changed = true;
    }
    if (changed) updated++;
    else unchanged++;
  }

  // Kommende aktiviteter som er fjernet fra iSonen markeres som avlyst. Et tomt svar
  // tolkes som en mulig API-feil, så da avlyses ingenting.
  let cancelled = 0;
  if (events.length > 0) {
    const seenIds = new Set(events.map((e) => e.externalId));
    const startTime = new Date(startDate).getTime();
    for (const doc of existing) {
      if (seenIds.has(doc.externalId) || doc.cancelled) continue;
      if (!doc.date || new Date(doc.date).getTime() < startTime) continue;
      await sanityWriteClient.patch(doc._id).set({ cancelled: true }).commit();
      cancelled++;
    }
  }

  return { created, updated, cancelled, unchanged, total: events.length };
}
