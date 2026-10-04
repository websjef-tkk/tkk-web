import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/queries/events";
import type { SanityEvent } from "@/lib/queries/events";
import { DISCIPLINE_LABELS } from "@/components/EventCard";
import { buildPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { urlFor } from "@/lib/sanity";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return buildPageMetadata(event);
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailContent event={event} />;
}

function EventDetailContent({ event }: { event: SanityEvent }) {
  const title = event.title.no;
  const desc = event.description?.no;

  const backLabel = "← Alle aktiviteter";
  const disciplineLabels = (event.disciplines ?? [])
    .map((d) => DISCIPLINE_LABELS[d])
    .filter((label): label is string => Boolean(label));

  const whenLabel = new Date(event.date).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const imageUrl = event.image?.asset ? urlFor(event.image).width(1200).height(600).url() : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        path={`aktiviteter/${event.slug}`}
        current={title}
        back={
          <Link href="/aktiviteter" className="hover:text-teal hover:underline">
            {backLabel}
          </Link>
        }
      />

      {imageUrl && (
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image src={imageUrl} alt={event.image?.alt ?? title} fill className="object-cover" priority />
        </div>
      )}

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

      {desc && <p className="text-slate text-lg leading-relaxed whitespace-pre-line mb-8">{desc}</p>}

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
