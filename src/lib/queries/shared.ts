export interface SeoField {
  metaTitle?: { no?: string; en?: string };
  metaDescription?: { no?: string; en?: string };
  ogImage?: { asset?: { _ref: string } };
}

const markDefsExpansion = `
  markDefs[]{
    ...,
    _type == "link" => { ..., pdfFile{ asset->{ url, originalFilename, size } } }
  }
`;

export const bodyProjection = `
  body {
    no[]{ ..., ${markDefsExpansion} },
    en[]{ ..., ${markDefsExpansion} }
  }
`;
