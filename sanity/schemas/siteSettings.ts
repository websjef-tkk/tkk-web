import { defineField, defineType } from "sanity";
import { noString } from "./objects/localized";
import { createLinkFields } from "./objects/link";

const heroButton = {
  type: "object" as const,
  name: "heroButton",
  title: "Knapp",
  fields: [
    defineField({ name: "label", title: "Tekst", type: "string", validation: (r) => r.required() }),
    ...createLinkFields({ allowPdf: false, includeNewTab: false }),
  ],
  preview: {
    select: { title: "label", subtitle: "href", linkType: "linkType", pageTitle: "page.title.no" },
    prepare({
      title,
      subtitle,
      linkType,
      pageTitle,
    }: {
      title?: string;
      subtitle?: string;
      linkType?: string;
      pageTitle?: string;
    }) {
      return { title, subtitle: linkType === "page" ? (pageTitle ?? "Side") : subtitle };
    },
  },
};

const heroSlide = {
  type: "object" as const,
  name: "heroSlide",
  title: "Forsidebilde",
  fields: [
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [
        defineField({ name: "alt", title: "Alt-tekst", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({ name: "title", title: "Overskrift", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "subtitle",
      title: "Undertekst",
      description: "Den mindre linjen under overskriften.",
      type: "string",
    }),
    defineField({
      name: "buttons",
      title: "Knapper",
      type: "array",
      of: [heroButton],
      validation: (r) => r.max(3).warning("Flere enn 3 knapper blir trangt på mobil"),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
};

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nettstedinnstillinger",
  type: "document",
  // @ts-expect-error — singleton action list is not in the public type but works at runtime
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroSlides",
      title: "Forsidekarusell",
      description:
        "Bildene øverst på forsiden. Besøkende bytter mellom dem med strekene nederst i bildet. Med bare ett bilde vises ingen streker.",
      type: "array",
      of: [heroSlide],
      validation: (r) => r.max(4).warning("Flere enn 2 bilder blir fort mye på forsiden"),
    }),
    noString("footerText", "Bunntekst-tagline"),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "visitingAddress", title: "Besøksadresse", type: "text", rows: 2 }),
    defineField({ name: "postalAddress", title: "Postadresse", type: "text", rows: 2 }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "orgNr", title: "Org.nr.", type: "string" }),
    defineField({
      name: "stats",
      title: "Jumbo-statistikk (forside)",
      description: "Punktene som vises i den mørke stripen øverst på forsiden.",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [noString("label", "Tekst", { required: true })],
          preview: {
            select: { title: "label.no" },
          },
        },
      ],
      validation: (r) => r.max(4).warning("Mer enn 4 punkter kan se trangt ut i stripen"),
    }),
    defineField({
      name: "partners",
      title: "Samarbeidspartnere",
      description: "Logoene nederst på forsiden. Alle logoene lenker til siden om medlemsfordeler.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            noString("description", "Beskrivelse"),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Nettstedinnstillinger" };
    },
  },
});
