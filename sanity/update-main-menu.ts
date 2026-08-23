/**
 * Rydder i hovedmenyen etter gjennomgangen med styret:
 *  - "Vedtektene" fjernes fra menyen (siden lever videre, og er nå lenket
 *    fra "Om klubben").
 *  - Eventuelle lenker til de fjernede medlemssidene (/logg-inn, /profil,
 *    /registrer, /admin) fjernes, siden de nå ville ført til 404.
 *
 * Skriptet er idempotent — kjør det gjerne flere ganger.
 *
 * Kjør: npx tsx sanity/update-main-menu.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const REMOVED_PAGE_IDS = new Set(["klubben-vedtektene"]);
const REMOVED_PATHS = ["/logg-inn", "/profil", "/registrer", "/admin"];

type Link = {
  linkType?: string;
  customPath?: string;
  flexiblePage?: { _ref?: string };
};

type MenuNode = {
  label?: { no?: string };
  itemType?: string;
  link?: Link;
  children?: MenuNode[];
};

function shouldRemove(node: MenuNode): boolean {
  const link = node.link;
  if (!link) return false;

  if (link.linkType === "flexible") {
    const ref = link.flexiblePage?._ref ?? "";
    return REMOVED_PAGE_IDS.has(ref.replace(/^flexiblePage-/, ""));
  }
  if (link.linkType === "custom") {
    const path = link.customPath ?? "";
    return REMOVED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
  }
  return false;
}

async function main() {
  const menu = await client.fetch<{ items?: MenuNode[] } | null>(`*[_id == "mainMenu"][0]`);
  if (!menu?.items) {
    console.error('Fant ingen "mainMenu"-dokument å oppdatere.');
    process.exit(1);
  }

  const removed: string[] = [];

  const items = menu.items
    .filter((item) => {
      if (item.itemType !== "dropdown" && shouldRemove(item)) {
        removed.push(item.label?.no ?? "(uten navn)");
        return false;
      }
      return true;
    })
    .map((item) => {
      if (!item.children) return item;
      const children = item.children.filter((child) => {
        if (shouldRemove(child)) {
          removed.push(`${item.label?.no ?? "?"} → ${child.label?.no ?? "(uten navn)"}`);
          return false;
        }
        return true;
      });
      return { ...item, children };
    });

  if (removed.length === 0) {
    console.log("Ingenting å fjerne — menyen er allerede ryddet.");
    return;
  }

  await client.patch("mainMenu").set({ items }).commit();
  console.log(`Fjernet ${removed.length} menypunkt:`);
  for (const label of removed) console.log(`  - ${label}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
