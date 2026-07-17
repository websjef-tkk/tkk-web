import { defineField } from "sanity";

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export const linkAnnotation = {
  type: "object" as const,
  name: "link",
  title: "Lenke",
  fields: [
    defineField({
      name: "linkType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "URL", value: "url" },
          { title: "PDF-fil", value: "pdf" },
        ],
        layout: "radio",
      },
      initialValue: "url",
    }),
    defineField({
      name: "href",
      type: "url",
      title: "URL",
      hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType === "pdf",
      validation: (r) =>
        r.custom((val, ctx) => {
          const parent = ctx.parent as { linkType?: string } | undefined;
          if (parent?.linkType === "pdf") return true;
          return val ? true : "URL er påkrevd";
        }),
    }),
    defineField({
      name: "pdfFile",
      type: "file",
      title: "PDF-fil",
      description: "Maks 20 MB.",
      options: { accept: "application/pdf" },
      hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "pdf",
      validation: (r) =>
        r.custom(async (file, ctx) => {
          const parent = ctx.parent as { linkType?: string } | undefined;
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
    defineField({
      name: "openInNewTab",
      type: "boolean",
      title: "Åpne i ny fane",
      initialValue: false,
    }),
  ],
};
