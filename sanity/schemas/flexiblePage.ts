import { defineField, defineType } from "sanity";

export const flexiblePage = defineType({
  name: "flexiblePage",
  title: "Fleksibel side",
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Side-ID (nøkkel)",
      type: "string",
      options: {
        list: [
          { title: "HMS – Generelt", value: "hms-generelt" },
          { title: "HMS – Havpadling", value: "hms-hav" },
          { title: "HMS – Elvepadling", value: "hms-elv" },
          { title: "HMS – Mitt varsel", value: "hms-mitt-varsel" },
          { title: "HMS – Hendelsesrapporter", value: "hms-hendelsesrapporter" },
          { title: "HMS – Politiattest", value: "hms-politiattest" },
          { title: "Klubben – Administrasjon", value: "klubben-administrasjon" },
          { title: "Klubben – Klubbhus", value: "klubben-klubbhus" },
          { title: "Klubben – Sosialgruppe", value: "klubben-sosialgruppe" },
          { title: "Klubben – Støtteordninger", value: "klubben-stotteordninger" },
          { title: "Klubben – Refusjon", value: "klubben-refusjon" },
          { title: "Medlemskap", value: "medlemskap" },
          { title: "HMS – Oversikt", value: "hms" },
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
      name: "intro",
      title: "Ingress",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 4 }),
        defineField({ name: "en", title: "English", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Seksjoner",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Seksjonstittel",
              type: "object",
              fields: [
                defineField({ name: "no", title: "Norsk", type: "string" }),
                defineField({ name: "en", title: "English", type: "string" }),
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
          ],
          preview: {
            select: { title: "title.no" },
            prepare({ title }) {
              return { title: title ?? "Seksjon" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "pageId" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Uten tittel", subtitle };
    },
  },
});
