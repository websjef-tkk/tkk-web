export interface SeoField {
  metaTitle?: { no?: string };
  metaDescription?: { no?: string };
  ogImage?: { asset?: { _ref: string } };
}

const markDefsExpansion = `
  markDefs[]{
    ...,
    _type == "link" => {
      ...,
      page->{ _type, "slug": slug.current, discipline },
      pdfFile{ asset->{ url, originalFilename, size } }
    }
  }
`;

export const bodyProjection = `
  body {
    no[]{ ..., ${markDefsExpansion} }
  }
`;
