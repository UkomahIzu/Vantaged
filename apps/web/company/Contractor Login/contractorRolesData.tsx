import React from "react";

export type ContractorRoleType =
  | "DIRECTOR"
  | "SITE_MANAGER"
  | "OFFICE_COORDINATOR"
  | "CREW_MEMBER";

export interface ContractorRoleCardData {
  id: ContractorRoleType;
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  defaultEmail: string;
  permissionsSummary: string;
  icon: React.ReactNode;
}

export const contractorRoleCards: ContractorRoleCardData[] = [
  {
    id: "DIRECTOR",
    stepNumber: 1,
    title: "Director",
    tagline: "Executive & Legal Entity",
    description: "Company profile, subscription, banking details, all projects and escrow payouts.",
    defaultEmail: "b.adeleke@apexstructure.ng",
    permissionsSummary: "Full administrative & financial authority across all company projects.",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <circle cx="12" cy="11" r="2.5" />
        <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
      </svg>
    ),
  },
  {
    id: "SITE_MANAGER",
    stepNumber: 2,
    title: "Site Manager",
    tagline: "Field Operations & Quality",
    description: "Runs work on site: assigns crews, submits milestone proof, manages GPS check-ins and stage fixes.",
    defaultEmail: "site.manager@apexstructure.ng",
    permissionsSummary: "Field command: stage submissions, slump tests, and site inspections.",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
        <path d="M12 2a5 5 0 0 0-5 5v5h10V7a5 5 0 0 0-5-5z" />
        <path d="M12 12v4" />
      </svg>
    ),
  },
  {
    id: "OFFICE_COORDINATOR",
    stepNumber: 3,
    title: "Office Coordinator",
    tagline: "Admin & Contracts",
    description: "Office duties: documents, client messaging, invoice reconciliation and payment confirmations.",
    defaultEmail: "coordinator@apexstructure.ng",
    permissionsSummary: "Administrative submittals, client messaging, and accounts reconciliation.",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    ),
  },
  {
    id: "CREW_MEMBER",
    stepNumber: 4,
    title: "Crew Member",
    tagline: "Site Worker & Specialist",
    description: "Field worker login: submit daily photo/video proof, complete assigned tasks, and earn reward points.",
    defaultEmail: "crew.lead@apexstructure.ng",
    permissionsSummary: "Assigned projects only: proof uploads and daily task execution.",
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
];

