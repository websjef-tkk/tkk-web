import { defineField, defineType } from "sanity";
import { bodyBlockOf } from "./objects/blockContent";
import { seoField } from "./objects/seo";

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
          { title: "Pirbadet", value: "pirbadet" },
        ],
      },
      validation: (r) =>
        r.required().custom(async (value, ctx) => {
          if (!value) return true;
          const client = ctx.getClient({ apiVersion: "2024-01-01" });
          const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
          const other = await client.fetch(
            `count(*[_type == "disciplinePage" && discipline == $value && !(_id in [$id, "drafts." + $id])])`,
            { value, id }
          );
          return other === 0 ? true : "Denne disiplinen er allerede i bruk av en annen side";
        }),
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
        defineField({
          name: "no",
          title: "Norsk",
          type: "array",
          of: bodyBlockOf("no"),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: bodyBlockOf("en"),
        }),
      ],
    }),
    defineField({
      name: "subPageLinks",
      title: "Undersider",
      description: "Lenker til undersider som vises som kort-grid nederst på siden",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Tittel",
              type: "object",
              fields: [
                defineField({ name: "no", title: "Norsk", type: "string" }),
                defineField({ name: "en", title: "English", type: "string" }),
              ],
            }),
            defineField({
              name: "href",
              title: "Lenke (relativ sti)",
              type: "string",
              description: "F.eks. /padling/hav/reolplasser",
            }),
          ],
          preview: {
            select: { title: "title.no", subtitle: "href" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? "Underside", subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string", validation: (r) => r.required() })],
    }),
    seoField,
  ],
  preview: {
    select: { title: "title.no", subtitle: "discipline" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? "Uten tittel", subtitle };
    },
  },
});
