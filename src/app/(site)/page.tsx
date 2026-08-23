import Link from "next/link";
import HeroCarousel, { type HeroSlideView } from "@/components/HeroCarousel";
import DisciplineCard from "@/components/DisciplineCard";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import PartnersSection from "@/components/PartnersSection";
import { getUpcomingEvents, getRecurringEvents } from "@/lib/queries/events";
import { getAllBlogPosts } from "@/lib/queries/blog";
import { getSiteSettings } from "@/lib/queries/settings";
import { urlFor } from "@/lib/sanity";
import { BLOG_CATEGORY_LABELS, EVENT_DIFFICULTY_LABELS } from "@/lib/labels";
import type { SanityEvent } from "@/lib/queries/events";
import type { BlogPostSummary } from "@/lib/queries/blog";
import type { Partner, SiteSettings } from "@/lib/queries/settings";

export const revalidate = 3600;

const DISCIPLINES = [
  { title: "Havpadling", emoji: "🌊", href: "/padling/hav" },
  { title: "Elvepadling", emoji: "🏔️", href: "/padling/elv" },
  { title: "Flattvann", emoji: "🏅", href: "/padling/flattvann" },
  { title: "Surfski", emoji: "⚡", href: "/padling/surfski" },
  { title: "Kajakkpolo", emoji: "🏐", href: "/padling/polo" },
  { title: "Junior", emoji: "🌱", href: "/padling/junior" },
];

const DEFAULT_STATS = ["~500 medlemmer", "To baser", "Utstyr inkludert", "Seks disipliner"];

// Brukes til forsiden er satt opp med bilder i Sanity, og som sikkerhetsnett
// dersom innholdet ikke kan hentes.
const FALLBACK_SLIDE: HeroSlideView = {
  imageSrc: "/images/hav.jpg",
  imageAlt: "Havpadling på Trondhjemsfjorden",
  title: "Padleglede i Trondheim",
  subtitle: "Trondhjems Kajakklubb — et aktivt fellesskap for alle nivåer siden 1932",
  buttons: [
    { label: "Bli medlem", href: "/medlemskap" },
    { label: "Se aktiviteter", href: "/aktiviteter" },
    { label: "Kurs", href: "/padling/kurs" },
  ],
};

function toHeroSlides(settings: SiteSettings | null): HeroSlideView[] {
  const slides = (settings?.heroSlides ?? []).flatMap<HeroSlideView>((slide) => {
    if (!slide.image?.asset || !slide.title) return [];
    return [
      {
        imageSrc: urlFor(slide.image).width(1920).height(1080).url(),
        imageAlt: slide.image.alt ?? slide.title,
        title: slide.title,
        subtitle: slide.subtitle,
        buttons: slide.buttons,
      },
    ];
  });
  return slides.length > 0 ? slides : [FALLBACK_SLIDE];
}

export default async function HomePage() {
  const [events, posts, recurringEvents, settings] = await Promise.all([
    getUpcomingEvents(),
    getAllBlogPosts(),
    getRecurringEvents(),
    getSiteSettings(),
  ]);

  const stats = settings?.stats?.map((s) => s.label.no) ?? [];

  return (
    <HomeContent
      slides={toHeroSlides(settings)}
      events={events.slice(0, 3)}
      posts={posts.slice(0, 3)}
      recurringEvents={recurringEvents}
      partners={settings?.partners ?? []}
      stats={stats.length > 0 ? stats : DEFAULT_STATS}
    />
  );
}

function HomeContent({
  slides,
  events,
  posts,
  recurringEvents,
  partners,
  stats,
}: {
  slides: HeroSlideView[];
  events: SanityEvent[];
  posts: BlogPostSummary[];
  recurringEvents: SanityEvent[];
  partners: Partner[];
  stats: string[];
}) {
  return (
    <>
      <HeroCarousel slides={slides} />

      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="text-sm font-semibold text-white/80">
              <span className="text-tkk-blue">✓</span> {stat}
            </div>
          ))}
        </div>
      </div>

      {/* 1. Siste innlegg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display font-bold text-navy text-3xl mb-8">Siste innlegg</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                readMoreLabel="Les mer"
                byLabel="Av"
                categoryLabels={BLOG_CATEGORY_LABELS}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate">Ingen blogginnlegg ennå.</p>
        )}
        <div className="mt-8">
          <Link
            href="/blogg"
            className="inline-block border border-navy text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Se alle innlegg →
          </Link>
        </div>
      </section>

      {/* 2. Kommende aktiviteter */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-navy text-3xl mb-8">Kommende aktiviteter</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <EventCard key={e._id} event={e} labels={EVENT_DIFFICULTY_LABELS} />
              ))}
            </div>
          ) : (
            <p className="text-slate">Ingen kommende arrangementer.</p>
          )}
          <div className="mt-8">
            <Link
              href="/aktiviteter"
              className="inline-block border border-navy text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
            >
              Se alle aktiviteter →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Faste turer og trening */}
      {recurringEvents.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy text-3xl mb-8">Faste turer og trening</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recurringEvents.map((re) => (
                <EventCard key={re._id} event={re} labels={EVENT_DIFFICULTY_LABELS} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Hva vil du padle? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display font-bold text-navy text-3xl mb-8">Hva vil du padle?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISCIPLINES.map(({ title, emoji, href }) => (
            <DisciplineCard key={href} title={title} href={href} emoji={emoji} readMore="Les mer" />
          ))}
        </div>
      </section>

      {/* 5. Resten */}
      <PartnersSection partners={partners} />

      <section className="bg-tkk-blue py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-navy text-3xl mb-4">Bli en del av fellesskapet</h2>
          <p className="text-navy/80 text-lg leading-relaxed mb-8">
            For kr 800 i året får du tilgang til utstyr, turer, kurs og et aktivt sosialt miljø i en av
            Norges største kajakklubbber.
          </p>
          <Link
            href="/medlemskap"
            className="inline-block bg-navy text-white font-semibold px-8 py-3 rounded hover:bg-teal transition-colors"
          >
            Les mer om medlemskap
          </Link>
        </div>
      </section>
    </>
  );
}
