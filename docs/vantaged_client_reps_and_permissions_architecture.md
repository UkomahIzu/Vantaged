# Vantaged: Client Representatives & Modular Permissions Architecture

## 1. Overview & Core Philosophy
In Vantaged, the **Client Admin (Owner)** is the primary account holder with absolute governance over their construction portfolio. However, in diaspora and commercial building contexts, owners frequently appoint trusted on-the-ground technical experts (COREN structural engineers, registered architects, quantity surveyors) or family proxies.

Rather than building an entirely distinct dashboard for representatives, **Client Reps access the same unified client dashboard**, dynamically scoped by two rules:
1. **Site Assignment (Project Scope)**: Reps only see the specific project sites assigned to them.
2. **Modular Permission Matrix (PRD §5.2)**: Buttons, financial metrics, and navigation links dynamically show or hide based on the granular modules granted by the Owner Admin.

---

## 2. The 7 Modular Permissions (PRD §5.2 & SRD §6.3)

| Module ID | Module Name | What It Grants When Enabled | When Disabled (Fallback) | Typical Role |
| :--- | :--- | :--- | :--- | :--- |
| `viewProgress` | **View Progress** | Can view the project dashboard, stage milestones, contractor proof photos/videos, timeline, and verified vs reported progress. | Cannot access project dashboards; no visibility into progress. | Default for all appointed representatives |
| `approveStages` | **Approve / Reject Stages** | Can review contractor photo/video evidence, inspect technical compliance, and formally sign off (or reject) milestones. | Read-only view of stages; can leave technical comments but cannot issue final sign-off. | Consulting Structural Engineer, Resident Architect |
| `managePayments` | **Payments & Escrow** | Can view full financial valuations, review contractor BOQ line items, record receipts, and authorize escrow tranche disbursements. | Financial balances, bank details, and escrow payout release buttons are hidden. | Quantity Surveyor (QS), Commercial Director |
| `changeRequests` | **Change Requests (Variations)** | Can review contractor variation claims, suggest plan adjustments, and approve or flag extra cost orders. | Variation requests are read-only; cannot approve changes. | Lead Project Consultant, QS |
| `messageContractor` | **Direct Site Chat** | Has full access to the direct messaging channel with the contractor's site manager, office coordinator, and lead engineer. | Read-only access or disabled chat window. | All Active Site Representatives & Proxies |
| `manageShareLinks` | **Manage Share Links** | Can generate temporary read-only web observer links for family, co-investors, or external surveyors. | Cannot create or revoke share links. | Senior Representative / Family Lead |
| `invitePeople` | **Invite People (Rare)** | Can dispatch invitations to other sub-consultants or additional contractors on the project. | Cannot invite or manage other reps or contractors. | Executive Owner Proxy |

---

## 3. Owner Admin vs. Client Rep Privileges

### Privileges Reserved Exclusively for Owner Admin:
- Paying for Vantaged platform subscriptions (Tier tiers & construction slot upgrades).
- Inviting, updating permissions for, or suspending Client Reps (`/owner/client-reps`).
- Creating a new project brief or hiring a new contractor from the directory (`/owner/find-companies`).
- Final project plan lock, contract execution, and archiving.

---

## 4. Implementation Blueprint (When Ready to Wire Up)

### 4.1 Enhanced User Interface (`useCurrentUser.ts`)
```ts
export interface CurrentUser {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  role: "Owner Admin" | "Client Rep";
  // Present when role === "Client Rep"
  assignedProjectIds?: string[];
  permissions?: {
    viewProgress: boolean;
    approveStages: boolean;
    managePayments: boolean;
    changeRequests: boolean;
    messageContractor: boolean;
    manageShareLinks: boolean;
    invitePeople: boolean;
  };
}
```

### 4.2 Sidebar Navigation Filtering (`SidebarNav.tsx`)
```tsx
const { role, permissions } = useCurrentUser();
const isOwner = role === "Owner Admin";

const navItems = [
  { id: "home", label: "Home", ... },
  { id: "projects", label: "Projects", ... },
  // Transactions visible only to Owner or Reps with managePayments
  ...(isOwner || permissions?.managePayments ? [{ id: "transactions", label: "Transactions", ... }] : []),
  // Directory & Rep Management strictly for Owner Admin
  ...(isOwner ? [
    { id: "find-companies", label: "Find companies", ... },
    { id: "client-reps", label: "Client Reps", ... },
  ] : []),
  { id: "messages", label: "Messages", ... },
  { id: "disputes", label: "Disputes", ... },
];
```

### 4.3 Scoping Projects on Dashboard Home & Directory
```tsx
const { role, assignedProjectIds } = useCurrentUser();
const isOwner = role === "Owner Admin";

// Owners see all portfolio sites; Reps see only delegated sites
const visibleProjects = projects.filter(
  (p) => isOwner || assignedProjectIds?.includes(p.id)
);
```

### 4.4 Action Gating in Milestone & Financial Views
```tsx
const { role, permissions } = useCurrentUser();
const canApprove = role === "Owner Admin" || permissions?.approveStages;
const canReleaseFunds = role === "Owner Admin" || permissions?.managePayments;

// In Stage Review component:
{canApprove && (
  <button onClick={handleSignOff} className="btn-approve">
    Sign Off Milestone Clearance
  </button>
)}

// In Escrow component:
{canReleaseFunds ? (
  <button onClick={handleDisburseTranche} className="btn-disburse">
    Authorize Tranche Release
  </button>
) : (
  <span className="text-muted">Escrow approval reserved for Owner / QS</span>
)}
```

---

## 5. Development Mode Simulation (Role Switcher)
During testing, a quick role-switch toggle can be placed inside the user profile popover in `SidebarNav`:
- **Active Profile**: `Owner Admin (James Robinson)`
- **Switch to**: `Client Rep (Engr. Babatunde Adeleke)` $\rightarrow$ assigned to Lekki Villa & Kolawole Tower with `approveStages` enabled, `managePayments` disabled.
- **Switch to**: `Client Rep (QS Femi Oladipo)` $\rightarrow$ assigned to Enclave Waterfront with `managePayments` enabled.
