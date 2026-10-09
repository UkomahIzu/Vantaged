export interface SubNavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  description?: string;
  children?: SubNavItem[];
  footerNote?: string;
}

export interface HeroData {
  badge: string;
  year: string;
  headline: {
    line1: string;
    line2: string;
  };
  subheadline: string;
  inspectionVideo: {
    title: string;
    duration: string;
    gpsCoords: string;
    status: string;
    description: string;
  };
  activeInspection: {
    stage: string;
    stageIndex: string;
    stageName: string;
    verifiedAmount: string;
    gpsRadius: string;
    location: string;
    photosCount: number;
    videosCount: number;
  };
  navigation: {
    brandName: string;
    platformTag: string;
    roles: Array<{ label: string; active?: boolean }>;
    ctaLabel: string;
    ctaHref: string;
  };
  footerNotice: {
    tagline: string;
    badges: string[];
  };
}
