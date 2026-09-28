import { sanityClient } from "../sanity";
import { resolveMenuLink, type MenuLinkData } from "../menuRoutes";

const linkProjection = `
  linkType,
  disciplinePage->{ discipline },
  flexiblePage->{ "slug": slug.current },
  customPath
`;

interface RawMenuChild {
  label?: { no: string };
  link?: MenuLinkData;
}

interface RawMenuItem {
  label?: { no: string };
  itemType?: "link" | "dropdown";
  link?: MenuLinkData;
  children?: RawMenuChild[];
}

interface RawMainMenu {
  items?: RawMenuItem[];
  loggbokUrl?: string;
}

export interface ResolvedMenuChild {
  label: { no: string };
  href: string;
}

export interface ResolvedMenuItem {
  label: { no: string };
  itemType: "link" | "dropdown";
  href?: string;
  children?: ResolvedMenuChild[];
}

async function fetchMainMenu(): Promise<RawMainMenu | null> {
  try {
    return await sanityClient.fetch(`
      *[_type == "mainMenu"][0] {
        items[] {
          label,
          itemType,
          link { ${linkProjection} },
          children[] {
            label,
            link { ${linkProjection} }
          }
        },
        loggbokUrl
      }
    `);
  } catch {
    return null;
  }
}

export async function getMainMenu(): Promise<{ items: ResolvedMenuItem[]; loggbokUrl?: string }> {
  const raw = await fetchMainMenu();
  if (!raw?.items) return { items: [], loggbokUrl: raw?.loggbokUrl };

  const resolved: ResolvedMenuItem[] = [];

  for (const item of raw.items) {
    if (!item.label) continue;

    if (item.itemType === "dropdown") {
      const children: ResolvedMenuChild[] = [];
      for (const child of item.children ?? []) {
        if (!child.label) continue;
        const href = resolveMenuLink(child.link);
        if (href) children.push({ label: child.label, href });
      }
      if (children.length > 0) {
        resolved.push({ label: item.label, itemType: "dropdown", children });
      }
    } else {
      const href = resolveMenuLink(item.link);
      if (href) resolved.push({ label: item.label, itemType: "link", href });
    }
  }

  return { items: resolved, loggbokUrl: raw.loggbokUrl };
}
