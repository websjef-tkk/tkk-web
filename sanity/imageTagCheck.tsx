import { useEffect, useRef, useState } from "react";
import {
  useClient,
  useFormValue,
  type DocumentActionComponent,
  type InputProps,
  type SchemaType,
} from "sanity";
import { IMAGE_TAGS } from "./schemas/objects/imageTags";

/**
 * Kravet om at bilder skal ha minst én merkelapp i mediebiblioteket, slik at
 * de går an å finne igjen. Merkelappene ligger på selve bildet
 * (`opt.media.tags`, satt av sanity-plugin-media), ikke i dokumentet. Derfor
 * er dette ikke en vanlig feltvalidering: den kjøres bare på nytt når
 * dokumentet endres, og ville blitt stående etter at bildet var merket.
 * I stedet følger vi med på bildene direkte: merkelappene velges i
 * bildefeltet, og "Publiser"-knappen er sperret til alle bilder har en.
 */

const API_VERSION = "2024-01-01";

type UntaggedImage = { _id: string; originalFilename?: string };

/** Hvilke av bildene `refs` som mangler merkelapp. `undefined` til svaret er hentet. */
function useUntaggedImages(refs: string[]): UntaggedImage[] | undefined {
  const client = useClient({ apiVersion: API_VERSION });
  const key = [...new Set(refs)].sort().join(",");
  const [result, setResult] = useState<{ key: string; untagged: UntaggedImage[] }>();

  useEffect(() => {
    if (!key) return;
    const params = { refs: key.split(",") };
    let cancelled = false;
    const load = () =>
      client
        .fetch<UntaggedImage[]>(
          `*[_id in $refs && count(opt.media.tags[defined(@->_id)]) == 0]{ _id, originalFilename }`,
          params
        )
        .then((untagged) => !cancelled && setResult({ key, untagged }))
        .catch(() => undefined);
    load();
    const subscription = client
      .listen(`*[_id in $refs]`, params, { visibility: "query", includeResult: false })
      .subscribe({ next: load, error: () => undefined });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [client, key]);

  if (!key) return [];
  return result?.key === key ? result.untagged : undefined;
}

const isImageType = (schemaType: SchemaType | undefined): boolean =>
  schemaType ? schemaType.name === "image" || isImageType(schemaType.type) : false;

type AssetTag = { _id: string; name: string };

const tagReference = (id: string) => ({ _type: "reference", _ref: id, _weak: true });

/** Merkelappene på bildet `ref`, holdt oppdatert. `undefined` til svaret er hentet. */
function useAssetTags(ref: string | undefined) {
  const client = useClient({ apiVersion: API_VERSION });
  const [result, setResult] = useState<{ ref: string; tags: AssetTag[] }>();

  useEffect(() => {
    if (!ref) return;
    let cancelled = false;
    const load = () =>
      client
        .fetch<(AssetTag | null)[] | null>(`*[_id == $ref][0].opt.media.tags[]->{ _id, "name": name.current }`, { ref })
        .then((tags) => !cancelled && setResult({ ref, tags: (tags ?? []).filter((tag) => tag !== null) }))
        .catch(() => undefined);
    load();
    const subscription = client
      .listen(`*[_id == $ref]`, { ref }, { visibility: "query", includeResult: false })
      .subscribe({ next: load, error: () => undefined });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [client, ref]);

  const tags = ref && result?.ref === ref ? result.tags : undefined;
  const setTags = (next: AssetTag[]) => ref && setResult({ ref, tags: next });
  return [tags, setTags] as const;
}

const chipStyle = (selected: boolean) => ({
  padding: "4px 10px",
  borderRadius: 999,
  border: `1px solid ${selected ? "rgb(37, 99, 235)" : "rgba(148, 163, 184, 0.6)"}`,
  background: selected ? "rgb(37, 99, 235)" : "transparent",
  color: selected ? "white" : "inherit",
  font: "inherit",
  fontSize: "0.85em",
  cursor: "pointer",
});

/**
 * Merkelappene som knapper under bildet. Et klikk vises med en gang, og
 * lagres i bakgrunnen: flere raske klikk samles og lagres i rekkefølge, så
 * forfatteren aldri må vente på forrige lagring.
 */
function ImageTagPicker({ assetRef, readOnly }: { assetRef: string; readOnly?: boolean }) {
  const client = useClient({ apiVersion: API_VERSION });
  const [tags, setTags] = useAssetTags(assetRef);
  // Valgene slik forfatteren har klikket dem, mens de ennå ikke er lagret.
  const [pending, setPending] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const desired = useRef<string[] | null>(null);
  const saving = useRef(false);
  const tagIds = useRef(new Map<string, string>());

  // Henter ID-ene til merkelappene på forhånd, så et klikk bare trenger én lagring.
  useEffect(() => {
    client
      .fetch<AssetTag[]>(`*[_type == "media.tag"]{ _id, "name": name.current }`)
      .then((all) => all.forEach((tag) => tagIds.current.set(tag.name, tag._id)))
      .catch(() => undefined);
  }, [client]);

  if (!tags) return null;
  const selected = pending ?? tags.map((tag) => tag.name);

  const save = async () => {
    saving.current = true;
    tags.forEach((tag) => tagIds.current.set(tag.name, tag._id));
    try {
      let saved: AssetTag[] | undefined;
      // Går på nytt så lenge forfatteren har klikket videre mens forrige lagring pågikk.
      while (desired.current) {
        const names = desired.current;
        const next: AssetTag[] = [];
        for (const name of names) {
          // Merkelappen opprettes første gang den brukes.
          const id =
            tagIds.current.get(name) ??
            (await client.create({ _type: "media.tag", name: { _type: "slug", current: name } }))._id;
          tagIds.current.set(name, id);
          next.push({ _id: id, name });
        }
        await client
          .patch(assetRef)
          .setIfMissing({ opt: {} })
          .setIfMissing({ "opt.media": {} })
          .set({ "opt.media.tags": next.map((tag) => tagReference(tag._id)) })
          .commit();
        if (desired.current === names) {
          saved = next;
          desired.current = null;
        }
      }
      if (saved) setTags(saved);
    } catch {
      desired.current = null;
      setFailed(true);
    } finally {
      saving.current = false;
      setPending(desired.current);
    }
  };

  const toggle = (name: string) => {
    const next = selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name];
    desired.current = next;
    setPending(next);
    setFailed(false);
    if (!saving.current) save();
  };

  // Den faste listen, pluss merkelapper bildet eventuelt har fått i "Media".
  const names = [...new Set([...IMAGE_TAGS, ...selected])];
  const missing = selected.length === 0;

  return (
    <div
      role="group"
      aria-label="Merkelapper"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        borderRadius: 4,
        padding: "8px 10px",
        border: `1px solid ${missing ? "rgba(245, 158, 11, 0.6)" : "rgba(148, 163, 184, 0.3)"}`,
        background: missing ? "rgba(245, 158, 11, 0.18)" : "transparent",
      }}
    >
      <span style={{ fontSize: "0.85em", lineHeight: 1.5 }}>
        {missing
          ? "Velg minst én merkelapp for bildet. Dokumentet kan ikke publiseres før det er gjort."
          : "Merkelapper for bildet"}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {names.map((name) => {
          const isSelected = selected.includes(name);
          return (
            <button
              key={name}
              type="button"
              aria-pressed={isSelected}
              disabled={readOnly}
              onClick={() => toggle(name)}
              style={chipStyle(isSelected)}
            >
              {name}
            </button>
          );
        })}
      </div>
      {failed && (
        <span role="alert" style={{ fontSize: "0.85em" }}>
          Klarte ikke å lagre merkelappen. Prøv igjen.
        </span>
      )}
    </div>
  );
}

