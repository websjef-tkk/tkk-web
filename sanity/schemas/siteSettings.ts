import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nettstedinnstillinger",
  type: "document",
  // @ts-expect-error — singleton action list is not in the public type but works at runtime
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Forsideoverskrift",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "heroSubtitle",
      title: "Forsideundertittel",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Bunntekst-tagline",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "visitingAddress", title: "Besøksadresse", type: "text", rows: 2 }),
    defineField({ name: "postalAddress", title: "Postadresse", type: "text", rows: 2 }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "orgNr", title: "Org.nr.", type: "string" }),
    defineField({
      name: "stats",
      title: "Jumbo-statistikk (forside)",
      description: "Punktene som vises i den mørke stripen øverst på forsiden.",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "label",
              title: "Tekst",
              type: "object",
              fields: [
                defineField({ name: "no", title: "Norsk", type: "string", validation: (r) => r.required() }),
                defineField({ name: "en", title: "English", type: "string" }),
              ],
            }),
          ],
          preview: {
            select: { title: "label.no" },
          },
        },
      ],
      validation: (r) => r.max(4).warning("Mer enn 4 punkter kan se trangt ut i stripen"),
    }),
    defineField({
      name: "partners",
      title: "Samarbeidspartnere",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "url", title: "Nettside", type: "url" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            defineField({
              name: "description",
              title: "Beskrivelse",
              type: "object",
              fields: [
                defineField({ name: "no", title: "Norsk", type: "string" }),
                defineField({ name: "en", title: "English", type: "string" }),
              ],
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "url" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? "Partner", subtitle };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Nettstedinnstillinger" };
    },
  },
});
