import type { Metadata } from "next";
import { OwnerDashboardHomePage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Owner Dashboard | Vantaged",
  description:
    "Oversee your verified construction projects, milestones, stage approvals, and live telemetry on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerDashboardHomePage />
    </main>
  );
}
