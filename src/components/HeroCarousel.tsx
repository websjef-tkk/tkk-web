"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlideView = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  buttons?: { label: string; href: string }[];
};

export default function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const [active, setActive] = useState(0);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[520px] md:h-[640px] flex items-center overflow-hidden">
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
          {/* Mørkt slør slik at teksten er lesbar — lettere enn før, så bildet slipper mer til. */}
          <div className="absolute inset-0 bg-navy/60" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

      {slides.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Vis «${slide.title}»`}
              aria-current={i === active}
              className="group px-1.5 py-4"
            >
              {/* Knappen har en romslig trykkflate, men vises som en tynn strek. */}
              <span
                className={`block h-1 w-10 rounded-full transition-colors ${
                  i === active ? "bg-white" : "bg-white/40 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
