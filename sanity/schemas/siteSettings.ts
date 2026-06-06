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
  ],
  preview: {
    prepare() {
      return { title: "Nettstedinnstillinger" };
    },
  },
});
