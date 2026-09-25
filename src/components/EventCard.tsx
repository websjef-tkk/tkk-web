import Link from "next/link";
import type { SanityEvent } from "@/lib/queries/events";

type Props = {
  event: SanityEvent;
  labels: {
    difficulty_nybegynner: string;
    difficulty_middels: string;
    difficulty_erfaren: string;
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

export const DISCIPLINE_LABELS: Record<string, string> = {
  hav: "Hav",
  elv: "Elv",
  flattvann: "Flattvann",
  surfski: "Surfski",
  polo: "Kajakkpolo",
  junior: "Junior",
  pirbadet: "Pirbadet",
};

export const disciplineColour = "bg-navy/10 text-navy";

const DAY_LABELS: Record<string, string> = {
  monday: "Mandag",
  tuesday: "Tirsdag",
  wednesday: "Onsdag",
  thursday: "Torsdag",
  friday: "Fredag",
  saturday: "Lørdag",
  sunday: "Søndag",
};

function formatDate(dateStr: string, endDate?: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
    });
  return endDate ? `${fmt(dateStr)} – ${fmt(endDate)}` : fmt(dateStr);
}

export default function EventCard({ event, labels }: Props) {
  const title = event.title.no;
  const desc = event.description?.no;
  const diffLabel =
    event.difficulty === "nybegynner"
      ? labels.difficulty_nybegynner
      : event.difficulty === "middels"
      ? labels.difficulty_middels
      : event.difficulty === "erfaren"
      ? labels.difficulty_erfaren
      : undefined;

  const disciplineLabels = (event.disciplines ?? [])
    .map((d) => DISCIPLINE_LABELS[d])
    .filter((label): label is string => Boolean(label));

  const whenLabel = event.isRecurring
    ? `${DAY_LABELS[event.dayOfWeek ?? ""] ?? event.dayOfWeek}${event.time ? ` kl. ${event.time}` : ""}`
    : formatDate(event.date!, event.endDate);

  return (
    <Link
      href={`/aktiviteter/${event.slug}`}
      className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      <div className={`border-l-4 px-5 py-4 flex-1 ${event.cancelled ? "border-red-500" : "border-tkk-blue"}`}>
        <div className="flex flex-wrap gap-2 mb-2">
          {event.cancelled && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              AVLYST
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColour[event.category] ?? ""}`}>
            {event.category.toUpperCase()}
          </span>
          {disciplineLabels.map((label) => (
            <span key={label} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${disciplineColour}`}>
              {label.toUpperCase()}
            </span>
          ))}
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
        <span className="text-teal text-sm font-semibold">Les mer →</span>
      </div>
    </Link>
  );
}
