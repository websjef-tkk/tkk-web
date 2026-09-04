import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { resolveContentLink, type ContentLinkPage } from "@/lib/linkResolver";

type LinkValue = {
  linkType?: "page" | "url" | "pdf" | "anchor";
  href?: string;
  page?: ContentLinkPage;
  pdfFile?: { asset?: { url?: string; originalFilename?: string } };
  openInNewTab?: boolean;
  anchorBlockKey?: string;
};

type TableValue = {
  rows?: { cells?: string[] }[];
  headerRow?: boolean;
  style?: "default" | "striped" | "compact";
};

const tableStyleClasses: Record<NonNullable<TableValue["style"]>, string> = {
  default: "[&_td]:py-2 [&_th]:py-2 [&_td]:px-3 [&_th]:px-3",
  striped: "[&_td]:py-2 [&_th]:py-2 [&_td]:px-3 [&_th]:px-3 [&_tbody_tr:nth-child(odd)]:bg-slate-50",
  compact: "[&_td]:py-1 [&_th]:py-1 [&_td]:px-2 [&_th]:px-2 text-sm",
};

type ImageValue = {
  alt?: string;
  caption?: string;
  credit?: string;
  size?: "small" | "medium" | "large" | "full";
  alignment?: "left" | "center" | "right";
  aspectRatio?: "auto" | "16:9" | "4:3" | "1:1" | "3:4";
};

const sizeToWidth: Record<NonNullable<ImageValue["size"]>, number> = {
  small: 480,
  medium: 720,
  large: 1000,
  full: 1600,
};

const aspectRatioToNumber: Record<Exclude<NonNullable<ImageValue["aspectRatio"]>, "auto">, number> = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "3:4": 3 / 4,
};

const alignmentClasses: Record<NonNullable<ImageValue["alignment"]>, string> = {
  left: "float-left mr-6 mb-4 max-w-[50%]",
  right: "float-right ml-6 mb-4 max-w-[50%]",
  center: "mx-auto",
};

export const richTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: LinkValue }) => {
      const isPdf = value?.linkType === "pdf";
      const isAnchor = value?.linkType === "anchor";
      const href = isPdf
        ? value?.pdfFile?.asset?.url
        : isAnchor
          ? value?.anchorBlockKey
            ? `#${value.anchorBlockKey}`
            : undefined
          : resolveContentLink(value);
      if (!href) return <>{children}</>;
      const newTab = !!value?.openInNewTab;
      return (
        <a
          href={href}
          className="text-teal underline hover:text-navy"
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          download={isPdf ? value?.pdfFile?.asset?.originalFilename : undefined}
        >
          {children}
          {isPdf && <span className="text-xs align-super ml-0.5">(PDF)</span>}
        </a>
      );
    },
  },
  block: {
    h2: ({ children, value }) => (
      <h2 id={value._key} className="font-display font-bold text-navy text-2xl mb-3 mt-8 scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={value._key} className="font-display font-semibold text-navy text-xl mb-2 mt-6 scroll-mt-24">
        {children}
      </h3>
    ),
  },
  types: {
    image: ({ value }: { value: ImageValue & { asset?: unknown; hotspot?: unknown; crop?: unknown } }) => {
      const size = value.size ?? "large";
      const width = sizeToWidth[size];
      const ratio = value.aspectRatio && value.aspectRatio !== "auto" ? aspectRatioToNumber[value.aspectRatio] : undefined;
      const height = ratio ? Math.round(width / ratio) : Math.round(width * 0.7);
      let builder = urlFor(value).width(width);
      if (ratio) builder = builder.height(height).fit("crop");
      const alignClass = size === "full" ? "mx-auto w-full" : alignmentClasses[value.alignment ?? "center"];
      return (
        <figure className={`not-prose my-6 ${alignClass}`}>
          <Image
            src={builder.url()}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            className="rounded-lg w-full h-auto"
          />
          {(value.caption || value.credit) && (
            <figcaption className="text-sm text-slate/70 mt-2">
              {value.caption}
              {value.caption && value.credit && " — "}
              {value.credit && <span className="italic">{value.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    },
    table: ({ value }: { value: TableValue }) => {
      const rows = value.rows ?? [];
      const headerRow = value.headerRow ?? true;
      const styleClass = tableStyleClasses[value.style ?? "default"];
      const [head, ...rest] = rows;
      const bodyRows = headerRow ? rest : rows;
      return (
        <div className="overflow-x-auto my-6">
          <table className={`w-full border-collapse border border-mist ${styleClass}`}>
            {headerRow && head && (
              <thead>
                <tr>
                  {head.cells?.map((cell, i) => (
                    <th key={i} className="border border-mist bg-tkk-blue/20 text-left font-semibold text-navy">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, i) => (
                <tr key={i}>
                  {row.cells?.map((cell, j) => (
                    <td key={j} className="border border-mist">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};
