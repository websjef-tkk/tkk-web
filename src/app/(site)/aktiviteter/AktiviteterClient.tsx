"use client";

import { useState } from "react";
import EventCard, { DISCIPLINE_LABELS } from "@/components/EventCard";
import type { SanityEvent } from "@/lib/queries/events";
import { EVENT_DIFFICULTY_LABELS } from "@/lib/labels";
import { EVENT_CATEGORIES } from "../../../../sanity/schemas/objects/eventCategories";

// Skjematittelen brukes som fane-label som standard; noen få overstyres for
// bedre frontend-ordlyd (f.eks. "Tur" -> "Turer" på en flertallsfane).
const CATEGORY_LABEL_OVERRIDES: Record<string, string> = { tur: "Turer" };

const categoryTabs: { key: string; label: string }[] = [
  { key: "all", label: "Alle" },
  ...EVENT_CATEGORIES.map((c) => ({ key: c.value, label: CATEGORY_LABEL_OVERRIDES[c.value] ?? c.title })),
];

const grenTabs: { key: string; label: string }[] = [
  { key: "all", label: "Alle grener" },
  ...Object.entries(DISCIPLINE_LABELS).map(([key, label]) => ({ key, label })),
];

type Props = {
  events: SanityEvent[];
};

function EventGrid({ events }: { events: SanityEvent[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((e) => (
        <EventCard key={e._id} event={e} labels={EVENT_DIFFICULTY_LABELS} />
      ))}
    </div>
  );
}

export default function AktiviteterClient({ events }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [grenFilter, setGrenFilter] = useState<string>("all");

  const filtered = events.filter((e) => {
    if (filter !== "all" && e.category !== filter) return false;
    if (grenFilter !== "all" && !e.disciplines?.includes(grenFilter)) return false;
    return true;
  });

  const recurring = filtered.filter((e) => e.isRecurring);
  const oneOff = filtered.filter((e) => !e.isRecurring);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-8">Aktiviteter og kurs</h1>

      <div className="flex flex-wrap gap-2 mb-3">
        {categoryTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              filter === key
                ? "bg-navy text-white"
                : "bg-white border border-navy/20 text-navy hover:bg-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {grenTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setGrenFilter(key)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              grenFilter === key
                ? "bg-navy text-white"
                : "bg-white border border-navy/20 text-navy hover:bg-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate">Ingen kommende aktiviteter i denne kategorien.</p>
      ) : (
        <>
          {recurring.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-navy text-xl mb-4">Faste aktiviteter</h2>
              <EventGrid events={recurring} />
            </div>
          )}

          {recurring.length > 0 && oneOff.length > 0 && <hr className="border-mist mb-10" />}

          {oneOff.length > 0 && (
            <div>
              {recurring.length > 0 && (
                <h2 className="font-display font-bold text-navy text-xl mb-4">Andre aktiviteter</h2>
              )}
              <EventGrid events={oneOff} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
