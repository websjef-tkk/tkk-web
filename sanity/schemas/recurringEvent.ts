import { defineField, defineType } from "sanity";

export const recurringEvent = defineType({
  name: "recurringEvent",
  title: "Fast tur / trening",
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
      name: "dayOfWeek",
      title: "Ukedag",
      type: "string",
      options: {
        list: [
          { title: "Mandag", value: "monday" },
          { title: "Tirsdag", value: "tuesday" },
          { title: "Onsdag", value: "wednesday" },
          { title: "Torsdag", value: "thursday" },
          { title: "Fredag", value: "friday" },
          { title: "Lørdag", value: "saturday" },
          { title: "Søndag", value: "sunday" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "time",
      title: "Klokkeslett",
      type: "string",
      description: "F.eks. 18:00",
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
        ],
      },
    }),
    defineField({
      name: "location",
      title: "Møteplass",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "text", rows: 3 }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "sortOrder",
      title: "Sorteringsrekkefølge",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "dayOfWeek" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? "Fast tur", subtitle };
    },
  },
});
