import { useEffect, useRef, useState } from "react";
import { set, useClient, useCurrentUser, useEditState, useFormValue, type SlugInputProps } from "sanity";
import { CODE_ROUTED_PAGES, PAGE_PATH_API_VERSION, fetchPagePath, lastSegment, slugifyPath } from "../pagePath";
import { isAdministrator } from "../roles";

const buttonStyle = {
  padding: "7px 12px",
  borderRadius: 4,
  border: "1px solid rgba(148, 163, 184, 0.4)",
  background: "rgba(148, 163, 184, 0.15)",
  color: "inherit",
  font: "inherit",
  fontWeight: 500,
  whiteSpace: "nowrap" as const,
  cursor: "pointer",
};

/** Sidens eget ledd i adressen, laget fra tittelen. */
const segmentFromTitle = (title: string | undefined) => slugifyPath((title ?? "").replace(/\//g, "-"));

const inputStyle = {
  flex: 1,
  minWidth: 0,
  padding: "8px 10px",
  borderRadius: 4,
  border: "1px solid rgba(148, 163, 184, 0.4)",
  background: "inherit",
  color: "inherit",
  font: "inherit",
};

/**
 * Adressefeltet for fleksible sider. Adressen er forelderens adresse pluss
 * sidens eget ledd, så forfatteren velger plassering i "Ligger under" og
 * skriver bare siste ledd her. Byttes forelderen, følger adressen med.
 *
 * Så lenge siden ikke er publisert, følger siste ledd tittelen automatisk,
 * helt til forfatteren skriver noe annet i feltet. Etter publisering står
 * adressen fast, og endres bare ved å redigere den eller trykke på knappen.
 *
 * Sider uten forelder (toppnivå) bruker Sanitys vanlige adressefelt, der hele
 * stien kan skrives. Det er forbeholdt administratorer.
 */
export function PagePathInput(props: SlugInputProps) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: PAGE_PATH_API_VERSION });
  const currentUser = useCurrentUser();
  const parentRef = (useFormValue(["parent"]) as { _ref?: string } | undefined)?._ref;
  const title = useFormValue(["title", "no"]) as string | undefined;
  const documentId = ((useFormValue(["_id"]) as string | undefined) ?? "").replace(/^drafts\./, "");
  const editState = useEditState(documentId, "flexiblePage");
  const isPublished = !editState.ready || Boolean(editState.published);
  const isAdmin = isAdministrator(currentUser);

  const [parent, setParent] = useState<{ ref: string; path: string | null }>();
  // Forelderen adressen sist ble regnet ut fra. Adressen skrives bare om når
  // forfatteren faktisk bytter forelder, ikke bare fordi dokumentet åpnes.
  const syncedParentRef = useRef(parentRef);

  useEffect(() => {
    if (!parentRef) return;
    let cancelled = false;
    fetchPagePath(client, parentRef)
      .then((path) => !cancelled && setParent({ ref: parentRef, path }))
      .catch(() => !cancelled && setParent({ ref: parentRef, path: null }));
    return () => {
      cancelled = true;
    };
  }, [client, parentRef]);

  const current = value?.current ?? "";
  const parentPath = parent && parent.ref === parentRef ? parent.path : undefined;

  useEffect(() => {
    if (!parentRef) {
      syncedParentRef.current = undefined;
      return;
    }
    if (readOnly || !parentPath || syncedParentRef.current === parentRef) return;
    syncedParentRef.current = parentRef;
    const segment = lastSegment(current) || (isPublished ? "" : segmentFromTitle(title));
    if (segment) onChange(set({ _type: "slug", current: `${parentPath}/${segment}` }));
  }, [parentRef, parentPath, current, title, readOnly, isPublished, onChange]);

  // Tittelen adressen sist ble sammenlignet med, for å se om adressen
  // fortsatt er den som ble laget fra tittelen eller er skrevet for hånd.
  const followedTitle = useRef(title);

  useEffect(() => {
    if (title === followedTitle.current) return;
    // Venter med å ta stilling til den nye tittelen til forelderens adresse er hentet.
    if (parentRef && !parentPath) return;
    const previousTitle = followedTitle.current;
    followedTitle.current = title;
    if (readOnly || isPublished || (!parentRef && !isAdmin)) return;

    const prefix = parentPath ? `${parentPath}/` : "";
    const followsTitle = current === "" || current === prefix + segmentFromTitle(previousTitle);
    const next = segmentFromTitle(title);
    if (followsTitle && next) onChange(set({ _type: "slug", current: prefix + next }));
  }, [title, parentRef, parentPath, current, readOnly, isPublished, isAdmin, onChange]);

  if (CODE_ROUTED_PAGES.has(current)) {
    return <span>/{current} (fast adresse, kan ikke endres)</span>;
  }

  if (!parentRef) {
    return isAdmin ? (
      props.renderDefault(props)
    ) : (
      <span>Velg først hvor siden skal ligge, i feltet «Ligger under».</span>
    );
  }

  if (parentPath === undefined) return <span>Henter adresse…</span>;
  if (parentPath === null) return <span>Fant ikke adressen til siden denne ligger under.</span>;

  const prefix = `${parentPath}/`;
  const inSync = current === "" || (current.startsWith(prefix) && !current.slice(prefix.length).includes("/"));
  const segment = inSync ? current.slice(prefix.length) : lastSegment(current);
  const setSegment = (next: string) => onChange(set({ _type: "slug", current: prefix + next }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ opacity: 0.7 }}>/{prefix}</span>
        <input
          type="text"
          value={segment}
          readOnly={readOnly}
          // Rydder underveis, men lar en bindestrek på slutten stå så det går an å skrive videre.
          onChange={(e) => setSegment(slugifyPath(e.currentTarget.value.replace(/\//g, "-") + "x").slice(0, -1))}
          style={inputStyle}
        />
        {!readOnly && (
          <button
            type="button"
            disabled={!title}
            onClick={() => setSegment(segmentFromTitle(title))}
            style={{ ...buttonStyle, opacity: title ? 1 : 0.5 }}
          >
            Lag fra tittel
          </button>
        )}
      </div>
      {!inSync && !readOnly && (
        <span>
          Adressen (/{current}) stemmer ikke med plasseringen.{" "}
          <button type="button" onClick={() => setSegment(segment)} style={buttonStyle}>
            Rett til /{prefix + segment}
          </button>
        </span>
      )}
    </div>
  );
}
