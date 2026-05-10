import Link from "next/link";
import type { Event } from "@/data/events";

type Props = {
  event: Event;
  locale: string;
  labels: {
    difficulty_nybegynner: string;
    difficulty_middels: string;
    difficulty_erfaren: string;
    register: string;
  };
};

const difficultyColour = {
  nybegynner: "bg-green-100 text-green-800",
  middels: "bg-yellow-100 text-yellow-800",
  erfaren: "bg-red-100 text-red-800",
};

const categoryColour: Record<string, string> = {
  tur: "bg-tkk-blue/20 text-navy",
  kurs: "bg-teal/20 text-teal",
  sosial: "bg-sand/30 text-navy",
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
  const title = locale === "no" ? event.titleNo : event.titleEn;
  const desc = locale === "no" ? event.descNo : event.descEn;
  const diffLabel =
    event.difficulty === "nybegynner"
      ? labels.difficulty_nybegynner
      : event.difficulty === "middels"
      ? labels.difficulty_middels
      : labels.difficulty_erfaren;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden flex flex-col">
      <div className="border-l-4 border-tkk-blue px-5 py-4 flex-1">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColour[event.category] ?? ""}`}>
            {event.category.toUpperCase()}
          </span>
          {event.difficulty && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColour[event.difficulty]}`}>
              {diffLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-slate font-medium mb-1">
          {formatDate(event.date, event.endDate, locale)}
        </p>
        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-2">{title}</h3>
        <p className="text-slate text-sm leading-relaxed">{desc}</p>
      </div>
      {event.registerUrl && (
        <div className="px-5 py-3 bg-mist border-t border-mist">
          <Link
            href={event.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal text-sm font-semibold hover:underline"
          >
            {labels.register} →
          </Link>
        </div>
      )}
    </div>
  );
}
