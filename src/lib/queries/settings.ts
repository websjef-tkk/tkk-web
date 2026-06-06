import { sanityClient } from "../sanity";

export interface SiteSettings {
  heroTitle?: { no: string; en?: string };
  heroSubtitle?: { no: string; en?: string };
  footerText?: { no: string; en?: string };
  instagram?: string;
  facebook?: string;
  visitingAddress?: string;
  postalAddress?: string;
  phone?: string;
  orgNr?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "siteSettings"][0] {
        heroTitle,
        heroSubtitle,
        footerText,
        instagram,
        facebook,
        visitingAddress,
        postalAddress,
        phone,
        orgNr
      }`
    );
  } catch {
    return null;
  }
}

export interface NavLabels {
  home?: { no: string; en?: string };
  activities?: { no: string; en?: string };
  disciplines?: { no: string; en?: string };
  seaKayaking?: { no: string; en?: string };
  riverKayaking?: { no: string; en?: string };
  flatwater?: { no: string; en?: string };
  surfski?: { no: string; en?: string };
  polo?: { no: string; en?: string };
  junior?: { no: string; en?: string };
  hms?: { no: string; en?: string };
  hmsGeneral?: { no: string; en?: string };
  hmsSea?: { no: string; en?: string };
  hmsRiver?: { no: string; en?: string };
  hmsAlert?: { no: string; en?: string };
  hmsIncidents?: { no: string; en?: string };
  hmsCriminalRecord?: { no: string; en?: string };
  club?: { no: string; en?: string };
  clubAdmin?: { no: string; en?: string };
  clubhouse?: { no: string; en?: string };
  socialGroup?: { no: string; en?: string };
  grants?: { no: string; en?: string };
  reimbursement?: { no: string; en?: string };
  blog?: { no: string; en?: string };
  membership?: { no: string; en?: string };
  contact?: { no: string; en?: string };
  login?: { no: string; en?: string };
  profile?: { no: string; en?: string };
  logout?: { no: string; en?: string };
  register?: { no: string; en?: string };
}

export async function getNavLabels(): Promise<NavLabels | null> {
  try {
    return await sanityClient.fetch(`*[_type == "navLabels"][0]`);
  } catch {
    return null;
  }
}
