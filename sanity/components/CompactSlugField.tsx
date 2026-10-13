import { useState } from "react";
import { useFormValue, type FieldProps } from "sanity";

const linkButtonStyle = {
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  color: "inherit",
  font: "inherit",
  textDecoration: "underline",
};

/**
 * Viser adressefeltet som én dempet linje, siden de fleste forfattere ikke
 * trenger å tenke på adressen. Feltet åpnes med «Endre», og av seg selv når
 * adressen har en feil eller ikke lot seg lage fra tittelen.
 *
 * Selve feltet ligger skjult, ikke fjernet, mens linjen vises: det er
 * input-komponenten som lar adressen følge tittelen.
 */
export function compactSlugField(pathPrefix: string) {
  return function CompactSlugField(props: FieldProps) {
    const [open, setOpen] = useState(false);
    const title = useFormValue(["title", "no"]) as string | undefined;
    const current = (props.value as { current?: string } | undefined)?.current;
    const hasError = props.validation.some((marker) => marker.level === "error");
    const expanded = open || (current ? hasError : Boolean(title));

    return (
      <div>
        {!expanded && (
          <div style={{ fontSize: "0.85em", opacity: 0.75, overflowWrap: "anywhere" }}>
            {current ? (
              <>
                Adresse: {pathPrefix}
                {current} ·{" "}
                <button type="button" onClick={() => setOpen(true)} style={linkButtonStyle}>
                  Endre
                </button>
              </>
            ) : (
              "Adresse: lages fra tittelen"
            )}
          </div>
        )}
        <div style={expanded ? undefined : { display: "none" }}>{props.renderDefault(props)}</div>
      </div>
    );
  };
}
