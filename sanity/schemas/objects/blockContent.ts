import { defineField } from "sanity";
import { linkAnnotation } from "./linkAnnotation";
import { tableObject } from "./tableObject";

const bodyStyles = [
  { title: "Normal", value: "normal" },
  { title: "Overskrift 2", value: "h2" },
  { title: "Overskrift 3", value: "h3" },
];

export function bodyBlock() {
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
      defineField({ name: "caption", title: "Bildetekst", type: "string" }),
      defineField({ name: "credit", title: "Opphavsrett/kreditering", type: "string" }),
      defineField({
        name: "size",
        title: "Størrelse",
        type: "string",
        options: {
          list: [
            { title: "Liten", value: "small" },
            { title: "Middels", value: "medium" },
            { title: "Stor", value: "large" },
            { title: "Full bredde", value: "full" },
          ],
          layout: "radio",
        },
        initialValue: "large",
      }),
      defineField({
        name: "alignment",
        title: "Plassering",
        type: "string",
        options: {
          list: [
            { title: "Venstre (tekst flyter rundt)", value: "left" },
            { title: "Midtstilt", value: "center" },
            { title: "Høyre (tekst flyter rundt)", value: "right" },
          ],
          layout: "radio",
        },
        initialValue: "center",
        hidden: ({ parent }) => (parent as { size?: string } | undefined)?.size === "full",
      }),
      defineField({
        name: "aspectRatio",
        title: "Bildeformat (utsnitt)",
        type: "string",
        options: {
          list: [
            { title: "Automatisk (originalformat)", value: "auto" },
            { title: "Liggende (16:9)", value: "16:9" },
            { title: "Liggende (4:3)", value: "4:3" },
            { title: "Kvadratisk (1:1)", value: "1:1" },
            { title: "Stående (3:4)", value: "3:4" },
          ],
          layout: "radio",
        },
        initialValue: "auto",
      }),
    ],
  };
  return [blockType, tableObject, imageType];
}
