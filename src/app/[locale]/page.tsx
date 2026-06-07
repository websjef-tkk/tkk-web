import { useTranslations } from "next-intl";
import HeroSection from "@/components/HeroSection";
import DisciplineCard from "@/components/DisciplineCard";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/queries/events";
import { getAllBlogPosts } from "@/lib/queries/blog";
import { getAllRecurringEvents } from "@/lib/queries/recurringEvents";
import { getSiteSettings } from "@/lib/queries/settings";
import type { SanityEvent } from "@/lib/queries/events";
import type { BlogPostSummary } from "@/lib/queries/blog";
import type { RecurringEvent } from "@/lib/queries/recurringEvents";
import type { Partner } from "@/lib/queries/settings";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [events, posts, recurringEvents, settings] = await Promise.all([
    getUpcomingEvents(),
    getAllBlogPosts(),
    getAllRecurringEvents(),
    getSiteSettings(),
  ]);
  return (
    <HomeContent
      locale={locale}
      events={events.slice(0, 3)}
      posts={posts.slice(0, 3)}
      recurringEvents={recurringEvents}
      partners={settings?.partners ?? []}
    />
  );
}

const DAY_LABELS: Record<string, { no: string; en: string }> = {
  monday: { no: "Mandag", en: "Monday" },
  tuesday: { no: "Tirsdag", en: "Tuesday" },
  wednesday: { no: "Onsdag", en: "Wednesday" },
  thursday: { no: "Torsdag", en: "Thursday" },
  friday: { no: "Fredag", en: "Friday" },
  saturday: { no: "Lørdag", en: "Saturday" },
  sunday: { no: "Søndag", en: "Sunday" },
};

function HomeContent({
  locale,
  events,
  posts,
  recurringEvents,
  partners,
}: {
  locale: string;
  events: SanityEvent[];
  posts: BlogPostSummary[];
  recurringEvents: RecurringEvent[];
  partners: Partner[];
}) {
  const t = useTranslations("home");
  const td = useTranslations("disciplines");
  const te = useTranslations("events");
  const tb = useTranslations("blog");

  const disciplines = [
    { key: "hav", emoji: "🌊", href: `/${locale}/padling/hav` },
    { key: "elv", emoji: "🏔️", href: `/${locale}/padling/elv` },
    { key: "flattvann", emoji: "🏅", href: `/${locale}/padling/flattvann` },
    { key: "surfski", emoji: "⚡", href: `/${locale}/padling/surfski` },
    { key: "polo", emoji: "🏐", href: `/${locale}/padling/polo` },
    { key: "junior", emoji: "🌱", href: `/${locale}/padling/junior` },
  ] as const;

  const blogCatLabels: Record<string, string> = {
    category_tur: tb("category_tur"),
    category_info: tb("category_info"),
    category_klubb: tb("category_klubb"),
    category_sosial: tb("category_sosial"),
  };

  const eventLabels = {
    difficulty_nybegynner: te("difficulty_nybegynner"),
    difficulty_middels: te("difficulty_middels"),
    difficulty_erfaren: te("difficulty_erfaren"),
    register: te("register"),
  };

  return (
    <>
      <HeroSection
        title={t("hero_title")}
        subtitle={t("hero_sub")}
        imageSrc="/images/hav.jpg"
        imageAlt="Havpadling på Trondhjemsfjorden"
        cta={{ label: t("cta_join"), href: `/${locale}/medlemskap` }}
        ctaSecondary={{ label: t("cta_events"), href: `/${locale}/aktiviteter` }}
      />

      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            t("stats_members"),
            t("stats_locations"),
            t("stats_equipment"),
            t("stats_disciplines"),
          ].map((stat) => (
            <div key={stat} className="text-sm font-semibold text-white/80">
              <span className="text-tkk-blue">✓</span> {stat}
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-3xl mb-8">{t("disciplines_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map(({ key, emoji, href }) => (
            <DisciplineCard
              key={key}
              title={td(`${key}_title`)}
              description={td(`${key}_desc`)}
              href={href}
              emoji={emoji}
              readMore={td("read_more")}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-8 border-t-2 border-teal mb-2" />
          <h2 className="font-display font-bold text-navy text-3xl mb-8">{t("events_title")}</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <EventCard key={e._id} event={e} locale={locale} labels={eventLabels} />
              ))}
            </div>
          ) : (
            <p className="text-slate">{locale === "no" ? "Ingen kommende arrangementer." : "No upcoming events."}</p>
          )}
          <div className="mt-8">
            <Link
              href={`/${locale}/aktiviteter`}
              className="inline-block border border-navy text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
            >
              {t("events_all")} →
            </Link>
          </div>
        </div>
      </section>

      {recurringEvents.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-8 border-t-2 border-teal mb-2" />
            <h2 className="font-display font-bold text-navy text-3xl mb-8">
              {locale === "no" ? "Faste turer og trening" : "Regular tours and training"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recurringEvents.map((re) => {
                const title = locale === "no" ? re.title.no : (re.title.en ?? re.title.no);
                const desc = locale === "no" ? re.description?.no : (re.description?.en ?? re.description?.no);
                const day = DAY_LABELS[re.dayOfWeek]?.[locale === "no" ? "no" : "en"] ?? re.dayOfWeek;
                return (
                  <div key={re._id} className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="text-teal text-xs font-semibold uppercase tracking-wider mb-1">
                      {day}{re.time ? ` kl. ${re.time}` : ""}
                    </div>
                    <h3 className="font-display font-bold text-navy text-lg mb-2">{title}</h3>
                    {re.location && <div className="text-slate text-sm mb-2">📍 {re.location}</div>}
                    {desc && <p className="text-slate text-sm leading-relaxed">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-8 border-t-2 border-teal mb-2" />
            <h2 className="font-display font-bold text-navy text-2xl mb-8">
              {locale === "no" ? "Samarbeidspartnere" : "Partners"}
            </h2>
            <div className="flex flex-wrap gap-6">
              {partners.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-6 py-4 hover:border-teal hover:shadow-md transition-all"
                >
                  <span className="font-semibold text-navy">{p.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-3xl mb-8">{tb("latest")}</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                locale={locale}
                readMoreLabel={tb("read_more")}
                byLabel={tb("by")}
                categoryLabels={blogCatLabels}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate">{locale === "no" ? "Ingen blogginnlegg ennå." : "No blog posts yet."}</p>
        )}
        <div className="mt-8">
          <Link
            href={`/${locale}/blogg`}
            className="inline-block border border-navy text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {tb("all")} →
          </Link>
        </div>
      </section>

      <section className="bg-tkk-blue py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-navy text-3xl mb-4">{t("join_title")}</h2>
          <p className="text-navy/80 text-lg leading-relaxed mb-8">{t("join_text")}</p>
          <Link
            href={`/${locale}/medlemskap`}
            className="inline-block bg-navy text-white font-semibold px-8 py-3 rounded hover:bg-teal transition-colors"
          >
            {t("join_btn")}
          </Link>
        </div>
      </section>
    </>
  );
}
