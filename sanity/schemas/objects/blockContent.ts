import { defineField } from "sanity";
import { linkAnnotation } from "./linkAnnotation";
import { tableObject } from "./tableObject";

const bodyStyles = [
  { title: "Normal", value: "normal" },
  { title: "Overskrift 2", value: "h2" },
  { title: "Overskrift 3", value: "h3" },
];

export function bodyBlock(options?: { image?: boolean }) {
  const blockType = {
    type: "block" as const,
    styles: bodyStyles,
    marks: { annotations: [linkAnnotation] },
  };
  const imageType = {
    type: "image" as const,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt-tekst",
        type: "string",
        validation: (r) => r.required(),
      }),
    ],
  };
  return options?.image ? [blockType, tableObject, imageType] : [blockType, tableObject];
}
