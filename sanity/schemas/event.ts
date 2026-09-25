import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { DISCIPLINES } from "./objects/disciplines";

export const event = defineType({
  name: "event",
  title: "Aktivitet / arrangement",
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
      name: "isRecurring",
      title: "Gjentakende aktivitet?",
      description: "Av = engangshendelse (bruker dato). På = gjentakende (bruker ukedag/klokkeslett).",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Startdato",
      type: "datetime",
      hidden: ({ parent }) => (parent as { isRecurring?: boolean } | undefined)?.isRecurring === true,
      validation: (r) =>
        r.custom((val, ctx) => {
          const parent = ctx.parent as { isRecurring?: boolean } | undefined;
          if (parent?.isRecurring) return true;
          return val ? true : "Startdato er påkrevd for engangshendelser";
        }),
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato (valgfritt)",
      type: "datetime",
      hidden: ({ parent }) => (parent as { isRecurring?: boolean } | undefined)?.isRecurring === true,
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
      hidden: ({ parent }) => (parent as { isRecurring?: boolean } | undefined)?.isRecurring !== true,
      validation: (r) =>
        r.custom((val, ctx) => {
          const parent = ctx.parent as { isRecurring?: boolean } | undefined;
          if (!parent?.isRecurring) return true;
          return val ? true : "Ukedag er påkrevd for gjentakende aktiviteter";
        }),
    }),
    defineField({
      name: "time",
      title: "Klokkeslett",
      type: "string",
      description: "F.eks. 18:00",
      hidden: ({ parent }) => (parent as { isRecurring?: boolean } | undefined)?.isRecurring !== true,
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
        list: [
          { title: "Tur", value: "tur" },
          { title: "Kurs", value: "kurs" },
          { title: "Sosialt", value: "sosial" },
        ],
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
    defineField({ name: "registerUrl", title: "Påmeldingslenke", type: "url" }),
    defineField({
      name: "sortOrder",
      title: "Sorteringsrekkefølge (for gjentakende)",
      type: "number",
    }),
    defineField({
      name: "cancelled",
      title: "Avlyst",
      description: "Settes automatisk når en importert aktivitet ikke lenger finnes på iSonen, eller manuelt for andre aktiviteter.",
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
      description: "iSonen sin egen ID for arrangementet — brukes til å koble sammen ved daglig synkronisering.",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => !(document as { externalSource?: string } | undefined)?.externalSource,
    }),
  ],
  orderings: [{ title: "Dato (stigende)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] }],
  preview: {
    select: { title: "title.no", subtitle: "date", dayOfWeek: "dayOfWeek", isRecurring: "isRecurring" },
    prepare({ title, subtitle, dayOfWeek, isRecurring }: { title?: string; subtitle?: string; dayOfWeek?: string; isRecurring?: boolean }) {
      const sub = isRecurring ? dayOfWeek : subtitle ? new Date(subtitle).toLocaleDateString("no-NO") : "";
      return { title: title ?? "Uten tittel", subtitle: sub };
    },
  },
});
