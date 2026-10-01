import { defineField } from "sanity";

export const embedObject = {
  type: "object" as const,
  name: "embed",
  title: "Iframe-innbygging",
  fields: [
    defineField({
      name: "url",
      title: "Nettadresse (embed-URL)",
      type: "url",
      description:
        'Adressen som lastes inn i embeddingen. For YouTube og Vimeo kan du lime inn en vanlig video-lenke (f.eks. youtube.com/watch?v=... eller vimeo.com/...) — den gjøres automatisk om til riktig embed-format. For Google Maps, bookingsystemer og andre tjenester må du bruke selve "embed"-/iframe-adressen tjenesten oppgir (ofte under "Del" → "Bygg inn"/"Embed"), ikke den vanlige nettsideadressen — mange vanlige nettsider tillater ikke å bli vist i en iframe.',
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ["https"], allowRelative: false })
          .error("Må være en gyldig https-nettadresse"),
    }),
    defineField({
      name: "title",
      title: "Tittel (for skjermlesere)",
      type: "string",
      description:
        "Kort beskrivelse av innholdet, f.eks. «Kart over klubbhuset» eller «Produktvideo». Vises ikke synlig på siden, men er påkrevd for tilgjengelighet.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "aspectRatio",
      title: "Størrelsesforhold",
      type: "string",
      options: {
        list: [
          { title: "Liggende video (16:9)", value: "16:9" },
          { title: "Liggende (4:3)", value: "4:3" },
          { title: "Kvadratisk (1:1)", value: "1:1" },
          { title: "Stående (9:16)", value: "9:16" },
          { title: "Egendefinert høyde", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "16:9",
    }),
    defineField({
      name: "height",
      title: "Høyde (piksler)",
      type: "number",
      description: "Brukes kun når «Egendefinert høyde» er valgt over.",
      hidden: ({ parent }) => (parent as { aspectRatio?: string } | undefined)?.aspectRatio !== "custom",
      validation: (r) =>
        r.custom((val, ctx) => {
          const parent = ctx.parent as { aspectRatio?: string } | undefined;
          if (parent?.aspectRatio !== "custom") return true;
          if (typeof val !== "number") return "Høyde er påkrevd når «Egendefinert høyde» er valgt";
          return val > 0 ? true : "Må være et positivt tall";
        }),
    }),
    defineField({
      name: "allowFullscreen",
      title: "Tillat fullskjerm",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "caption",
      title: "Bildetekst",
      type: "string",
      description: "Valgfri tekst som vises under embeddingen.",
    }),
  ],
  preview: {
    select: { title: "title", url: "url" },
    prepare({ title, url }: { title?: string; url?: string }) {
      return { title: title || "Iframe-innbygging", subtitle: url };
    },
  },
};
