import { useId, useState, type ComponentType } from "react";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import type { InputProps } from "sanity";

/**
 * Infoknapp som viser/skjuler en lengre forklaring. Brukes på felter der
 * forklaringen blir for lang til å stå fremme hele tiden. Selve beskrivelsen
 * (`description`) må være vanlig tekst, så knappen ligger over feltets input
 * i stedet, se `withFieldHint`.
 */
export function FieldHint({ hint }: { hint: string }) {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  return (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={hintId}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          padding: 2,
          margin: 0,
          cursor: "pointer",
          color: "inherit",
          fontSize: "0.85em",
          opacity: 0.8,
        }}
      >
        <InfoOutlineIcon />
        Mer forklaring
      </button>
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

/**
 * Lager en input-komponent som viser `FieldHint` over feltet. Uten `Input`
 * brukes Sanitys standard-input for feltet.
 */
export function withFieldHint<P extends InputProps>(hint: string, Input?: ComponentType<P>) {
  return function InputWithFieldHint(props: P) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <FieldHint hint={hint} />
        {Input ? <Input {...props} /> : props.renderDefault(props)}
      </div>
    );
  };
}
