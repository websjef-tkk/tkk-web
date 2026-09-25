import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { DISCIPLINES } from "./objects/disciplines";
import { FieldInfo } from "../components/FieldInfo";

export const flexiblePage = defineType({
  name: "flexiblePage",
  title: "Fleksibel side",
  type: "document",
  fieldsets: [
    {
      name: "advanced",
      title: "Avansert (tilbake-lenke og viderekobling)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Adresse (URL)",
      type: "slug",
      description: (
        <FieldInfo
          short="Genereres automatisk fra tittelen (kan overstyres)."
          hint='Full sti til siden, uten skråstrek foran (f.eks. "om-klubben/klubbhus"). Bestemmer både hvor siden vises i menyen/lenker og hvilken nettadresse den får. Kan skrives inn direkte, eller genereres fra tittelen — husk å legge til foreldre-stien selv da (f.eks. "om-klubben/" foran).'
        />
      ),
      options: {
        source: "title.no",
        maxLength: 200,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/æ/g, "ae")
            .replace(/ø/g, "o")
            .replace(/å/g, "a")
            .replace(/[^a-z0-9/]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/-*\/-*/g, "/")
            .replace(/^-|-$/g, "")
            .replace(/^\/|\/$/g, ""),
      },
      validation: (r) =>
        r.required().custom(async (value, ctx) => {
          const current = (value as { current?: string } | undefined)?.current;
          if (!current) return true;
          if (current.startsWith("/") || current.endsWith("/")) {
            return "Adressen skal ikke starte eller slutte med skråstrek";
          }
          if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(current)) {
            return "Adressen kan bare inneholde små bokstaver, tall, bindestrek og skråstrek";
          }
          const client = ctx.getClient({ apiVersion: "2024-01-01" });
          const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
          const other = await client.fetch(
            `count(*[_type == "flexiblePage" && slug.current == $value && !(_id in [$id, "drafts." + $id])])`,
            { value: current, id }
          );
          return other === 0 ? true : "Denne adressen er allerede i bruk av en annen side";
        }),
    }),
    defineField({
      name: "section",
      title: "Seksjon (for redigeringsmenyen)",
      type: "string",
      options: {
        list: [
          { title: "Padling-innhold", value: "padling" },
          { title: "Klubbinformasjon", value: "klubb" },
        ],
        layout: "radio",
      },
      initialValue: "klubb",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "disciplines",
      title: "Grener",
      description: 'Hvilke grener siden tilhører. Styrer om siden vises under "[Gren]-innhold" i Studio.',
      type: "array",
      of: [{ type: "string" }],
      options: { list: DISCIPLINES },
      hidden: ({ parent }) => (parent as { section?: string } | undefined)?.section !== "padling",
    }),
    noString("title", "Tittel", { required: true }),
    defineField({
      name: "heroImage",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string", validation: (r) => r.required() })],
    }),
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
              description: "F.eks. /om-klubben/vedtektene",
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
    seoField,
    defineField({
      name: "backLabel",
      title: "Tekst på tilbake-lenke (valgfritt)",
      type: "string",
      description: 'Overstyrer standardteksten "← Tilbake" øverst på siden.',
      fieldset: "advanced",
    }),
    defineField({
      name: "previousSlugs",
      title: "Tidligere adresser (viderekobling)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Gamle adresser denne siden har hatt. Besøkende som kommer via en gammel lenke blir automatisk videresendt til dagens adresse. Legg til den gamle adressen her FØR du endrer feltet over.",
      fieldset: "advanced",
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "slug.current", updatedAt: "_updatedAt" },
    prepare({ title, subtitle, updatedAt }: { title?: string; subtitle?: string; updatedAt?: string }) {
      const updated = updatedAt
        ? new Date(updatedAt).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })
        : undefined;
      return {
        title: title ?? "Uten tittel",
        subtitle: updated ? `${subtitle} · sist oppdatert ${updated}` : subtitle,
      };
    },
  },
});
