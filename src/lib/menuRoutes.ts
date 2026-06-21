export const disciplinePath = (discipline: string) => `/padling/${discipline}`;

export const flexiblePagePaths: Record<string, string> = {
  "hms": "/hms",
  "hms-generelt": "/hms/generelt",
  "hms-mitt-varsel": "/hms/mitt-varsel",
  "hms-hendelsesrapporter": "/hms/hendelsesrapporter",
  "hms-politiattest": "/hms/politiattest",
  "medlemskap": "/medlemskap",
  "kom-i-gang": "/kom-i-gang",
  "klubben-administrasjon": "/om-klubben/administrasjon",
  "klubben-klubbhus": "/om-klubben/klubbhus",
  "klubben-sosialgruppe": "/om-klubben/sosialgruppe",
  "klubben-sosialgruppe-sosialgruppa": "/om-klubben/sosialgruppe/sosialgruppa",
  "klubben-sosialgruppe-utmerkelser": "/om-klubben/sosialgruppe/utmerkelser",
  "klubben-stotteordninger": "/om-klubben/stotteordninger",
  "klubben-kjoregodtgjorelse": "/om-klubben/kjoregodtgjorelse",
  "klubben-vedtektene": "/om-klubben/vedtektene",
};

export type MenuLinkData = {
  linkType?: "discipline" | "flexible" | "custom";
  disciplinePage?: { discipline?: string } | null;
  flexiblePage?: { pageId?: string } | null;
  customPath?: string | null;
};

export function resolveMenuLink(link: MenuLinkData | null | undefined): string | null {
  if (!link) return null;
  if (link.linkType === "discipline" && link.disciplinePage?.discipline) {
    return disciplinePath(link.disciplinePage.discipline);
  }
  if (link.linkType === "flexible" && link.flexiblePage?.pageId) {
    return flexiblePagePaths[link.flexiblePage.pageId] ?? null;
  }
  if (link.linkType === "custom" && link.customPath) {
    return link.customPath;
  }
  return null;
}