/**
 * Bildefeltet med merkelappene rett under bildet, slik at bildet kan merkes
 * idet det lastes opp. Valgene lagres på selve bildet, på samme måte som i
 * "Media"-verktøyet, og gjelder derfor overalt der bildet brukes.
 */
function ImageInputWithTags(props: InputProps) {
  const ref = (props.value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  // Bilder som følger med fra iSonen lastes opp av synkroniseringen, uten merkelapp.
  const imported = Boolean(useFormValue(["externalSource"]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {props.renderDefault(props)}
      {ref && !imported && <ImageTagPicker key={ref} assetRef={ref} readOnly={props.readOnly} />}
    </div>
  );
}

/** Legges på alle felt (`form.components.input`), og viser merkelappene på bildefeltene. */
export function imageTagNoticeInput(props: InputProps) {
  return isImageType(props.schemaType) ? <ImageInputWithTags {...props} /> : props.renderDefault(props);
}

function imageRefs(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) imageRefs(item, found);
  } else if (value && typeof value === "object") {
    const node = value as { _type?: string; asset?: { _ref?: string } };
    if (node._type === "image" && node.asset?._ref) found.push(node.asset._ref);
    for (const child of Object.values(node)) imageRefs(child, found);
  }
  return found;
}

const wrapped = new WeakMap<DocumentActionComponent, DocumentActionComponent>();

/** "Publiser" som er sperret så lenge dokumentet har bilder uten merkelapp. */
export function publishWithImageTagCheck(originalPublish: DocumentActionComponent): DocumentActionComponent {
  // Samme komponent hver gang, se publishWithPathSync.
  const cached = wrapped.get(originalPublish);
  if (cached) return cached;

  const PublishWithImageTagCheck: DocumentActionComponent = (props) => {
    const original = originalPublish(props);
    const untagged = useUntaggedImages(props.draft && !props.draft.externalSource ? imageRefs(props.draft) : []);
    if (!original || !untagged?.length) return original;

    const names = untagged.map((image) => image.originalFilename ?? "uten filnavn").join(", ");
    return { ...original, disabled: true, title: `Kan ikke publisere: bilde uten merkelapp (${names})` };
  };
  PublishWithImageTagCheck.action = "publish";
  PublishWithImageTagCheck.displayName = "PublishWithImageTagCheck";
  wrapped.set(originalPublish, PublishWithImageTagCheck);
  return PublishWithImageTagCheck;
}
