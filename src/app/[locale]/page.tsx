import { useTranslations } from "next-intl";
import HeroSection from "@/components/HeroSection";
import DisciplineCard from "@/components/DisciplineCard";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/queries/events";
import { getAllBlogPosts } from "@/lib/queries/blog";
import type { SanityEvent } from "@/lib/queries/events";
import type { BlogPostSummary } from "@/lib/queries/blog";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [events, posts] = await Promise.all([
    getUpcomingEvents(),
    getAllBlogPosts(),
  ]);
  return (
    <HomeContent
      locale={locale}
      events={events.slice(0, 3)}
      posts={posts.slice(0, 3)}
    />
  );
}

function HomeContent({
  locale,
  events,
  posts,
}: {
  locale: string;
  events: SanityEvent[];
  posts: BlogPostSummary[];
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
