import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person / kontakt",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Navn", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "role",
      title: "Rolle",
      type: "object",
      fields: [
        defineField({ name: "no", title: "Norsk", type: "string", validation: (r) => r.required() }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),
    defineField({
      name: "group",
      title: "Gruppe",
      type: "string",
      options: {
        list: [
          { title: "Styre", value: "board" },
          { title: "Gruppeledere", value: "leaders" },
          { title: "Andre", value: "others" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "sortOrder", title: "Sorteringsrekkefølge", type: "number", initialValue: 10 }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-post", type: "string", validation: (r) => r.required() }),
  ],
  orderings: [
    { title: "Gruppe + rekkefølge", name: "groupOrder", by: [{ field: "group", direction: "asc" }, { field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role.no" },
  },
});
