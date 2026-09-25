import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { DISCIPLINES } from "./objects/disciplines";
import { createLinkFields } from "./objects/link";

const safetyLink = {
  type: "object" as const,
  name: "safetyLink",
  title: "Sikkerhetslenke",
  fields: [
    defineField({ name: "label", title: "Tekst", type: "string", validation: (r) => r.required() }),
    ...createLinkFields({ allowPdf: true, includeNewTab: true }),
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
      return {
        title,
        subtitle: linkType === "page" ? (pageTitle ?? "Side") : linkType === "pdf" ? "PDF" : subtitle,
      };
    },
  },
};

export const disciplinePage = defineType({
  name: "disciplinePage",
  title: "Grenside",
  type: "document",
  fields: [
    defineField({
      name: "discipline",
      title: "Gren (nøkkel)",
      type: "string",
      options: {
        list: DISCIPLINES,
      },
      validation: (r) =>
        r.required().custom(async (value, ctx) => {
          if (!value) return true;
          const client = ctx.getClient({ apiVersion: "2024-01-01" });
          const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
          const other = await client.fetch(
            `count(*[_type == "disciplinePage" && discipline == $value && !(_id in [$id, "drafts." + $id])])`,
            { value, id }
          );
          return other === 0 ? true : "Denne grenen er allerede i bruk av en annen side";
        }),
    }),
    noString("title", "Tittel", { required: true }),
    noString("tagline", "Tagline"),
    noText("intro", "Ingress"),
    noBody("body", "Innhold"),
    defineField({
      name: "subPageLinks",
      title: "Undersider",
      description: "Lenker til undersider som vises som kort-grid nederst på siden",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            noString("title", "Tittel"),
            defineField({
              name: "href",
              title: "Lenke (relativ sti)",
              type: "string",
              description: "F.eks. /padling/hav/reolplasser",
            }),
          ],
          preview: {
            select: { title: "title.no", subtitle: "href" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? "Underside", subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "safetyLinks",
      title: "Sikker padling",
      description:
        "Lenker til HMS-sidene for denne grenen. Vises som en egen \"Sikker padling\"-boks med sikkerhetsikon på grensiden. Tom liste = boksen vises ikke.",
      type: "array",
      of: [safetyLink],
    }),
    defineField({
      name: "heroImage",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string", validation: (r) => r.required() })],
    }),
    seoField,
  ],
  preview: {
    select: { title: "title.no", subtitle: "discipline" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? "Uten tittel", subtitle };
    },
  },
});
