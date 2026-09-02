import { useId, useState } from "react";
import { InfoOutlineIcon } from "@sanity/icons";

/**
 * Kort, alltid synlig tekst pluss en infoknapp som viser/skjuler en lengre
 * forklaring. Brukes som `description` på felter der standardteksten ellers
 * blir for lang til å stå fremme hele tiden.
 */
export function FieldInfo({ short, hint }: { short: string; hint: string }) {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {short}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={hintId}
          title="Vis forklaring"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            padding: 2,
            margin: 0,
            cursor: "pointer",
            color: "inherit",
          }}
        >
          <InfoOutlineIcon />
        </button>
      </span>
      {open && (
        <span
          id={hintId}
          style={{
            fontSize: "0.85em",
            lineHeight: 1.5,
            background: "rgba(148, 163, 184, 0.15)",
            borderRadius: 4,
            padding: "6px 8px",
          }}
        >
          {hint}
        </span>
      )}
    </span>
  );
}
