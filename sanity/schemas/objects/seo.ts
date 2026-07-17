import { defineField } from "sanity";

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  description:
    "Valgfritt. Brukes i <title>/<meta description> i stedet for tittel/ingress. Se Googles veiledning for gode søkeresultat-snutter: https://developers.google.com/search/docs/appearance/snippet",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta-tittel",
      type: "object",
      fields: [
        defineField({
          name: "no",
          title: "Norsk",
          type: "string",
          validation: (r) => r.max(60).warning("Anbefalt maks 60 tegn — lengre titler kan bli kuttet i søkeresultater"),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (r) => r.max(60).warning("Recommended max 60 characters — longer titles may get truncated in search results"),
        }),
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta-beskrivelse",
      type: "object",
      fields: [
        defineField({
          name: "no",
          title: "Norsk",
          type: "text",
          rows: 3,
          validation: (r) => r.max(160).warning("Anbefalt maks 160 tegn — lengre tekst blir ofte kuttet i søkeresultater"),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "text",
          rows: 3,
          validation: (r) => r.max(160).warning("Recommended max 160 characters — longer text is often truncated in search results"),
        }),
      ],
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
