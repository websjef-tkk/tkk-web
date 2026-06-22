import Link from "next/link";
import type { SanityEvent } from "@/lib/queries/events";

type Props = {
  event: SanityEvent;
  locale: string;
  labels: {
    difficulty_nybegynner: string;
    difficulty_middels: string;
    difficulty_erfaren: string;
    register: string;
  };
};

const difficultyColour: Record<string, string> = {
  nybegynner: "bg-green-100 text-green-800",
  middels: "bg-yellow-100 text-yellow-800",
  erfaren: "bg-red-100 text-red-800",
};

const categoryColour: Record<string, string> = {
  tur: "bg-tkk-blue/20 text-navy",
  kurs: "bg-teal/20 text-teal",
  sosial: "bg-sand/30 text-navy",
};

const DAY_LABELS: Record<string, { no: string; en: string }> = {
  monday: { no: "Mandag", en: "Monday" },
  tuesday: { no: "Tirsdag", en: "Tuesday" },
  wednesday: { no: "Onsdag", en: "Wednesday" },
  thursday: { no: "Torsdag", en: "Thursday" },
  friday: { no: "Fredag", en: "Friday" },
  saturday: { no: "Lørdag", en: "Saturday" },
  sunday: { no: "Søndag", en: "Sunday" },
};

function formatDate(dateStr: string, endDate?: string, locale?: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", {
      day: "numeric",
      month: "short",
    });
  return endDate ? `${fmt(dateStr)} – ${fmt(endDate)}` : fmt(dateStr);
}

export default function EventCard({ event, locale, labels }: Props) {
  const title = locale === "no" ? event.title.no : (event.title.en ?? event.title.no);
  const desc = locale === "no" ? event.description?.no : (event.description?.en ?? event.description?.no);
  const diffLabel =
    event.difficulty === "nybegynner"
      ? labels.difficulty_nybegynner
      : event.difficulty === "middels"
      ? labels.difficulty_middels
      : event.difficulty === "erfaren"
      ? labels.difficulty_erfaren
      : undefined;

  const whenLabel = event.isRecurring
    ? `${DAY_LABELS[event.dayOfWeek ?? ""]?.[locale === "no" ? "no" : "en"] ?? event.dayOfWeek}${event.time ? ` kl. ${event.time}` : ""}`
    : formatDate(event.date!, event.endDate, locale);

  return (
    <Link
      href={`/${locale}/aktiviteter/${event.slug}`}
      className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      <div className={`border-l-4 px-5 py-4 flex-1 ${event.cancelled ? "border-red-500" : "border-tkk-blue"}`}>
        <div className="flex flex-wrap gap-2 mb-2">
          {event.cancelled && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              {locale === "no" ? "AVLYST" : "CANCELLED"}
            </span>
          )}
          {event.isRecurring && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-tkk-blue/20 text-navy">
              {locale === "no" ? "FAST" : "RECURRING"}
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColour[event.category] ?? ""}`}>
            {event.category.toUpperCase()}
          </span>
          {event.difficulty && diffLabel && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColour[event.difficulty] ?? ""}`}>
              {diffLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-slate font-medium mb-1">{whenLabel}</p>
        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-2">{title}</h3>
        {event.location && <p className="text-slate text-sm mb-1">📍 {event.location}</p>}
        {desc && <p className="text-slate text-sm leading-relaxed">{desc}</p>}
      </div>
      <div className="px-5 py-3 bg-mist border-t border-mist">
        <span className="text-teal text-sm font-semibold">{labels.register} →</span>
      </div>
    </Link>
  );
}
