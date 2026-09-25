import { defineField, defineType } from "sanity";
import { noString } from "./objects/localized";

const menuLinkFields = [
  defineField({
    name: "linkType",
    title: "Type lenke",
    type: "string",
    options: {
      list: [
        { title: "Grenside", value: "discipline" },
        { title: "Fleksibel side", value: "flexible" },
        { title: "Egendefinert sti", value: "custom" },
      ],
      layout: "radio",
    },
    initialValue: "custom",
    validation: (r) => r.required(),
  }),
  defineField({
    name: "disciplinePage",
    title: "Grenside",
    type: "reference",
    to: [{ type: "disciplinePage" }],
    hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "discipline",
  }),
  defineField({
    name: "flexiblePage",
    title: "Fleksibel side",
    type: "reference",
    to: [{ type: "flexiblePage" }],
    hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "flexible",
  }),
  defineField({
    name: "customPath",
    title: "Sti (f.eks. /aktiviteter)",
    type: "string",
    hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "custom",
    validation: (r) =>
      r.custom((val: string | undefined, ctx) => {
        const parent = ctx.parent as { linkType?: string } | undefined;
        if (parent?.linkType !== "custom") return true;
        if (!val) return "Sti er påkrevd";
        return val.startsWith("/") ? true : "Sti må starte med /";
      }),
  }),
];

const menuLink = defineField({
  name: "link",
  title: "Lenke",
  type: "object",
  fields: menuLinkFields,
});

const menuChild = {
  type: "object" as const,
  name: "menuChild",
  title: "Undermenypunkt",
  fields: [noString("label", "Etikett", { required: true }), menuLink],
  preview: {
    select: { title: "label.no" },
  },
};

export const mainMenu = defineType({
  name: "mainMenu",
  title: "Hovedmeny",
  type: "document",
  // @ts-expect-error — singleton action list is not in the public type but works at runtime
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "items",
      title: "Menypunkter",
      description: "Rekkefølgen her er rekkefølgen på nettstedet. Dra for å omorganisere.",
      type: "array",
      of: [
        {
          type: "object",
          name: "menuItem",
          title: "Menypunkt",
          fields: [
            noString("label", "Etikett", { required: true }),
            defineField({
              name: "itemType",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Enkel lenke", value: "link" },
                  { title: "Nedtrekksmeny", value: "dropdown" },
                ],
                layout: "radio",
              },
              initialValue: "link",
              validation: (r) => r.required(),
            }),
            {
              ...menuLink,
              hidden: ({ parent }: { parent?: { itemType?: string } }) => parent?.itemType !== "link",
            },
            defineField({
              name: "children",
              title: "Undermenypunkter",
              type: "array",
              of: [menuChild],
              hidden: ({ parent }) => (parent as { itemType?: string } | undefined)?.itemType !== "dropdown",
            }),
          ],
          preview: {
            select: { title: "label.no", subtitle: "itemType" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hovedmeny" };
    },
  },
});
