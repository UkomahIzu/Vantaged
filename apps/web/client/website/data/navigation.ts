import type { NavItem } from "../types";

export const defaultNavLinks: NavItem[] = [
  {
    id: "nav-home",
    label: "Home",
    href: "#home",
    description: "Milestone verification and site progress overview",
  },
  {
    id: "nav-stakeholders",
    label: "Stakeholders",
    href: "#stakeholders",
    description: "Tailored verification tools for contractors, property owners, and trade specialists",
    children: [
      {
        id: "nav-stakeholder-contractors",
        label: "Contractors",
        href: "#stakeholders-contractors",
        description: "Milestone proof submissions, automated stage payouts, and site compliance.",
      },
      {
        id: "nav-stakeholder-owners",
        label: "Owners",
        href: "#stakeholders-owners",
        description: "Real-time inspection telemetry, tamper-proof audit trails, and escrow release.",
      },
      {
        id: "nav-stakeholder-subcontractors",
        label: "Sub-contractors",
        href: "#stakeholders-subcontractors",
        description: "Task verification, materials sign-off, and direct work-order settlements.",
      },
    ],
  },
  {
    id: "nav-the-advantage",
    label: "The Advantage",
    href: "#the-advantage",
    description: "Tamper-proof GPS verification, automated escrow, and immutable audit logs",
  },
  {
    id: "nav-pricing",
    label: "Pricing",
    href: "#pricing",
    description: "Milestone escrow tiers, verification inspection fees, and enterprise plans",
  },
  {
    id: "nav-support",
    label: "Support",
    href: "#support",
    description: "24/7 client desk, engineer dispatch, and technical documentation",
  },
];
