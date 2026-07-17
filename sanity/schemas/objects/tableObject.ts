import { defineField } from "sanity";

export const tableObject = {
  type: "object" as const,
  name: "table",
  title: "Tabell",
  fields: [
    defineField({
      name: "rows",
      title: "Rader",
      type: "array",
      of: [
        {
          type: "object" as const,
          name: "row",
          title: "Rad",
          fields: [
            defineField({
              name: "cells",
              title: "Celler",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }: { cells?: string[] }) {
              return { title: cells?.join(" | ") ?? "Rad" };
            },
          },
        },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "headerRow",
      title: "Første rad er overskriftsrad",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "style",
      title: "Stil",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "default" },
          { title: "Stripete", value: "striped" },
          { title: "Kompakt", value: "compact" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: { rows: "rows" },
    prepare({ rows }: { rows?: { cells?: string[] }[] }) {
      return { title: `Tabell (${rows?.length ?? 0} rader)`, subtitle: rows?.[0]?.cells?.join(" | ") };
    },
  },
};
