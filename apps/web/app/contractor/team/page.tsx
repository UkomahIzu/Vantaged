import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorTeamPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Team & Crew | Vantaged",
  description:
    "Manage company directors, site managers, office coordinators, and field crew personnel on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorTeamPage />
      </Suspense>
    </main>
  );
}
