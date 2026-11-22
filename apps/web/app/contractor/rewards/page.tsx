import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorRewardsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Team Rewards | Vantaged",
  description:
    "Reward site managers, office staff, and crew members for fast receipts, clean inspections, and daily site photos on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorRewardsPage />
      </Suspense>
    </main>
  );
}
