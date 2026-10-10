import { defineField, defineType } from "sanity";
import { noString, noText, noBody } from "./objects/localized";
import { seoField } from "./objects/seo";
import { subPageLinksField } from "./objects/subPageLink";
import { DISCIPLINES } from "./objects/disciplines";
import { withFieldHint } from "../components/FieldInfo";
import { PagePathInput } from "../components/PagePathInput";
import { isAdministrator, readOnlyUnlessAdministrator } from "../roles";
import {
  CODE_ROUTED_PAGES,
  PAGE_PATH_API_VERSION,
  fetchPagePath,
  isReservedPath,
  lastSegment,
  slugifyPath,
} from "../pagePath";

const slugOf = (document: Record<string, unknown> | undefined) =>
  (document?.slug as { current?: string } | undefined)?.current;

export const flexiblePage = defineType({
  name: "flexiblePage",
  title: "Fleksibel side",
  type: "document",
  // Klubbinformasjon er forbeholdt administratorer. Andre roller kan bare
  // opprette og endre padling-innhold, se også "section"-feltet under.
  readOnly: ({ currentUser, document }) =>
    document?.section === "klubb" && !isAdministrator(currentUser),
  fieldsets: [
    {
      name: "advanced",
      title: "Avansert (tilbake-lenke og viderekobling)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "parent",
      title: "Ligger under",
      type: "reference",
      to: [{ type: "flexiblePage" }, { type: "disciplinePage" }],
      description: "Siden denne hører til under. Bestemmer første del av adressen.",
      components: {
        input: withFieldHint(
          'Velg f.eks. "Om klubben" for å få adressen "om-klubben/…", eller en gren for å legge siden under den grenen. Flytter du siden hit eller dit senere, følger undersidene med, og gamle lenker blir videresendt.'
        ),
      },
      // Sider med egen rute i koden må bli liggende der de er.
      hidden: ({ document }) => CODE_ROUTED_PAGES.has(slugOf(document) ?? ""),
      validation: (r) =>
        r.custom(async (value, ctx) => {
          const ref = (value as { _ref?: string } | undefined)?._ref;
          if (!ref) return true;
          const id = (ctx.document?._id ?? "").replace(/^drafts\./, "");
          if (ref === id) return "En side kan ikke ligge under seg selv";
          const client = ctx.getClient({ apiVersion: PAGE_PATH_API_VERSION });
          const ancestors = await client.fetch<(string | null)[] | null>(
            `*[_id == $ref][0]{ "ids": [parent._ref, parent->parent._ref, parent->parent->parent._ref, parent->parent->parent->parent._ref] }.ids`,
            { ref }
          );
          return ancestors?.includes(id) ? "En side kan ikke ligge under en av sine egne undersider" : true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Adresse (URL)",
      type: "slug",
      description: "Følger av «Ligger under» pluss sidens eget ledd.",
      components: {
        input: withFieldHint(
          'Første del av adressen kommer fra siden denne ligger under, og kan bare endres ved å flytte siden. Siste ledd skriver du selv, eller lager fra tittelen. Sider på toppnivå (uten «Ligger under») opprettes av administratorer.',
          PagePathInput
        ),
      },
      options: {
        source: "title.no",
        maxLength: 200,
        slugify: slugifyPath,
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
          if (isReservedPath(current, DISCIPLINES.map((d) => d.value))) {
            return "Denne adressen er reservert for en annen del av nettstedet";
          }
          const client = ctx.getClient({ apiVersion: PAGE_PATH_API_VERSION });
          const parentRef = (ctx.document?.parent as { _ref?: string } | undefined)?._ref;
          if (parentRef) {
            const parentPath = await fetchPagePath(client, parentRef);
            if (parentPath && current !== `${parentPath}/${lastSegment(current)}`) {
              return `Adressen må være "${parentPath}/" pluss ett ledd, siden siden ligger under /${parentPath}`;
            }
          }
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
      initialValue: (_, { currentUser }) => (isAdministrator(currentUser) ? "klubb" : "padling"),
      readOnly: readOnlyUnlessAdministrator,
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
    subPageLinksField,
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
        "Gamle adresser denne siden har hatt. Besøkende som kommer via en gammel lenke blir automatisk videresendt til dagens adresse. Fylles ut automatisk når en publisert side flyttes eller får ny adresse.",
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
