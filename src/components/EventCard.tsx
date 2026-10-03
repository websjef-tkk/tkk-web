import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanityImage";
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

  const whenLabel = formatDate(event.date, event.endDate);
  const imageUrl = event.image?.asset ? urlFor(event.image).width(600).height(300).url() : null;

  // Aktiviteter importert fra iSonen lenker rett dit (nytt vindu); påmelding skjer der.
  const isonenUrl = event.externalSource === "isonen" ? event.registerUrl : undefined;

  const content = (
    <>
      {imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <Image src={imageUrl} alt={event.image?.alt ?? title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
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
      </div>
      <div className="px-5 py-3 bg-mist border-t border-mist">
        <span className="text-teal text-sm font-semibold">{isonenUrl ? "Les mer på iSonen →" : "Les mer →"}</span>
      </div>
    </>
  );

  const className =
    "group bg-white rounded-xl shadow-sm border border-mist overflow-hidden flex flex-col hover:shadow-md transition-shadow";

  return isonenUrl ? (
    <a href={isonenUrl} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={`/aktiviteter/${event.slug}`} className={className}>
      {content}
    </Link>
  );
}
