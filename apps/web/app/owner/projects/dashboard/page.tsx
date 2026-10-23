import type { Metadata } from "next";
import { ProjectOverviewPage } from "../../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Project Dashboard | Vantaged",
  description: "Verified telemetry, milestones, escrow finances, and team monitoring for your building project.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectOverviewPage projectId="proj-lekki" />
    </main>
  );
}
