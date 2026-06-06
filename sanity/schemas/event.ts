import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Aktivitet / arrangement",
  type: "document",
  fields: [
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
      name: "description",
      title: "Beskrivelse",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 4 }),
        defineField({ name: "en", title: "English", type: "text", rows: 4 }),
      ],
    }),
    defineField({ name: "date", title: "Startdato", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "Sluttdato (valgfritt)", type: "datetime" }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Tur", value: "tur" },
          { title: "Kurs", value: "kurs" },
          { title: "Sosialt", value: "sosial" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "discipline",
      title: "Disiplin",
      type: "string",
      options: {
        list: [
          { title: "Havpadling", value: "hav" },
          { title: "Elvepadling", value: "elv" },
          { title: "Flattvann", value: "flattvann" },
          { title: "Surfski", value: "surfski" },
          { title: "Kajakkpolo", value: "polo" },
          { title: "Junior", value: "junior" },
          { title: "Alle", value: "alle" },
        ],
      },
    }),
    defineField({
      name: "difficulty",
      title: "Vanskelighetsgrad",
      type: "string",
      options: {
        list: [
          { title: "Nybegynner", value: "nybegynner" },
          { title: "Middels", value: "middels" },
          { title: "Erfaren", value: "erfaren" },
        ],
      },
    }),
    defineField({ name: "registerUrl", title: "Påmeldingslenke", type: "url" }),
  ],
  orderings: [{ title: "Dato (stigende)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] }],
  preview: {
    select: { title: "title.no", subtitle: "date" },
    prepare({ title, subtitle }) {
      const dateStr = subtitle ? new Date(subtitle).toLocaleDateString("no-NO") : "";
      return { title: title ?? "Uten tittel", subtitle: dateStr };
    },
  },
});
