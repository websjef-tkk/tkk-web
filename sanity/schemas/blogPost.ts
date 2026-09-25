import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { DISCIPLINES } from "./objects/disciplines";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blogginnlegg",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publiseringsdato",
      type: "date",
      validation: (r) => r.required(),
    }),
    noString("title", "Tittel", { required: true }),
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
    defineField({ name: "author", title: "Forfatter", type: "string" }),
    defineField({
      name: "image",
      title: "Bilde",
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
