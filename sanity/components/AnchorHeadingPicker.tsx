import { set, useFormValue, type StringInputProps } from "sanity";

type BodyBlock = {
  _key: string;
  _type: string;
  style?: string;
  children?: { text?: string }[];
};

/**
 * Lar redaktøren velge hvilken overskrift (h2/h3) i brødteksten en
 * "lenke til overskrift"-annotasjon skal hoppe til, i stedet for å måtte
 * skrive inn en nøkkel for hånd. Leser brødteksten fra samme dokument via
 * `useFormValue` — stien er absolutt fra dokumentroten, ikke relativ til
 * hvor komponenten selv er montert (dypt inne i markDefs).
 */
export function AnchorHeadingPicker(props: StringInputProps) {
  const blocks = (useFormValue(["body", "no"]) as BodyBlock[] | undefined) ?? [];
  const headings = blocks.filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"));

  if (headings.length === 0) {
    return <span>Ingen overskrifter (H2/H3) funnet i brødteksten ennå.</span>;
  }

  return (
    <select
      value={props.value ?? ""}
      onChange={(e) => props.onChange(set(e.currentTarget.value))}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 4,
        border: "1px solid rgba(148, 163, 184, 0.4)",
        background: "inherit",
        color: "inherit",
      }}
    >
      <option value="" disabled>
        Velg overskrift…
      </option>
      {headings.map((h) => (
        <option key={h._key} value={h._key}>
          {(h.style === "h2" ? "H2 — " : "H3 — ") + (h.children?.map((c) => c.text ?? "").join("") || "(uten tekst)")}
        </option>
      ))}
    </select>
  );
}
