import { defineField } from "sanity";
import { noString, noText } from "./localized";

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  description:
    "Valgfritt. Brukes i <title>/<meta description> i stedet for tittel/ingress. Se Googles veiledning for gode søkeresultat-snutter: https://developers.google.com/search/docs/appearance/snippet",
  options: { collapsible: true, collapsed: true },
  fields: [
    noString("metaTitle", "Meta-tittel", {
      maxWarning: { limit: 60, message: "Anbefalt maks 60 tegn — lengre titler kan bli kuttet i søkeresultater" },
    }),
    noText("metaDescription", "Meta-beskrivelse", {
      rows: 3,
      maxWarning: { limit: 160, message: "Anbefalt maks 160 tegn — lengre tekst blir ofte kuttet i søkeresultater" },
    }),
    defineField({
      name: "ogImage",
      title: "Delingsbilde (Open Graph)",
      description: "Vises når siden deles i sosiale medier. Faller tilbake til artikkel-/hero-bildet om tom.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
