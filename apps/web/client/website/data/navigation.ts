import type { NavItem } from "../types";

export const defaultNavLinks: NavItem[] = [
  {
    id: "nav-home",
    label: "Home",
    href: "/",
    description: "Milestone verification and site progress overview",
  },
  {
    id: "nav-stakeholders",
    label: "Stakeholders",
    href: "/stakeholders",
    description: "Tailored verification tools for contractors, property owners, and trade specialists",
    children: [
      {
        id: "nav-stakeholder-owners",
        label: "Owners & Investors",
        href: "/stakeholders/owners",
        description: "Milestone-gated escrow custody, verified stage proof, and full remote oversight.",
      },
      {
        id: "nav-stakeholder-contractors",
        label: "Contractors & Builders",
        href: "/stakeholders/contractors",
        description: "Guaranteed stage payments, structured milestone submissions, and verified reputation.",
      },
      {
        id: "nav-stakeholder-subcontractors",
        label: "Specialists & Engineers",
        href: "/stakeholders/specialists",
        description: "Standardized inspection audits, material test certifications, and liability protection.",
      },
    ],
  },
  {
    id: "nav-the-advantage",
    label: "The Advantage",
    href: "/the-advantage",
    description: "Tamper-proof GPS verification, automated escrow, and immutable audit logs",
  },
  {
    id: "nav-pricing",
    label: "Pricing",
    href: "/pricing",
    description: "Milestone escrow tiers, verification inspection fees, and enterprise plans",
  },
  {
    id: "nav-support",
    label: "Support",
    href: "/support",
    description: "24/7 client desk, engineer dispatch, and technical documentation",
  },
];
