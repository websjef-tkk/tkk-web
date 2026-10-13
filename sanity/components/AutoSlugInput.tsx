import { useEffect, useRef } from "react";
import { set, useEditState, useFormValue, type SlugInputProps } from "sanity";
import { segmentFromTitle } from "../pagePath";

export const AUTO_SLUG_MAX_LENGTH = 96;

/** Adressen slik den lages fra tittelen. Brukes også av «Generate»-knappen. */
export const slugFromTitle = (title: string | undefined) =>
  segmentFromTitle(title).slice(0, AUTO_SLUG_MAX_LENGTH).replace(/-$/, "");

/**
 * Adressefeltet for nyheter og aktiviteter. Så lenge dokumentet ikke er
 * publisert, følger adressen tittelen mens den skrives, helt til forfatteren
 * skriver noe annet i feltet. Etter publisering står adressen fast, slik at
 * lenker som er delt ikke slutter å virke.
 */
export function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange, readOnly } = props;
  const title = useFormValue(["title", "no"]) as string | undefined;
  const documentId = ((useFormValue(["_id"]) as string | undefined) ?? "").replace(/^drafts\./, "");
  const documentType = (useFormValue(["_type"]) as string | undefined) ?? "";
  const editState = useEditState(documentId, documentType);
  const isPublished = !editState.ready || Boolean(editState.published);
  const current = value?.current ?? "";

  // Tittelen adressen sist ble sammenlignet med, og adressen som sist ble
  // laget herfra, for å se om adressen fortsatt følger tittelen eller er
  // skrevet for hånd.
  const followedTitle = useRef(title);
  const lastGenerated = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (title === followedTitle.current) return;
    const previousTitle = followedTitle.current;
    followedTitle.current = title;
    if (readOnly || isPublished) return;

    const followsTitle =
      current === "" || current === lastGenerated.current || current === slugFromTitle(previousTitle);
    const next = slugFromTitle(title);
    if (!followsTitle || !next) return;
    lastGenerated.current = next;
    onChange(set({ _type: "slug", current: next }));
  }, [title, current, readOnly, isPublished, onChange]);

  return props.renderDefault(props);
}
