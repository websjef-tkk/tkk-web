import { sanityClient } from "../sanity";

export interface Partner {
  name?: string;
  description?: { no?: string };
  logo?: { asset: { _ref: string } };
}

export interface HeroButton {
  label: string;
  linkType?: "page" | "url";
  page?: { _type?: string; slug?: string; discipline?: string } | null;
  href?: string;
}

export interface HeroSlide {
  image?: { asset: { _ref: string }; alt?: string };
  title?: string;
  subtitle?: string;
  buttons?: HeroButton[];
}

export interface SiteSettings {
  heroSlides?: HeroSlide[];
  footerText?: { no: string };
  instagram?: string;
  facebook?: string;
  visitingAddress?: string;
  postalAddress?: string;
  phone?: string;
  orgNr?: string;
  stats?: { label: { no: string } }[];
  partners?: Partner[];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "siteSettings"][0] {
        heroSlides[] { image, title, subtitle, buttons[] { label, linkType, page->{ _type, "slug": slug.current, discipline }, href } },
        footerText,
        instagram,
        facebook,
        visitingAddress,
        postalAddress,
        phone,
        orgNr,
        stats[] { label },
        partners[] { name, description, logo }
      }`
    );
  } catch {
    return null;
  }
}
