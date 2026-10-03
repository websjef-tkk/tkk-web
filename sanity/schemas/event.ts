import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { DISCIPLINES } from "./objects/disciplines";
import { EVENT_CATEGORIES } from "./objects/eventCategories";

export const event = defineType({
  name: "event",
  title: "Aktivitet",
  type: "document",
  fields: [
    noString("title", "Tittel", { required: true }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.no" },
      validation: (r) => r.required(),
    }),
    noText("description", "Beskrivelse"),
    noBody("body", "Utfyllende innhold (hvordan delta)"),
    defineField({
      name: "date",
      title: "Startdato",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato (valgfritt)",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Møteplass",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: EVENT_CATEGORIES,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "disciplines",
      title: "Grener",
      description: "Vises som merkelapp(er) på aktivitetskortene. La stå tom hvis aktiviteten gjelder alle grener.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: DISCIPLINES,
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
    defineField({
      name: "image",
      title: "Bilde",
      description: "Hentes fra iSonen når aktiviteten importeres, men kan byttes ut her.",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
    defineField({ name: "registerUrl", title: "Påmeldingslenke", type: "url" }),
    defineField({
      name: "cancelled",
      title: "Avlyst",
      description: "Settes automatisk for importerte aktiviteter når de avlyses (\"AVLYST\" i tittelen) eller fjernes fra iSonen. Settes manuelt for andre aktiviteter.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "externalSource",
      title: "Kilde (automatisk import)",
      description: "Settes til \"isonen\" for aktiviteter importert automatisk fra iSonen. Tom for manuelt opprettede aktiviteter.",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => !(document as { externalSource?: string } | undefined)?.externalSource,
    }),
    defineField({
      name: "externalId",
      title: "Ekstern ID (iSonen)",
      description: "iSonen sin egen ID for arrangementet — brukes til å koble sammen ved synkronisering hver time.",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => !(document as { externalSource?: string } | undefined)?.externalSource,
    }),
  ],
  orderings: [{ title: "Dato (stigende)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] }],
  preview: {
    select: { title: "title.no", subtitle: "date", media: "image" },
    prepare({ title, subtitle, media }) {
      const sub = subtitle ? new Date(subtitle).toLocaleDateString("no-NO") : "";
      return { title: title ?? "Uten tittel", subtitle: sub, media };
    },
  },
});
