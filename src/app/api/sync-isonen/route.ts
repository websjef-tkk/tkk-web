import { NextRequest, NextResponse } from "next/server";
import { fetchIsonenEvents } from "@/lib/isonen";
import { sanityWriteClient } from "@/lib/sanity";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${expected}`) return true;
  const secretParam = req.nextUrl.searchParams.get("secret");
  return secretParam === expected;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await fetchIsonenEvents();
  const seenIds = new Set(events.map((e) => e.externalId));

  let created = 0;
  let updated = 0;

  for (const event of events) {
    const draftId = `drafts.event-isonen-${event.externalId}`;
    const publishedId = `event-isonen-${event.externalId}`;

    const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_id == $draftId || _id == $publishedId][0]{ _id }`,
      { draftId, publishedId }
    );

    const fields = {
      title: { no: event.title },
      slug: { _type: "slug", current: `isonen-${event.externalId}` },
      description: event.description ? { no: event.description } : undefined,
      isRecurring: false,
      date: event.date,
      endDate: event.endDate,
      location: event.location,
      category: "tur",
      registerUrl: event.registerUrl,
      externalSource: "isonen",
      externalId: event.externalId,
      cancelled: false,
    };

    if (existing) {
      await sanityWriteClient.patch(existing._id).set(fields).commit();
      updated++;
    } else {
      await sanityWriteClient.create({ _id: draftId, _type: "event", ...fields });
      created++;
    }
  }

  // Marker tidligere importerte aktiviteter som ikke lenger finnes i iSonen som avlyst.
  const previouslyImported = await sanityWriteClient.fetch<{ _id: string; externalId: string }[]>(
    `*[_type == "event" && externalSource == "isonen"]{ _id, externalId }`
  );
  let cancelled = 0;
  for (const doc of previouslyImported) {
    if (!seenIds.has(doc.externalId)) {
      await sanityWriteClient.patch(doc._id).set({ cancelled: true }).commit();
      cancelled++;
    }
  }

  return NextResponse.json({ created, updated, cancelled, total: events.length });
}
