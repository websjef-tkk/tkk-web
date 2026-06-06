import { defineField, defineType } from "sanity";

export const disciplinePage = defineType({
  name: "disciplinePage",
  title: "Disiplinside",
  type: "document",
  fields: [
    defineField({
      name: "discipline",
      title: "Disiplin (nøkkel)",
      type: "string",
      options: {
        list: [
          { title: "Havpadling", value: "hav" },
          { title: "Elvepadling", value: "elv" },
          { title: "Flattvann", value: "flattvann" },
          { title: "Surfski", value: "surfski" },
          { title: "Kajakkpolo", value: "polo" },
          { title: "Junior", value: "junior" },
          { title: "Roing", value: "roing" },
        ],
      },
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
      name: "tagline",
      title: "Tagline",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "intro",
      title: "Ingress",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 4 }),
        defineField({ name: "en", title: "English", type: "text", rows: 4 }),
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
      name: "heroImage",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "discipline" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Uten tittel", subtitle };
    },
  },
});
