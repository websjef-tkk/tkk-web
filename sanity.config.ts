import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "tkk-studio",
  title: "TKK Studio",
  projectId,
  dataset,
  apiHost: "https://api.eu.sanity.io",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
