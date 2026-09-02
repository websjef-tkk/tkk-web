export const disciplinePath = (discipline: string) => `/padling/${discipline}`;

export type MenuLinkData = {
  linkType?: "discipline" | "flexible" | "custom";
  disciplinePage?: { discipline?: string } | null;
  flexiblePage?: { slug?: string } | null;
  customPath?: string | null;
};

export function resolveMenuLink(link: MenuLinkData | null | undefined): string | null {
  if (!link) return null;
  if (link.linkType === "discipline" && link.disciplinePage?.discipline) {
    return disciplinePath(link.disciplinePage.discipline);
  }
  if (link.linkType === "flexible" && link.flexiblePage?.slug) {
    return `/${link.flexiblePage.slug}`;
  }
  if (link.linkType === "custom" && link.customPath) {
    return link.customPath;
  }
  return null;
}
