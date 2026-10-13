import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { DISCIPLINES } from "./objects/disciplines";
import { AUTO_SLUG_MAX_LENGTH, AutoSlugInput, slugFromTitle } from "../components/AutoSlugInput";
import { compactSlugField } from "../components/CompactSlugField";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blogginnlegg",
  type: "document",
  fields: [
    noString("title", "Tittel", { required: true }),
    defineField({
      name: "slug",
      title: "Adresse (URL)",
      type: "slug",
      components: { field: compactSlugField("/blogg/"), input: AutoSlugInput },
      options: { source: "title.no", maxLength: AUTO_SLUG_MAX_LENGTH, slugify: slugFromTitle },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publiseringsdato",
      type: "date",
      options: { dateFormat: "DD.MM.YYYY" },
      // Dagens dato i lokal tid, på formen ÅÅÅÅ-MM-DD.
      initialValue: () => new Date().toLocaleDateString("sv-SE"),
      validation: (r) => r.required(),
    }),
    noText("summary", "Sammendrag", { rows: 3, required: true }),
    noBody("body", "Innhold"),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Tur", value: "tur" },
          { title: "Turrapport", value: "turrapport" },
          { title: "Info", value: "info" },
          { title: "Klubb", value: "klubb" },
          { title: "Sosialt", value: "sosial" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "disciplines",
      title: "Grener",
      description: "Hvilke grener saken gjelder. La stå tom for generelt innhold som ikke er knyttet til én bestemt gren.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: DISCIPLINES,
      },
    }),
    defineField({ name: "author", title: "Forfatter", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Fremsidebilde",
      description: "Vises på nyhetskortet og øverst i saken.",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string", validation: (r) => r.required() })],
    }),
    seoField,
  ],
  orderings: [{ title: "Nyeste først", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title.no", subtitle: "publishedAt", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title ?? "Uten tittel", subtitle, media };
    },
  },
});
