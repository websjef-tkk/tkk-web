import { defineField } from "sanity";

const MAX_PDF_BYTES = 20 * 1024 * 1024;

type LinkType = "page" | "url" | "pdf";
type LinkParent = { linkType?: LinkType } | undefined;

type LinkFieldsOptions = {
  /** Lar redaktøren i tillegg velge å lenke til en opplastet PDF-fil. */
  allowPdf?: boolean;
  /** Legger til et "Åpne i ny fane"-valg. */
  includeNewTab?: boolean;
};

/**
 * Felles feltsett for "lenke til en side på nettstedet, eller en ekstern
 * adresse" — brukt både av forsidekarusellens knapper og av lenke-annotasjonen
 * i brødtekst, slik at redaktøren kan søke frem en side i stedet for å skrive
 * inn stien for hånd.
 */
export function createLinkFields({ allowPdf = false, includeNewTab = false }: LinkFieldsOptions = {}) {
  return [
    defineField({
      name: "linkType",
      title: "Type lenke",
      type: "string",
      options: {
        list: [
          { title: "Side på nettstedet", value: "page" },
          { title: "Ekstern lenke", value: "url" },
          ...(allowPdf ? [{ title: "PDF-fil", value: "pdf" }] : []),
        ],
        layout: "radio",
      },
      initialValue: "page",
    }),
    defineField({
      name: "page",
      title: "Side",
      type: "reference",
      to: [{ type: "flexiblePage" }, { type: "disciplinePage" }, { type: "blogPost" }, { type: "event" }],
      hidden: ({ parent }) => (parent as LinkParent)?.linkType !== "page",
      validation: (r) =>
        r.custom((val, ctx) => {
          const parent = ctx.parent as LinkParent;
          if (parent?.linkType !== "page") return true;
          return val ? true : "Velg en side";
        }),
    }),
    defineField({
      name: "href",
      title: "Nettadresse",
      type: "string",
      description: 'F.eks. "tkk.no" eller "vg.no" — "https://" legges til automatisk om du utelater det.',
      hidden: ({ parent }) => (parent as LinkParent)?.linkType !== "url",
      validation: (r) =>
        r.custom((val: string | undefined, ctx) => {
          const parent = ctx.parent as LinkParent;
          if (parent?.linkType !== "url") return true;
          if (!val) return "Nettadresse er påkrevd";
          return /\s/.test(val) ? "Nettadressen kan ikke inneholde mellomrom" : true;
        }),
    }),
    ...(allowPdf
      ? [
          defineField({
            name: "pdfFile",
            type: "file",
            title: "PDF-fil",
            description: "Maks 20 MB.",
            options: { accept: "application/pdf" },
            hidden: ({ parent }) => (parent as LinkParent)?.linkType !== "pdf",
            validation: (r) =>
              r.custom(async (file, ctx) => {
                const parent = ctx.parent as LinkParent;
                if (parent?.linkType !== "pdf") return true;
                const asset = (file as { asset?: { _ref?: string } } | undefined)?.asset;
                if (!asset?._ref) return "PDF-fil er påkrevd";
                const client = ctx.getClient({ apiVersion: "2024-01-01" });
                const doc = await client.fetch<{ size?: number; mimeType?: string } | null>(
                  `*[_id == $id][0]{size, mimeType}`,
                  { id: asset._ref }
                );
                if (doc?.mimeType && doc.mimeType !== "application/pdf") {
                  return "Filen må være en PDF";
                }
                if (typeof doc?.size === "number" && doc.size > MAX_PDF_BYTES) {
                  return "PDF-filen er for stor (maks 20 MB)";
                }
                return true;
              }),
          }),
        ]
      : []),
    ...(includeNewTab
      ? [
          defineField({
            name: "openInNewTab",
            type: "boolean",
            title: "Åpne i ny fane",
            initialValue: false,
          }),
        ]
      : []),
  ];
}
