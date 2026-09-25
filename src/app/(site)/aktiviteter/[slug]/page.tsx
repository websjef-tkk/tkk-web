import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getEventBySlug } from "@/lib/queries/events";
import type { SanityEvent } from "@/lib/queries/events";
import { richTextComponents } from "@/components/portableText/richTextComponents";
import { DISCIPLINE_LABELS } from "@/components/EventCard";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return buildPageMetadata(event);
}

const DAY_LABELS: Record<string, string> = {
  monday: "Mandag",
  tuesday: "Tirsdag",
  wednesday: "Onsdag",
  thursday: "Torsdag",
  friday: "Fredag",
  saturday: "Lørdag",
  sunday: "Søndag",
};

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailContent event={event} />;
}

function EventDetailContent({ event }: { event: SanityEvent }) {
  const title = event.title.no;
  const desc = event.description?.no;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = event.body?.no as any[] | undefined;

  const backLabel = "← Alle aktiviteter";
  const disciplineLabels = (event.disciplines ?? [])
    .map((d) => DISCIPLINE_LABELS[d])
    .filter((label): label is string => Boolean(label));

  const whenLabel = event.isRecurring
    ? `${DAY_LABELS[event.dayOfWeek ?? ""] ?? event.dayOfWeek}${event.time ? ` kl. ${event.time}` : ""}`
    : event.date
      ? new Date(event.date).toLocaleDateString("nb-NO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/aktiviteter" className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        {backLabel}
      </Link>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {event.cancelled && (
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">
            AVLYST
          </span>
        )}
        {disciplineLabels.map((label) => (
          <span key={label} className="bg-navy/10 text-navy text-xs font-semibold px-2 py-0.5 rounded">
            {label.toUpperCase()}
          </span>
        ))}
        <span className="text-slate text-sm font-medium">{whenLabel}</span>
        {event.location && <span className="text-slate text-sm">📍 {event.location}</span>}
      </div>

      <h1 className="font-display font-bold text-navy text-3xl md:text-4xl leading-tight mb-8">{title}</h1>

      {desc && <p className="text-slate text-lg leading-relaxed mb-6">{desc}</p>}

      {body?.length ? (
        <div className="prose prose-slate max-w-none leading-relaxed mb-8">
          <PortableText value={body} components={richTextComponents} />
        </div>
      ) : null}

      {event.registerUrl && (
        <Link
          href={event.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-teal transition-colors"
        >
          Meld deg på →
        </Link>
      )}

      <div className="mt-12 border-t border-mist pt-6">
        <Link href="/aktiviteter" className="text-teal text-sm font-semibold hover:underline">
          {backLabel}
        </Link>
      </div>
    </article>
  );
}
