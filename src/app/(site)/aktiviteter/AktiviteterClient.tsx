"use client";

import { useState } from "react";
import EventCard from "@/components/EventCard";
import type { SanityEvent } from "@/lib/queries/events";
import { EVENT_DIFFICULTY_LABELS } from "@/lib/labels";

type Category = "all" | "tur" | "kurs" | "sosial";

type Props = {
  events: SanityEvent[];
};

export default function AktiviteterClient({ events }: Props) {
  const [filter, setFilter] = useState<Category>("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);

  const tabs: { key: Category; label: string }[] = [
    { key: "all", label: "Alle" },
    { key: "tur", label: "Turer" },
    { key: "kurs", label: "Kurs" },
    { key: "sosial", label: "Sosiale" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-8">Aktiviteter og kurs</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map(({ key, label }) => (
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

      {filtered.length === 0 ? (
        <p className="text-slate">Ingen kommende aktiviteter i denne kategorien.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => (
            <EventCard key={e._id} event={e} labels={EVENT_DIFFICULTY_LABELS} />
          ))}
        </div>
      )}
    </div>
  );
}
