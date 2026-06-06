import { defineField, defineType } from "sanity";

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
    defineField({
      name: "title",
      title: "Tittel",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string", validation: (r) => r.required() }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "summary",
      title: "Sammendrag",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Tur", value: "tur" },
          { title: "Info", value: "info" },
          { title: "Klubb", value: "klubb" },
          { title: "Sosialt", value: "sosial" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", title: "Forfatter", type: "string" }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
  ],
  orderings: [{ title: "Nyeste først", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title.no", subtitle: "publishedAt", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title ?? "Uten tittel", subtitle, media };
    },
  },
});
