import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

type LinkValue = {
  linkType?: "url" | "pdf";
  href?: string;
  pdfFile?: { asset?: { url?: string; originalFilename?: string } };
  openInNewTab?: boolean;
};

type TableValue = {
  rows?: { cells?: string[] }[];
  headerRow?: boolean;
  style?: "default" | "striped" | "compact";
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function headingText(value: unknown): string {
  const children = (value as { children?: unknown[] } | undefined)?.children;
  if (!Array.isArray(children)) return "";
  return children.map((c) => (c as { text?: string }).text ?? "").join("");
}

function AnchorHeading({
  as: Tag,
  className,
  value,
  children,
}: {
  as: "h2" | "h3";
  className: string;
  value: unknown;
  children: React.ReactNode;
}) {
  const id = slugify(headingText(value));
  return (
    <Tag id={id} className={`group scroll-mt-24 ${className}`}>
      <a
        href={`#${id}`}
        className="mr-2 opacity-0 group-hover:opacity-100 text-teal no-underline"
        aria-hidden="true"
      >
        #
      </a>
      {children}
    </Tag>
  );
}

const tableStyleClasses: Record<NonNullable<TableValue["style"]>, string> = {
  default: "[&_td]:py-2 [&_th]:py-2 [&_td]:px-3 [&_th]:px-3",
  striped: "[&_td]:py-2 [&_th]:py-2 [&_td]:px-3 [&_th]:px-3 [&_tbody_tr:nth-child(odd)]:bg-slate-50",
  compact: "[&_td]:py-1 [&_th]:py-1 [&_td]:px-2 [&_th]:px-2 text-sm",
};

export const richTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: LinkValue }) => {
      const isPdf = value?.linkType === "pdf";
      const href = isPdf ? value?.pdfFile?.asset?.url : value?.href;
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
      <AnchorHeading as="h2" className="font-display font-bold text-navy text-2xl mb-3 mt-8" value={value}>
        {children}
      </AnchorHeading>
    ),
    h3: ({ children, value }) => (
      <AnchorHeading as="h3" className="font-display font-semibold text-navy text-xl mb-2 mt-6" value={value}>
        {children}
      </AnchorHeading>
    ),
  },
  types: {
    image: ({ value }) => (
      <Image
        src={urlFor(value).width(1000).url()}
        alt={value.alt ?? ""}
        width={1000}
        height={700}
        className="rounded-lg w-full h-auto my-6"
      />
    ),
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
