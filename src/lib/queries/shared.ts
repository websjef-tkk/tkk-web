export interface SeoField {
  metaTitle?: { no?: string };
  metaDescription?: { no?: string };
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
    no[]{ ..., ${markDefsExpansion} }
  }
`;
