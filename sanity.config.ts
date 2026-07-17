import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const SINGLETON_TYPES = new Set(["siteSettings", "navLabels", "mainMenu"]);

export default defineConfig({
  name: "tkk-studio",
  title: "TKK Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Disse dokumenttypene skal bare finnes én gang (fast dokument-ID i sanity/structure.ts).
    // Uten dette kan en redaktør ved uhell opprette et nytt, konkurrerende dokument via
    // "+ Create new document"-menyen, som frontend da kan begynne å hente i stedet for det ekte.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => !SINGLETON_TYPES.has(template.templateId));
      }
      return prev;
    },
  },
});
