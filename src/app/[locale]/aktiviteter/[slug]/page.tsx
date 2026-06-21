import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getEventBySlug } from "@/lib/queries/events";
import type { SanityEvent } from "@/lib/queries/events";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const DAY_LABELS: Record<string, { no: string; en: string }> = {
  monday: { no: "Mandag", en: "Monday" },
  tuesday: { no: "Tirsdag", en: "Tuesday" },
  wednesday: { no: "Onsdag", en: "Wednesday" },
  thursday: { no: "Torsdag", en: "Thursday" },
  friday: { no: "Fredag", en: "Friday" },
  saturday: { no: "Lørdag", en: "Saturday" },
  sunday: { no: "Søndag", en: "Sunday" },
};

export default async function EventDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailContent locale={locale} event={event} />;
}

function EventDetailContent({ locale, event }: { locale: string; event: SanityEvent }) {
  const title = locale === "no" ? event.title.no : (event.title.en ?? event.title.no);
  const desc = locale === "no" ? event.description?.no : (event.description?.en ?? event.description?.no);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (locale === "no" ? event.body?.no : (event.body?.en ?? event.body?.no)) as any[] | undefined;

  const backLabel = locale === "no" ? "← Alle aktiviteter" : "← All activities";
  const registerLabel = locale === "no" ? "Meld deg på" : "Register";

  const whenLabel = event.isRecurring
    ? `${DAY_LABELS[event.dayOfWeek ?? ""]?.[locale === "no" ? "no" : "en"] ?? event.dayOfWeek}${event.time ? ` kl. ${event.time}` : ""}`
    : event.date
      ? new Date(event.date).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/aktiviteter`} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        {backLabel}
      </Link>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {event.isRecurring && (
          <span className="bg-tkk-blue text-navy text-xs font-semibold px-2 py-0.5 rounded">
            {locale === "no" ? "FAST" : "RECURRING"}
          </span>
        )}
        <span className="text-slate text-sm font-medium">{whenLabel}</span>
        {event.location && <span className="text-slate text-sm">📍 {event.location}</span>}
      </div>

      <h1 className="font-display font-bold text-navy text-3xl md:text-4xl leading-tight mb-8">{title}</h1>

      {desc && <p className="text-slate text-lg leading-relaxed mb-6">{desc}</p>}

      {body?.length ? (
        <div className="prose prose-slate max-w-none leading-relaxed mb-8">
          <PortableText value={body} />
        </div>
      ) : null}

      {event.registerUrl && (
        <Link
          href={event.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-teal transition-colors"
        >
          {registerLabel} →
        </Link>
      )}

      <div className="mt-12 border-t border-mist pt-6">
        <Link href={`/${locale}/aktiviteter`} className="text-teal text-sm font-semibold hover:underline">
          {backLabel}
        </Link>
      </div>
    </article>
  );
}
