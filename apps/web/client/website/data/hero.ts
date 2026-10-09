import type { HeroData } from "../types";

export const heroContent: HeroData = {
  badge: "VERIFIED VS REPORTED",
  year: "2026",
  headline: {
    line1: "BUILD ON PROOF,",
    line2: "NOT PROMISES.",
  },
  subheadline:
    "Enterprise milestone verification, tamper-proof site geofencing, and automated stage payments for African construction projects.",
  inspectionVideo: {
    title: "LIVE SITE INSPECTION FEED",
    duration: "0:42",
    gpsCoords: "6.4474° N, 3.4211° E",
    status: "DPC CAST VERIFIED",
    description:
      "Captured on-site via mobile app. SHA-256 stamped with GPS coordinate telemetry within 200m perimeter.",
  },
  activeInspection: {
    stage: "STAGE 02 / 06",
    stageIndex: "02",
    stageName: "Decking, Columns & Structural Beams",
    verifiedAmount: "₦48,500,000",
    gpsRadius: "200m Site Perimeter Locked",
    location: "Lekki Phase 1, Lagos",
    photosCount: 14,
    videosCount: 2,
  },
  navigation: {
    brandName: "vantaged",
    platformTag: "BUILDTRACK v1.0",
    roles: [
      { label: "CLIENT", active: true },
      { label: "CONTRACTOR", active: false },
    ],
    ctaLabel: "Launch Console",
    ctaHref: "#explore",
  },
  footerNotice: {
    tagline:
      "FOR CLIENTS & REGISTERED BUILDERS. PROGRESS RECORDED IMMUTABLY. ALL RIGHTS RESERVED.",
    badges: ["CAC ACCREDITED", "NDPA COMPLIANT", "COREN REGISTERED"],
  },
};
