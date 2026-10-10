"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlideView = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  buttons?: { label: string; href: string }[];
};

const AUTOPLAY_MS = 5000;

export default function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  // Øker når et bytte hoppes over, så timeren starter på nytt.
  const [retry, setRetry] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const count = slides.length;

  const goTo = (i: number) => setActive(((i % count) + count) % count);

  // Bytt til neste bilde etter en stund. Avhenger av `active`, så tiden starter
  // på nytt når noen bytter bilde selv. Står stille mens musen er over
  // karusellen, mens tastaturfokus er i den, og for brukere som har bedt om
  // mindre bevegelse.
  useEffect(() => {
    if (count < 2 || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => {
      const focused = document.activeElement;
      if (focused && sectionRef.current?.contains(focused) && focused.matches(":focus-visible")) {
        setRetry((r) => r + 1);
        return;
      }
      setActive((a) => (a + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, hovered, retry, count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      // Bare ekte mus: på berøringsskjerm kommer det aldri noen «leave».
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      className="relative h-[520px] md:h-[640px] flex items-center overflow-hidden"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
          {/* Slør bare der teksten ligger (venstre side) — resten av bildet vises klart. */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/65 via-navy/35 to-navy/10" />
        </div>
      ))}

      {/* Ekstra sidepadding gir plass til pilene. */}
      <div className="relative z-10 max-w-7xl mx-auto px-16 md:px-20 w-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={i === active ? "block" : "hidden"}
            aria-hidden={i !== active}
          >
            <h1 className="font-display text-white text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-4 text-white/80 text-lg md:text-xl max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>
            )}
            {slide.buttons && slide.buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {slide.buttons.map((button, j) => (
                  <Link
                    key={j}
                    href={button.href}
                    className={
                      j === 0
                        ? "bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-white transition-colors text-sm"
                        : "border border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-navy transition-colors text-sm"
                    }
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <ArrowButton direction="prev" onClick={() => goTo(active - 1)} />
          <ArrowButton direction="next" onClick={() => goTo(active + 1)} />

          <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center gap-2">
            {slides.map((slide, i) => {
              const thumbnail = (
                <Image src={slide.imageSrc} alt="" fill sizes="96px" className="object-cover" />
              );
              const box = "relative block w-16 h-10 md:w-24 md:h-14 overflow-hidden rounded";
              // Det aktive bildet er ingen knapp, så det kan verken trykkes på eller tabbes til.
              return i === active ? (
                <div key={i} aria-current="true" className={`${box} ring-2 ring-white`}>
                  {thumbnail}
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Vis «${slide.title}»`}
                  className={`${box} opacity-60 ring-1 ring-white/0 transition hover:opacity-100 hover:ring-white/70 focus-visible:opacity-100 focus-visible:ring-white`}
                >
                  {thumbnail}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Forrige bilde" : "Neste bilde"}
      className={`absolute top-1/2 -translate-y-1/2 z-20 ${
        isPrev ? "left-2 md:left-4" : "right-2 md:right-4"
      } flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-navy/50 text-white transition-colors hover:bg-navy/80 focus-visible:bg-navy/80`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 md:h-6 md:w-6"
      >
        <path d={isPrev ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
