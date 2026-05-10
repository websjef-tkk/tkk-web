import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  overlay?: "dark" | "navy";
  size?: "large" | "medium";
};

export default function HeroSection({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  cta,
  ctaSecondary,
  overlay = "navy",
  size = "large",
}: Props) {
  const height = size === "large" ? "h-[520px] md:h-[640px]" : "h-[320px] md:h-[420px]";

  return (
    <section className={`relative ${height} flex items-center overflow-hidden`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div
        className={`absolute inset-0 ${
          overlay === "navy" ? "bg-navy/75" : "bg-black/65"
        }`}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="font-display text-white text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/80 text-lg md:text-xl max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {(cta || ctaSecondary) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {cta && (
              <Link
                href={cta.href}
                className="bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-white transition-colors text-sm"
              >
                {cta.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="border border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-navy transition-colors text-sm"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
