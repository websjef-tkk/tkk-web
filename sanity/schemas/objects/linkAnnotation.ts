import { createLinkFields } from "./link";

export const linkAnnotation = {
  type: "object" as const,
  name: "link",
  title: "Lenke",
  fields: createLinkFields({ allowPdf: true, includeNewTab: true, allowAnchor: true }),
};
