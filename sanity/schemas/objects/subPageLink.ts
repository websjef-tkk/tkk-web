import { defineField } from "sanity";
import { noString } from "./localized";
import { createLinkFields } from "./link";

/** Felt for "Undersider"-listen nederst på fleksible sider og grensider. */
export const subPageLinksField = defineField({
  name: "subPageLinks",
  title: "Undersider",
  description: "Lenker til undersider som vises som kort-grid nederst på siden",
  type: "array",
  of: [
    {
      type: "object",
      fields: [noString("title", "Tittel"), ...createLinkFields({ allowPdf: true, includeNewTab: true })],
      preview: {
        select: { title: "title.no", subtitle: "href", linkType: "linkType", pageTitle: "page.title.no" },
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
            title: title ?? "Underside",
            subtitle: linkType === "page" ? (pageTitle ?? "Side") : linkType === "pdf" ? "PDF" : subtitle,
          };
        },
      },
    },
  ],
});
