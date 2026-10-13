import { DISCIPLINES } from "./disciplines";
import { EVENT_CATEGORIES } from "./eventCategories";

// Den faste listen over merkelapper for bilder i mediebiblioteket ("Media" i
// Studio). Følger grenene og aktivitetskategoriene, pluss to klubb-emner.
// Merkelappene opprettes i Sanity av sanity/seed-image-tags.ts, og kravet om
// at bilder skal ha merkelapp ligger i sanity/imageTagCheck.tsx.
export const IMAGE_TAGS: string[] = [
  ...DISCIPLINES.map((d) => d.short),
  ...EVENT_CATEGORIES.map((c) => c.title),
  "Klubb",
  "HMS",
];
