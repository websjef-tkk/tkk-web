import type { InitialValueResolverContext, Template } from "sanity";
import { PAGE_PATH_API_VERSION } from "./pagePath";
import { isAdministrator } from "./roles";

export const CHILD_PAGE_TEMPLATE_ID = "flexiblePage-child";

type Params = { parentId?: string; discipline?: string };

/**
 * Ny side som blir født under en bestemt forelder. Brukes av "+"-knappen i
 * listene i sanity/structure.ts, med enten forelderens ID eller en gren
 * (da blir grensiden forelder). Seksjon og grener arves fra forelderen.
 */
export const childPageTemplate: Template<Params> = {
  id: CHILD_PAGE_TEMPLATE_ID,
  title: "Underside",
  schemaType: "flexiblePage",
  parameters: [
    { name: "parentId", type: "string" },
    { name: "discipline", type: "string" },
  ],
  value: async (params: Params | undefined, { getClient, currentUser }: InitialValueResolverContext) => {
    const parent = await getClient({ apiVersion: PAGE_PATH_API_VERSION }).fetch<{
      _id: string;
      _type: string;
      section?: string;
      disciplines?: string[];
      discipline?: string;
    } | null>(
      `*[!(_id in path("drafts.**")) && (_id == $parentId || (_type == "disciplinePage" && discipline == $discipline))][0]{
        _id, _type, section, disciplines, discipline
      }`,
      { parentId: params?.parentId ?? "", discipline: params?.discipline ?? "" }
    );
    if (!parent) return {};

    const isDiscipline = parent._type === "disciplinePage";
    // Andre enn administratorer kan bare opprette padling-innhold (se flexiblePage.tsx).
    const section = isDiscipline || !isAdministrator(currentUser) ? "padling" : parent.section;
    return {
      parent: { _type: "reference", _ref: parent._id },
      section,
      disciplines: isDiscipline ? [parent.discipline] : (parent.disciplines ?? undefined),
    };
  },
};
