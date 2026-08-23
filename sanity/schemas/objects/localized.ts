import { defineField } from "sanity";
import { bodyBlock } from "./blockContent";

/**
 * Nettstedet er norskspråklig, men innholdet ligger lagret som `{ no: … }` fra
 * den gang studioet var tospråklig. Hjelperne under beholder den strukturen slik
 * at eksisterende dokumenter fortsetter å virke, samtidig som redaktøren bare
 * ser ett felt.
 */

type Options = {
  required?: boolean;
  description?: string;
  rows?: number;
  /** Maks antall tegn — gir en advarsel, ikke en feil. */
  maxWarning?: { limit: number; message: string };
};

function inner(type: "string" | "text", label: string, opts: Options) {
  return defineField({
    name: "no",
    title: label,
    type,
    ...(type === "text" ? { rows: opts.rows ?? 4 } : {}),
    validation: (r) => {
      let rule = r;
      if (opts.required) rule = rule.required();
      if (opts.maxWarning) rule = rule.max(opts.maxWarning.limit).warning(opts.maxWarning.message);
      return rule;
    },
  });
}

export function noString(name: string, title: string, opts: Options = {}) {
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    fields: [inner("string", "Tekst", opts)],
  });
}

export function noText(name: string, title: string, opts: Options = {}) {
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    fields: [inner("text", "Tekst", opts)],
  });
}

export function noBody(name: string, title: string, opts: { image?: boolean; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    fields: [
      defineField({
        name: "no",
        title: "Innhold",
        type: "array",
        of: bodyBlock({ image: opts.image }),
      }),
    ],
  });
}
