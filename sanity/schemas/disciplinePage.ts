import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { DISCIPLINES } from "./objects/disciplines";

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
